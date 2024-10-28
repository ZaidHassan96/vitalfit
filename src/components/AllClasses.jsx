import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "./Header.jsx";
import "../stylesheets/AllClasses.css";
import SingleEventCard from "./SingleEventCard.jsx";
import Banner from "./Banner.jsx";
import BookClass from "./BookClass.jsx";
import SmallLogin from "./SmallLogin.jsx";
import UserContext from "../context/User.jsx";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import Footer from "./Footer.jsx";
import {
  sortedClasses,
  formatDate,
  handleFilterOptions,
  pagination,
} from "../utils/utils.js";

const AllClasses = ({ setLoggedInUser }) => {
  const [showBookingCard, setShowBookingCard] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const [className, setClassName] = useState("");
  const [classDate, setClassDate] = useState("");
  const [classTrainer, setClassTrainer] = useState("");
  const [classes, setClasses] = useState([]);
  const [singleClassData, setSingleClassData] = useState([]);
  // const [classAvailable, setClassAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [classesPerPage, setClassesPerPage] = useState(12); // Default items per page
  const [smallScreenFilter, setSmallScreenFilter] = useState(false);
  const [filterButton, setFilterButton] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    // Detect screen width and set items per page
    const updateItemsPerPage = () => {
      setClassesPerPage(window.innerWidth <= 900 ? 5 : 12);
      setFilterButton(window.innerWidth <= 900 ? true : false);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const handleChange = (event) => {
    if (event.target.name === "class-name") {
      setClassName(event.target.value);
    } else if (event.target.name === "date") {
      const formattedDate = formatDate(event.target.value);

      setClassDate(formattedDate);
    } else {
      setClassTrainer(event.target.value);
    }
  };

  const filteredClasses = handleFilterOptions(
    classDate,
    className,
    classTrainer,
    classes
  );

  const resetFilters = () => {
    setClassName("");
    setClassDate("");
    setClassTrainer("");
  };

  // if (loading) {
  //   return (
  //     <div className="loading">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <section>
        <Header />
        <Banner />
      </section>
      {loading ? (
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      ) : (
        <section id="classes" className="classes">
          {loggedInUser ? (
            <BookClass
              showBookingCard={showBookingCard}
              setShowBookingCard={setShowBookingCard}
              singleClassData={singleClassData}
              setSingleClassData={setSingleClassData}
              classData={classDate}
            />
          ) : (
            <SmallLogin
              showBookingCard={showBookingCard}
              setShowBookingCard={setShowBookingCard}
              setLoggedInUser={setLoggedInUser}
            />
          )}

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
            <div className="filter-container">
              {/* Filter Options */}
              <div className="filter-box">
                <label htmlFor="class-name">Classes:</label>
                <select
                  id="class-name"
                  name="class-name"
                  onChange={handleChange}
                >
                  <option value="">All Classes</option>
                  <option value="Spin Class">Spin Class</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Hiit Mania">Hiit Mania</option>
                </select>
              </div>
              <div className="filter-box">
                <label htmlFor="trainer">Trainer:</label>
                <select id="trainer" name="trainer" onChange={handleChange}>
                  <option value="">All Trainers</option>
                  <option value="Zaid Hassan">Zaid</option>
                  <option value="Steve">Steve</option>
                  <option value="Sydney Beth">Sydney</option>
                </select>
              </div>
              <div className="filter-box">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          {smallScreenFilter ? (
            <>
              <div className="filter-container-small">
                {/* Filter Options */}
                <div className="filter-box">
                  <label htmlFor="class-name">Classes:</label>
                  <select
                    id="class-name"
                    name="class-name"
                    onChange={handleChange}
                  >
                    <option value="">All Classes</option>
                    <option value="Spin Class">Spin Class</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Hiit Mania">Hiit Mania</option>
                  </select>
                </div>
                <div className="filter-box">
                  <label htmlFor="trainer">Trainer:</label>
                  <select id="trainer" name="trainer" onChange={handleChange}>
                    <option value="">All Trainers</option>
                    <option value="Zaid Hassan">Zaid</option>
                    <option value="Steve">Steve</option>
                    <option value="Sydney Beth">Sydney</option>
                  </select>
                </div>
                <div className="filter-box">
                  <label htmlFor="date">Date:</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button
                onClick={() => setSmallScreenFilter(false)}
                className="close-button"
              >
                Close
              </button>
            </>
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
