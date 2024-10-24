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

  useEffect(() => {
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
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchClasses(); // Call the fetch function
  }, []); // Empty dependency array to run only once on component mount

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
  console.log(classTrainer);

  const filteredClasses = handleFilterOptions(
    classDate,
    className,
    classTrainer,
    classes
  );

  return (
    <>
      <section>
        <Header />
        <Banner />
        {/* <h1 className="all-classes-title">All Classes</h1> */}
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
              singleClassData={singleClassData}
              setSingleClassData={setSingleClassData}
              classData={classDate}
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
            <label for="class-name">Classes:</label>
            <select id="class-name" name="class-name" onChange={handleChange}>
              <option value="">All Class</option>
              <option value="Spin Class">Spin Class</option>
              <option value="Yoga">Yoga</option>
              <option value="Hiit Mania">Hiit Mania</option>
            </select>
          </div>
          <div className="filter-box">
            <label for="trainer">Trainer:</label>
            <select id="trainer" name="trainer" onChange={handleChange}>
              <option value="">All Trainers</option>
              <option value="Zaid Hassan">Zaid</option>
              <option value="Steve">Steve</option>
              <option value="Sydney Beth">Sydney</option>
            </select>
          </div>
          <div className="filter-box">
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" name="date" onChange={handleChange} />
          </div>
        </div>
        <div className="availability">
          <p>Available 🟢</p>
          <p>Full 🔴</p>
        </div>
        <div className="pagination-controls">
          <p
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </p>
          <span>
            Page {currentPage} of {Math.ceil(filteredClasses.length / 12)}
          </span>
          <p
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(filteredClasses.length / 12))
              )
            }
            disabled={currentPage === Math.ceil(filteredClasses.length / 12)}
          >
            {">"}
          </p>
        </div>
        <div className="all-rows">
          {filteredClasses.length > 0 ? (
            pagination(filteredClasses, currentPage).map((classData) => {
              return (
                <SingleEventCard
                  key={classData.id}
                  classData={classData}
                  setShowBookingCard={setShowBookingCard}
                  setSingleClassData={setSingleClassData}
                />
              );
            })
          ) : (
            <h1 className="no-classes">No Classes</h1>
          )}
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
};

export default AllClasses;
