import React, { useContext, useState } from "react";
import Header from "./Header.jsx";
import Banner from "./Banner.jsx";
import SingleEventCard from "./SingleEventCard.jsx";
import UserContext from "../context/User.jsx";
import AddClass from "./addClass.jsx";

const MyClasses = () => {
  const { loggedInUser } = useContext(UserContext);
  const [addClassPage, setAddClassPage] = useState(false);

  console.log(addClassPage);

  return (
    <>
      <section>
        <Header />
        <Banner />
        {/* <h1 className="all-classes-title">Booked Classes</h1> */}
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

      {addClassPage ? (
        <AddClass setAddClassPage={setAddClassPage} />
      ) : (
        <section className="classes">
          {loggedInUser && (
            <div>
              {loggedInUser.isTrainer ? (
                <div>
                  <h3
                    className="add-class-button"
                    onClick={() => {
                      setAddClassPage(true);
                    }}
                  >
                    Add Class +
                  </h3>
                </div>
              ) : null}
            </div>
          )}

          <div className="filter-container">
            <div className="filter-box">
              <label for="category">Classes:</label>
              <select id="category" name="category">
                <option value="">All Classes</option>
                <option value="fitness">Fitness</option>
                <option value="yoga">Yoga</option>
                <option value="hiit">HIIT</option>
              </select>
            </div>
            {loggedInUser && (
              <div>
                {!loggedInUser.isTrainer ? (
                  <div className="filter-box">
                    <label for="location">Trainer:</label>
                    <select id="location" name="location">
                      <option value="">All Trainers</option>
                      <option value="new-york">Joel</option>
                      <option value="london">Steve</option>
                      <option value="sydney">Sydney</option>
                    </select>
                  </div>
                ) : null}
              </div>
            )}
            <div className="filter-box">
              <label htmlFor="date">Date:</label>
              <input type="date" id="date" name="date" />
            </div>
          </div>
          <div className="all-rows">
            <div className="card-row">
              <SingleEventCard />
              <SingleEventCard />
              <SingleEventCard />
            </div>
            <div className="card-row">
              <SingleEventCard />
              <SingleEventCard />
              <SingleEventCard />
            </div>
            <div className="card-row">
              <SingleEventCard />
              <SingleEventCard />
              <SingleEventCard />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default MyClasses;
