import React, { useContext, useEffect, useState } from "react";
import Header from "./Header.jsx";
import Banner from "./Banner.jsx";
import AddClass from "./AddClass.jsx";
import { db } from "../../firebaseConfig";
import BookClass from "./BookClass.jsx";
import Footer from "./Footer.jsx";
import { useUser } from "../context/User.jsx";
import { CircularProgress } from "@mui/material";
import LargeFilterContainer from "./LargeFilterContainer.jsx";
import SmallFilterContainer from "./SmallFilterContainer.jsx";
import MyClassesList from "./MyClassesList.jsx";

const MyClasses = ({ filterOptions, setFilterOptions }) => {
  const { loggedInUser } = useUser();
  const [addClassPage, setAddClassPage] = useState(false);
  const [singleClassData, setSingleClassData] = useState([]);
  const [showBookingCard, setShowBookingCard] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [smallScreenFilter, setSmallScreenFilter] = useState(false);
  const [filterButton, setFilterButton] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setFilterOptions({
      className: "",
      classDate: "",
      classTrainer: "",
    });
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
      ) : addClassPage ? (
        <AddClass setAddClassPage={setAddClassPage} />
      ) : (
        <section className="classes" id="classes">
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
          <div>
            <BookClass
              showBookingCard={showBookingCard}
              setShowBookingCard={setShowBookingCard}
              singleClassData={singleClassData}
              setSingleClassData={setSingleClassData}
            />
          </div>

          {filterButton ? (
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
          {smallScreenFilter ? (
            <SmallFilterContainer
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              setSmallScreenFilter={setSmallScreenFilter}
              setCurrentPage={setCurrentPage}
            />
          ) : (
            <>
              <MyClassesList
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                filterOptions={filterOptions}
                showBookingCard={showBookingCard}
                setShowBookingCard={setShowBookingCard}
                setSingleClassData={setSingleClassData}
              />
            </>
          )}
        </section>
      )}

      <Footer />
    </>
  );
};

export default MyClasses;
