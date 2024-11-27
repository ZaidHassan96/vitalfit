import React, { useState } from "react";
import "../stylesheets/BookClass.css";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig.js";

import { useUser } from "../context/User.jsx";
import BeatLoader from "react-spinners/BeatLoader";

import BookingSuccess from "./BookingSuccess.jsx";
import { setImage } from "../utils/utils.js";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const BookClass = ({
  showBookingCard,
  setShowBookingCard,
  singleClassData,
  setSingleClassData,
}) => {
  const { loggedInUser } = useUser();
  const [bookingCancelled, setBookingCancelled] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelingError, setCancelingError] = useState(false);
  const [bookingUpdating, setBookingUpdating] = useState(false);

  // OPTIMISTIC UI UPDATES
  const updateMembers = () => {
    setSingleClassData((prevObj) => ({
      ...prevObj,
      membersAttending: prevObj.membersAttending.filter(
        (member) => member.email !== loggedInUser.email
      ),
    }));
  };

  // HANDLING UPDATING MEMBERS ATTENDING ARRAY
  const handleUpdateDoc = async () => {
    setBookingUpdating(true);
    try {
      const classRef = doc(db, "classes", singleClassData.classId);

      await updateDoc(classRef, {
        membersAttending: arrayUnion({
          email: loggedInUser.email,
          addedToCalendar: false,
        }),
      });
      setBookingUpdating(false);
      setBookingConfirmed(true);
    } catch (error) {
      console.error("Error updating document: ", error);
      setBookingError(error);
      setBookingUpdating(false);
    }
  };

  const cancelBooking = async () => {
    setBookingUpdating(true);
    try {
      const classRef = doc(db, "classes", singleClassData.classId);
      // Reference to the class document
      if (loggedInUser && loggedInUser.isTrainer) {
        await deleteDoc(classRef);
        setCancelingError(false);

        setBookingCancelled(true);
      } else {
        const memberToRemove = singleClassData.membersAttending.find(
          (member) => member.email === loggedInUser.email
        );

        // Update the document by removing the user's email from the 'membersAttending' array
        await updateDoc(classRef, {
          membersAttending: arrayRemove(memberToRemove),
        });
        setCancelingError(false);
        setBookingCancelled(true);
        setBookingUpdating(false);
      }
    } catch (error) {
      setBookingUpdating(false);
      setCancelingError(true);
      console.error("Error canceling booking: ", error);
    }
  };

  let cancelled = "";
  console.log(singleClassData);

  const classAddedToCalendar = (singleClassData, loggedInUser) => {
    if (!singleClassData.membersAttending) {
      return; // Return false or another default value if membersAttending is not defined.
    }

    const member = singleClassData.membersAttending.find(
      (member) => member.email === loggedInUser.email
    );

    return member ? member.addedToCalendar : false; // Return false if member is not found.
  };

  if (loggedInUser && loggedInUser.isTrainer) {
    cancelled = "Class Successfully Cancelled";
  } else {
    cancelled = "Booking Successfully Cancelled";
  }

  return (
    <section>
      <div className={showBookingCard ? "booking-card" : "hide-booking-card"}>
        <div>
          <h2
            className="exit"
            onClick={() => {
              setBookingConfirmed(false);
              setBookingCancelled(false);
              setShowBookingCard(false);
              // setGoogleError(false);
              // setAddToCalendar(false);
            }}
          >
            X
          </h2>
        </div>
        {bookingCancelled || bookingConfirmed ? (
          bookingCancelled ? (
            <div>
              <TaskAltIcon
                style={{
                  color: "rgb(255, 77, 0)",
                  fontSize: "5rem",
                  marginTop: "20rem",
                }}
              />
              <h1 className="booking-cancelled">{cancelled}</h1>{" "}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <BookingSuccess singleClassData={singleClassData} />
            </div>
          )
        ) : (
          <div>
            <img
              src={setImage(singleClassData)}
              alt={singleClassData.classType}
            />
            <h1 className="booking-card-h1-p">{singleClassData.classType}</h1>
            <p className="booking-card-h1-p">{singleClassData.excerpt}</p>
            <p className="booking-card-h1-p">{singleClassData.date}</p>
            <p className="booking-card-h1-p">
              Time: {singleClassData.startTime}
            </p>
            <p className="booking-card-h1-p">
              Spaces remaining:&nbsp;&nbsp;
              {singleClassData?.classSize &&
              Array.isArray(singleClassData.membersAttending)
                ? singleClassData.classSize -
                  singleClassData.membersAttending.length
                : "N/A"}
            </p>
            <p className="booking-card-h1-p">{singleClassData.trainerName}</p>
            {Array.isArray(singleClassData.membersAttending) &&
            singleClassData.membersAttending.find(
              (member) => member.email === loggedInUser.email
            ) &&
            !classAddedToCalendar(singleClassData, loggedInUser) ? (
              <button>Add to Calendar</button>
            ) : null}
            <div className="booking-class-info">
              {loggedInUser &&
                singleClassData &&
                (loggedInUser.isTrainer ? (
                  // If the user is a trainer, only show the button if the class belongs to them
                  singleClassData.trainerName ===
                  loggedInUser.firstName + " " + loggedInUser.lastName ? (
                    <button onClick={cancelBooking}>Cancel Class</button> // Show Cancel Booking if it is their class
                  ) : // If the trainer is logged in but it's not their class, show nothing
                  null
                ) : // If the user is not a trainer, handle the booking or cancel logic for members
                Array.isArray(singleClassData.membersAttending) &&
                  singleClassData.membersAttending.find(
                    (member) => member.email === loggedInUser.email
                  ) ? (
                  bookingUpdating ? (
                    <BeatLoader color="rgb(255, 77, 0)" />
                  ) : (
                    <button onClick={cancelBooking}>Cancel Booking</button>
                  )
                ) : bookingUpdating ? (
                  <BeatLoader color="rgb(255, 77, 0)" />
                ) : (
                  <button
                    onClick={() => {
                      handleUpdateDoc();
                      updateMembers();
                    }}
                  >
                    Confirm Booking
                  </button>
                ))}
              {cancelingError &&
                loggedInUser &&
                (loggedInUser.isTrainer ? (
                  <p>Class could not be cancelled.</p>
                ) : (
                  <p>Booking could not be cancelled.</p>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookClass;
