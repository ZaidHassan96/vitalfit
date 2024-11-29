import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "./Header.jsx";
import "../stylesheets/AllClasses.css";
import SingleEventCard from "./SingleEventCard.jsx";
import Banner from "./Banner.jsx";
import BookClass from "./BookClass.jsx";
import SmallLogin from "./SmallLogin.jsx";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import Footer from "./Footer.jsx";
import {
  sortedClasses,
  formatDate,
  handleFilterOptions,
  pagination,
} from "../utils/utils.js";
import { useUser } from "../context/User.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation } from "react-router-dom";
import LargeFilterContainer from "./LargeFilterContainer.jsx";
import SmallFilterContainer from "./SmallFilterContainer.jsx";

const AllClasses = ({ filterOptions, setFilterOptions }) => {
  const location = useLocation();
  const [showBookingCard, setShowBookingCard] = useState(false);
  const { loggedInUser } = useUser();
  const classTypeState = location.state?.classType; // Access the passed state
  const [classes, setClasses] = useState([]);
  const [singleClassData, setSingleClassData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [classesPerPage, setClassesPerPage] = useState(12); // Default items per page
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

  // fetch all classes, then sort the classes in accordance to date and time of posting
  useEffect(() => {
    setLoading(true);
    const fetchClasses = () => {
      try {
        const classesCollection = collection(db, "classes");

        // Set up a real-time listener for changes in the classes collection
        const unsubscribe = onSnapshot(classesCollection, (snapshot) => {
          const classesArray = [];

          snapshot.forEach((doc) => {
            classesArray.push({ ...doc.data(), id: doc.id });
          });

          const sortedArr = sortedClasses(classesArray, "date", "startTime");
          setClasses(sortedArr); // Update state with new data
          setLoading(false);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        setLoading(false);
        console.error("Error fetching documents: ", error);
      }
    };

    fetchClasses(); // Call the fetch function
  }, []); // Empty dependency array to run only once on component mount

  // updating amount of classes per page in accordance to screen size
  useEffect(() => {
    // Detect screen width and set items per page
    const updateItemsPerPage = () => {
      setClassesPerPage(window.innerWidth <= 900 ? 4 : 12);
      setFilterButton(window.innerWidth <= 900 ? true : false);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const filteredClasses = handleFilterOptions(classes, filterOptions);

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
            <>
              <div className="availability">
                <p>Available 🟢</p>
                <p>Full 🔴</p>
              </div>
              <div className="pagination-controls">
                <p
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1} // back button disabled if on first page
                >
                  {"<"}
                </p>
                <span>
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredClasses.length / classesPerPage)}
                </span>
                <p
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredClasses.length / classesPerPage)
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredClasses.length / classesPerPage)
                  } // button disabled if on last page
                >
                  {">"}
                </p>
              </div>
              <div className="all-rows">
                {filteredClasses.length > 0 ? (
                  pagination(filteredClasses, currentPage, classesPerPage).map(
                    (classData) => (
                      <SingleEventCard
                        key={classData.id}
                        classData={classData}
                        setShowBookingCard={setShowBookingCard}
                        showBookingCard={showBookingCard}
                        setSingleClassData={setSingleClassData}
                      />
                    )
                  )
                ) : (
                  <h1 className="no-classes">No Classes</h1>
                )}
              </div>{" "}
            </>
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
