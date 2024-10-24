import { useContext, useRef, useState } from "react";
import "../stylesheets/SingleEventCard.css";
import { Link } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { arrayRemove } from "firebase/firestore";
import UserContext from "../context/User";

const SingleEventCard = ({
  setShowBookingCard,
  classData,
  setSingleClassData,
}) => {
  const { loggedInUser } = useContext(UserContext);

  const handleCardClick = (event) => {
    const bookingCard = document.getElementById("classes");
    if (bookingCard) {
      bookingCard.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setSingleClassData(classData);

    setShowBookingCard(true);
  };

  const checkAvailability = (classData) => {
    if (classData.membersAttending.length < classData.classSize) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {classData ? (
        <div id="booking-card" className="card">
          {checkAvailability(classData) ? (
            <h1>
              <span className="availability-emoji">🟢</span>{" "}
              {classData.classType}
            </h1>
          ) : (
            <h1>
              <span className="availability-emoji">🔴</span>{" "}
              {classData.classType}
            </h1>
          )}
          <h3>
            {classData.date}, {classData.startTime}
          </h3>
          <p style={{ fontSize: "1.1rem" }}>{classData.trainerName}</p>
          <p>{classData.excerpt}</p>
          {(Array.isArray(classData.membersAttending) &&
            loggedInUser &&
            classData.membersAttending.find(
              (member) => member.email === loggedInUser.email
            )) ||
          (loggedInUser && loggedInUser.isTrainer) ? (
            <p className="book" onClick={handleCardClick}>
              View
            </p>
          ) : checkAvailability(classData) ? (
            <p className="book" onClick={handleCardClick}>
              Book
            </p>
          ) : (
            <p className="book">Class Full</p>
          )}
        </div>
      ) : // </div>
      null}
    </>
  );
};

export default SingleEventCard;
