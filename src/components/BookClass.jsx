import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import "../stylesheets/BookClass.css";
import UserContext from "../context/User";
import Login from "./Login.jsx";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig.js";

const BookClass = ({
  showBookingCard,
  setShowBookingCard,
  singleClassData,
  classData,
}) => {
  const { loggedInUser } = useContext(UserContext);
  const [bookedMember, setBookedMember] = useState(false);

  const handleUpdateDoc = async () => {
    try {
      const classRef = doc(db, "classes", singleClassData.classId);

      await updateDoc(classRef, {
        membersAttending: arrayUnion(loggedInUser.email),
      });

      console.log("Document updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
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

  return (
    <section>
      <div className={showBookingCard ? "booking-card" : "hide-booking-card"}>
        <div>
          <h2
            className="exit"
            onClick={() => {
              setShowBookingCard(false);
            }}
          >
            X
          </h2>
        </div>
        <img src="../images/projects.jpg" alt="" />
        <h1>{singleClassData.classType}</h1>
        <p>{singleClassData.excerpt}</p>
        <p>{singleClassData.date}</p>
        <p>Time: {singleClassData.startTime}</p>
        <p>spaces remaining</p>
        <p>{singleClassData.trainerName}</p>
        {loggedInUser && singleClassData ? (
          loggedInUser.isTrainer ? (
            // If the user is a trainer, only show the button if the class belongs to them
            singleClassData.trainerName ===
            loggedInUser.firstName + " " + loggedInUser.lastName ? (
              <button>Cancel Booking</button> // Show Cancel Booking if it is their class
            ) : // If the trainer is logged in but it's not their class, show nothing
            null
          ) : // If the user is not a trainer, handle the booking or cancel logic for members
          Array.isArray(singleClassData.membersAttending) &&
            singleClassData.membersAttending.includes(loggedInUser.email) ? (
            <button>Cancel Booking</button> 
          ) : (
            <button>Book</button> 
          )
        ) : (
          <p>Loading...</p> 
        )}

   
      </div>
    </section>
  );
};

export default BookClass;
