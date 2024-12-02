import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "./Header.jsx";
import "../stylesheets/AllClasses.css";
import Banner from "./Banner.jsx";
import BookClass from "./BookClass.jsx";
import SmallLogin from "./SmallLogin.jsx";
import Footer from "./Footer.jsx";
import { useUser } from "../context/User.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation } from "react-router-dom";
import LargeFilterContainer from "./LargeFilterContainer.jsx";
import SmallFilterContainer from "./SmallFilterContainer.jsx";
import ClassesList from "./ClassesList.jsx";

const AllClasses = ({ filterOptions, setFilterOptions }) => {
  const location = useLocation();
  const [showBookingCard, setShowBookingCard] = useState(false);
  const { loggedInUser } = useUser();
  const classTypeState = location.state?.classType; // Access the passed state
  const [singleClassData, setSingleClassData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [smallScreenFilter, setSmallScreenFilter] = useState(false);
  const [filterButton, setFilterButton] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilterOptions({
      className: classTypeState ? classTypeState : "",
      classDate: "",
      classTrainer: "",
    });
  }, []);

  // updating amount of classes per page in accordance to screen size
  useEffect(() => {
    // Detect screen width and set filter button for smaller screens
    const addFilterButton = () => {
      setFilterButton(window.innerWidth <= 900 ? true : false);
    };
    addFilterButton();
    window.addEventListener("resize", addFilterButton);

    return () => window.removeEventListener("resize", addFilterButton);
  }, []);

  const resetFilters = () => {
    setFilterOptions({
      className: "",
      classDate: "",
      classTrainer: "",
    });
  };

  return (
    <>
      <section>
        <Header />
        <Banner />
      </section>
      {loading ? (
        <div className="loading-container">
          <CircularProgress
            style={{
              color: "rgb(255, 77, 0)",
              fontSize: "5rem",
              marginTop: "2rem",
            }}
          />
        </div>
      ) : (
        <section id="classes" className="classes">
          {loggedInUser ? (
            // Only renders on screen if showBookingCard is set to true, where by the css classname is changed from "hide-booking-card" to  "booking-card"
            <BookClass
              showBookingCard={showBookingCard}
              setShowBookingCard={setShowBookingCard}
              singleClassData={singleClassData}
              setSingleClassData={setSingleClassData}
            />
          ) : (
            // Only renders on screen if showBookingCard is set to true, where by the css classname is changed from "hide-small-login" to  "small-login-page"
            <SmallLogin
              showBookingCard={showBookingCard}
              setShowBookingCard={setShowBookingCard}
            />
          )}

          {filterButton ? ( // renders small filter button to open small filter screen on smaller devices.
            <button
              className="filter-small"
              onClick={() => {
                setSmallScreenFilter(true);
                resetFilters();
              }}
            >
              Filters
            </button>
          ) : (
            <LargeFilterContainer
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
            />
          )}
          {smallScreenFilter ? ( // if smallScreenFilter is set to true we will render the filter if not we will render the all the classes
            <SmallFilterContainer
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              setSmallScreenFilter={setSmallScreenFilter}
              setCurrentPage={setCurrentPage}
            />
          ) : (
            <ClassesList
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              filterOptions={filterOptions}
              showBookingCard={showBookingCard}
              setShowBookingCard={setShowBookingCard}
              setSingleClassData={setSingleClassData}
            />
          )}
        </section>
      )}

      <section>
        <Footer />
      </section>
    </>
  );
};

export default AllClasses;
