import { useRef, useState } from "react";
import "../stylesheets/SingleEventCard.css";
import { Link } from "react-router-dom";

const SingleEventCard = ({
  setShowBookingCard,
  classData,
  setSingleClassData,
}) => {
  // const classesContainer = classesContainerRef;
  // console.log(classesContainer.current);
  console.log(setSingleClassData);

  const handleCardClick = (event) => {
    const bookingCard = document.getElementById("classes");
    if (bookingCard) {
      bookingCard.scrollIntoView({
        behavior: "smooth", // Smooth scrolling
        block: "start", // Align the top of the booking card to the top of the view
      });
    }
    console.log(classData);
    setSingleClassData(classData);

    setShowBookingCard(true);
  };

  return (
    <>
      {classData ? (
        <div onClick={handleCardClick} id="booking-card" className="card">
          <img src="../images/projects.jpg" alt="" />
          <div className="info">
            <h1>{classData.classType}</h1>
            <h3>
              {classData.date}, {classData.startTime}
            </h3>
            <p>{classData.excerpt}</p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SingleEventCard;
