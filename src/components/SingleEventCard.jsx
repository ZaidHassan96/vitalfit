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
  // const classesContainer = classesContainerRef;
  // console.log(classesContainer.current);
  const { loggedInUser } = useContext(UserContext);
  const handleCardClick = (event) => {
    const bookingCard = document.getElementById("classes");
    if (bookingCard) {
      bookingCard.scrollIntoView({
        behavior: "smooth", // Smooth scrolling
        block: "start", // Align the top of the booking card to the top of the view
      });
    }

    setSingleClassData(classData);

    setShowBookingCard(true);
  };

  function setImage(classData) {
    let imageFile = "";
    if (classData.classType === "Hiit Mania") {
      imageFile = "../images/yoga.jpg";
    } else if (classData.classType === "Spin Class") {
      imageFile = "../images/spin.jpg";
    } else {
      imageFile = "../images/hiit.jpg";
    }
    return imageFile;
  }

  return (
    <>
      {classData ? (
        <div id="booking-card" className="card">
          {/* <img src={setImage(classData)} alt="" /> */}
          {/* <div className="info"> */}
          <h1>{classData.classType}</h1>
          <h3>
            {classData.date}, {classData.startTime}
          </h3>
          <p style={{ fontSize: "1.1rem" }}>{classData.trainerName}</p>
          <p>{classData.excerpt}</p>
          {Array.isArray(classData.membersAttending) &&
          loggedInUser &&
          classData.membersAttending.includes(loggedInUser.email) ? (
            <p className="book" onClick={handleCardClick}>
              View
            </p>
          ) : (
            <p className="book" onClick={handleCardClick}>
              Book
            </p>
          )}
        </div>
      ) : // </div>
      null}
    </>
  );
};

export default SingleEventCard;
