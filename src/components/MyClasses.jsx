import React, { useContext, useEffect, useState } from "react";
import Header from "./Header.jsx";
import Banner from "./Banner.jsx";
import SingleEventCard from "./SingleEventCard.jsx";
import AddClass from "./AddClass.jsx";

import {
  getDocs,
  collection,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import BookClass from "./BookClass.jsx";
import Footer from "./Footer.jsx";
import {
  sortedClasses,
  formatDate,
  handleFilterOptions,
  pagination,
} from "../utils/utils.js";
import { useUser } from "../context/User.jsx";
import { CircularProgress } from "@mui/material";
import LargeFilterContainer from "./LargeFilterContainer.jsx";
import SmallFilterContainer from "./SmallFilterContainer.jsx";

const MyClasses = ({ filterOptions, setFilterOptions }) => {
  const { loggedInUser } = useUser();
  const [addClassPage, setAddClassPage] = useState(false);
  const [classes, setClasses] = useState([]);
  const [singleClassData, setSingleClassData] = useState([]);
  const [showBookingCard, setShowBookingCard] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [classesPerPage, setClassesPerPage] = useState(12); // Default items per page
  const [smallScreenFilter, setSmallScreenFilter] = useState(false);
  const [filterButton, setFilterButton] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        if (!loggedInUser) return;
        let querySnapshot;
        const trainer = `${loggedInUser.firstName} ${loggedInUser.lastName}`;

        if (loggedInUser.isTrainer) {
          const trainerQuery = query(
            collection(db, "classes"),
            where("trainerName", "==", trainer)
          );

          // Listen to real-time updates
          const unsubscribe = onSnapshot(trainerQuery, (snapshot) => {
            const classesArray = [];
            snapshot.forEach((doc) => {
              classesArray.push({ ...doc.data(), id: doc.id });
            });
            const sortedArr = sortedClasses(classesArray, "date", "startTime");
            setClasses(sortedArr); // Update state with new data
            setLoading(false);
          });

          // Cleanup listener on unmount
          return () => unsubscribe();
        } else {
          const email = loggedInUser.email;

          // Step 1: Query classes with membersAttending not empty
          const membersAttendingQuery = query(
            collection(db, "classes"),
            where("membersAttending", "!=", [])
          );

          // Listen to real-time updates
          const unsubscribe = onSnapshot(membersAttendingQuery, (snapshot) => {
            const classesArray = [];
            snapshot.forEach((doc) => {
              const classData = doc.data();
              // Step 2: Filter for the specific user email
              const isAttending = classData.membersAttending.some(
                (member) => member.email === email
              );

              // Only add classes where the user is attending
              if (isAttending) {
                classesArray.push({ ...classData, id: doc.id });
              }
            });
            const sortedArr = sortedClasses(classesArray, "date", "startTime");
            setClasses(sortedArr); // Update state with new data
            setLoading(false);
          });

          // Cleanup listener on unmount
          return () => unsubscribe();
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching documents: ", error);
      }
    };

    fetchClasses();
  }, [loggedInUser]);

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

  useEffect(() => {
    setFilterOptions({
      className: "",
      classDate: "",
      classTrainer: "",
    });
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
              {" "}
              <div className="availability">
                <p>Available 🟢</p>
                <p>Full 🔴</p>
              </div>
              <div className="pagination-controls">
                <p
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
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
                  }
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

      <Footer />
    </>
  );
};

export default MyClasses;
