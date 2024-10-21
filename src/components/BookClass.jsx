import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import "../stylesheets/BookClass.css";
import UserContext from "../context/User";
import Login from "./Login.jsx";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import { Navigate, useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";

const BookClass = ({
  showBookingCard,
  setShowBookingCard,
  singleClassData,
  setSingleClassData,
  classData,
}) => {
  const { loggedInUser } = useContext(UserContext);
  const [bookedMember, setBookedMember] = useState(false);
  const [bookingCancelled, setBookingCancelled] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [addToCalendar, setAddToCalendar] = useState(false);

  const CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  console.log(isAuthenticated);

  useEffect(() => {
    function initializeGAPI() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
        })
        .then(() => {
          console.log("Google API initialized");
        })
        .catch((error) => {
          console.error("Google API initialization failed", error);
        });
    }

    gapi.load("client:auth2", initializeGAPI);
  }, []);

  const handleGoogleLogin = async () => {
    console.log("Attempting to sign in...");
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      console.log("User already signed in");
      setIsAuthenticated(true);
    } else {
      try {
        const user = await authInstance.signIn();
        setIsAuthenticated(true);
        console.log("User signed in:", user.getBasicProfile().getName());
      } catch (error) {
        console.error("Error signing in", error);
        if (error.error === "popup_closed_by_user") {
          alert("Popup was closed before completion. Please try again.");
        }
      }
    }
  };

  console.log(singleClassData.date, classData);

  const classDate = singleClassData.date; // e.g., "Sun, Oct 27"
  const classTime = singleClassData.startTime; // e.g., "17:50"

  console.log(classDate);

  function dateTimeFormat(singleClassData) {
    if (!singleClassData) {
      return;
    } else {
      const classDate = singleClassData.date; // e.g., "Sun, Oct 27"
      const classTime = singleClassData.startTime; // e.g., "17:50"

      const today = new Date();
      const year = today.getFullYear(); // Use the current year

      // Format the date as "Month Day" (e.g., "Oct 27") and combine it with the current year
      const dateParts = classDate ? classDate.split(",")[1].trim() : true; // Get "Oct 27"
      const fullDateString = `${dateParts} ${year}`; // Combine with the year (e.g., "Oct 27 2024")

      // Create a new date string by combining the full date and time
      const startTimeString = `${fullDateString} ${classTime}`; // e.g., "Oct 27 2024 17:50"

      // Create a valid Date object
      const startTime = new Date(startTimeString);
      if (isNaN(startTime.getTime())) {
        console.error("Invalid date format for startTime:", startTimeString);
        alert("The class date or time is invalid.");
        return;
      }
      return startTime;
    }
  }

  const createEvent = async () => {
    const authInstance = gapi.auth2.getAuthInstance();
    const accessToken = authInstance.currentUser
      .get()
      .getAuthResponse().access_token;
    console.log("succesfully retrieved authresponse");

    if (!accessToken) {
      console.error("User is not authenticated");
      return;
    }
    console.log(singleClassData.date);
    const startTime = dateTimeFormat(singleClassData);
    // Event details
    const eventDetails = {
      summary: `${singleClassData.classType} Class`,
      description: `You have successfully booked a ${singleClassData.classType} class.`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: new Date(startTime.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
        timeZone: "America/Los_Angeles",
      },
    };

    // Set token for the API request
    gapi.client.setToken({ access_token: accessToken });

    try {
      const response = await gapi.client.request({
        path: `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
        method: "POST",
        body: eventDetails,
      });
      console.log("Event created:", response.result);
      alert("Class booked and added to your Google Calendar!");
    } catch (error) {
      console.error("Error creating event in Google Calendar:", error);
    }
  };
  // function membersAttendingOptimistic(singleClassData) {
  //   if (!singleClassData) {
  //     return;
  //   }

  //   setSingleClassData((prevObj) => {
  //     // If the logged-in user's email is already in the array, no need to add it again.
  //     if (
  //       prevObj.membersAttending &&
  //       prevObj.membersAttending.includes(loggedInUser.email)
  //     ) {
  //       return prevObj;
  //     }

  //     // Optimistically add the user's email to the membersAttending array
  //     return {
  //       ...prevObj, // Keep all the other properties unchanged
  //       membersAttending: [
  //         ...(prevObj.membersAttending || []), // Use the existing array or an empty array if it's undefined
  //         loggedInUser.email,
  //       ],
  //     };
  //   });
  // }

  const updateMembers = () => {
    setSingleClassData((prevObj) => ({
      ...prevObj,
      membersAttending: prevObj.membersAttending.filter(
        (member) => member.email !== loggedInUser.email
      ),
    }));
  };

  const handleUpdateDoc = async () => {
    try {
      const classRef = doc(db, "classes", singleClassData.classId);

      await updateDoc(classRef, {
        membersAttending: arrayUnion({
          email: loggedInUser.email,
          addedToCalendar: addToCalendar,
        }),
      });
      // membersAttendingOptimistic(singleClassData);
      setBookingConfirmed(true);
      console.log("Document updated successfully!");

      if (addToCalendar) {
        if (!isAuthenticated) {
          await handleGoogleLogin(); // Wait for login to complete
          createEvent(); // Call createEvent once login is successful
        } else {
          createEvent();
        }
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // useEffect(() => {
  //   // Check if singleClassData and classId are defined
  //   if (!singleClassData || !singleClassData.classId) {
  //     console.error("singleClassData or classId is undefined");
  //     return;
  //   }

  //   // Reference to the class document
  //   const classRef = doc(db, "classes", singleClassData.classId);

  //   // Set up the real-time listener
  //   const unsubscribe = onSnapshot(classRef, (snapshot) => {
  //     if (snapshot.exists()) {
  //       // Update the state with the latest document data
  //       setSingleClassData(snapshot.data());
  //       console.log("Document updated in real-time:", snapshot.data());
  //     } else {
  //       console.log("No such document!");
  //     }
  //   });

  //   // Clean up the listener when the component unmounts
  //   return () => unsubscribe();
  // }, [singleClassData?.classId]); //
  const cancelBooking = async () => {
    try {
      const classRef = doc(db, "classes", singleClassData.classId);
      // Reference to the class document
      if (loggedInUser && loggedInUser.isTrainer) {
        await deleteDoc(classRef);
        setBookingCancelled(true);
      } else {
        // const classRef = doc(db, "classes", singleClassData.classId);

        const memberToRemove = singleClassData.membersAttending.find(
          (member) => member.email === loggedInUser.email
        );

        // Update the document by removing the user's email from the 'membersAttending' array
        await updateDoc(classRef, {
          membersAttending: arrayRemove(memberToRemove),
        });

        console.log("Booking successfully canceled!");
        setBookingCancelled(true);
      }
    } catch (error) {
      console.error("Error canceling booking: ", error);
    }
  };

  const findMember = (singleClassData) => {
    return singleClassData.membersAttending.find(
      (member) => member.email === loggedInUser.email
    );
  };
  console.log(addToCalendar);

  // console.log(loggedInUser.firstName + " " + loggedInUser.lastName);

  // function handleBooking() {
  //   if (!loggedInUser){

  //   }
  // }

  // const updateUserClasses = async (userId, updatedData) => {

  //   try {
  //     await updateDoc(doc(db, "users", userId), {
  //       bookedClasse
  //     })

  //   }

  //   catch (error) {

  //   }

  // }

  function setImage(singleClassData) {
    let imageFile = "";
    if (singleClassData.classType === "Hiit Mania") {
      imageFile = "../images/hiit.jpg";
    } else if (singleClassData.classType === "Spin Class") {
      imageFile = "../images/spin.jpg";
    } else {
      imageFile = "../images/yoga.jpg";
    }
    return imageFile;
  }
  console.log(bookingCancelled);

  console.log(singleClassData.membersAttending);

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
            }}
          >
            X
          </h2>
        </div>
        {bookingCancelled || bookingConfirmed ? (
          bookingCancelled ? (
            <h1 className="booking-cancelled">
              Booking successfully cancelled
            </h1>
          ) : (
            <h1 className="booking-confirmed">Booking Confirmed</h1>
          )
        ) : (
          <div>
            <img src={setImage(singleClassData)} alt="" />
            <h1>{singleClassData.classType}</h1>
            <p>{singleClassData.excerpt}</p>
            <p>{singleClassData.date}</p>
            <p>Time: {singleClassData.startTime}</p>
            <p>spaces remaining</p>
            <p>{singleClassData.trainerName}</p>
            <div className="booking-class-info">
              {singleClassData &&
              loggedInUser &&
              singleClassData.membersAttending &&
              !findMember(singleClassData) &&
              !loggedInUser.isTrainer ? (
                <label className="calendar" htmlFor="agree">
                  Add to Google Calendar
                  <input
                    className="calendar"
                    type="checkbox"
                    id="agree"
                    name="agree"
                    value="agree"
                    onChange={(e) => setAddToCalendar(e.target.checked)}
                  />
                </label>
              ) : (
                true
              )}

              {loggedInUser && singleClassData ? (
                loggedInUser.isTrainer ? (
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
                  <button onClick={cancelBooking}>Cancel Booking</button>
                ) : (
                  <button
                    onClick={() => {
                      handleUpdateDoc();
                      updateMembers();
                    }}
                  >
                    Confirm Booking
                  </button>
                )
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookClass;
