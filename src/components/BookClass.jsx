import React, { useContext, useState } from "react";
import Header from "./Header";
import "../stylesheets/BookClass.css";
import UserContext from "../context/User";
import Login from "./Login.jsx";

const BookClass = ({ showBookingCard, setShowBookingCard }) => {
  console.log(setShowBookingCard);

  // function handleBooking() {
  //   if (!loggedInUser){

  //   }
  // }

  return (
    <section>
      <div className={showBookingCard ? "booking-card" : "hide-booking-card"}>
        <h2
          className="exit"
          onClick={() => {
            setShowBookingCard(false);
          }}
        >
          X
        </h2>
        <img src="../images/projects.jpg" alt="" />
        <h1>Class</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <p>Fri, Oct 4th</p>
        <p>07:00am - 45 minutes</p>
        <p>spaces remaining</p>
        <p>trainer name</p>
        <button>Book</button>
      </div>
    </section>
  );
};

export default BookClass;
