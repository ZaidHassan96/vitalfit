import { useRef, useState } from "react";
import "../stylesheets/SingleEventCard.css";
import { Link } from "react-router-dom";

const SingleEventCard = ({ setShowBookingCard }) => {
  // const classesContainer = classesContainerRef;
  // console.log(classesContainer.current);

  const handleCardClick = (event) => {
    const bookingCard = document.getElementById("classes");
    if (bookingCard) {
      bookingCard.scrollIntoView({
        behavior: "smooth", // Smooth scrolling
        block: "start", // Align the top of the booking card to the top of the view
      });
    }

    setShowBookingCard(true);
  };

  return (
    <>
      <div onClick={handleCardClick} id="booking-card" className="card">
        <img src="../images/projects.jpg" alt="" />
        <div className="info">
          <h1>Hit Mania</h1>
          <h3>Sun, 20 Oct, 10:00</h3>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </>
  );
};

export default SingleEventCard;
