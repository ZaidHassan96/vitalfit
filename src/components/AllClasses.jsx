import React, { useContext, useRef, useState } from "react";
import Header from "./Header.jsx";
import "../stylesheets/AllClasses.css";
import SingleEventCard from "./SingleEventCard.jsx";
import Banner from "./Banner.jsx";
import BookClass from "./BookClass.jsx";
import SmallLogin from "./SmallLogin.jsx";
import UserContext from "../context/User.jsx";

const AllClasses = ({ setLoggedInUser }) => {
  const [showBookingCard, setShowBookingCard] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  const cards = [1, 2, 3];

  return (
    <>
      <section>
        <Header />
        <Banner />
        <h1 className="all-classes-title">All Classes</h1>
      </section>

      {/* <div className="classes-nav">
        <nav>
          <ul>
            <li>Spin</li>
            <li>HIIT</li>
            <li>Pilates</li>
            <li>Strength Training</li>
          </ul>
        </nav>
      </div> */}
      <section id="classes" className="classes">
        {loggedInUser ? (
          <div>
            <BookClass
              showBookingCard={showBookingCard}
              setShowBookingCard={setShowBookingCard}
            />
          </div>
        ) : (
          <div>
            <SmallLogin
              showBookingCard={showBookingCard}
              setShowBookingCard={setShowBookingCard}
              setLoggedInUser={setLoggedInUser}
            />
          </div>
        )}

        <div className="filter-container">
          <div className="filter-box">
            <label for="category">Classes:</label>
            <select id="category" name="category">
              <option value="">All Class</option>
              <option value="fitness">Fitness</option>
              <option value="yoga">Yoga</option>
              <option value="hiit">HIIT</option>
            </select>
          </div>
          <div className="filter-box">
            <label for="location">Trainer:</label>
            <select id="location" name="location">
              <option value="">All Trainers</option>
              <option value="new-york">Joel</option>
              <option value="london">Steve</option>
              <option value="sydney">Sydney</option>
            </select>
          </div>
          <div className="filter-box">
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" name="date" />
          </div>
        </div>
        <div className="all-rows">
          <div className="card-row">
            {cards.map((card) => (
              <SingleEventCard
                key={card}
                setShowBookingCard={setShowBookingCard}
              />
            ))}
          </div>
          <div className="card-row">
            {cards.map((card) => (
              <SingleEventCard
                key={card}
                setShowBookingCard={setShowBookingCard}
              />
            ))}
          </div>
          <div className="card-row">
            {cards.map((card) => (
              <SingleEventCard
                key={card}
                setShowBookingCard={setShowBookingCard}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AllClasses;
