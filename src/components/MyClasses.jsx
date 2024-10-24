import React, { useContext, useEffect, useState } from "react";
import Header from "./Header.jsx";
import Banner from "./Banner.jsx";
import SingleEventCard from "./SingleEventCard.jsx";
import UserContext from "../context/User.jsx";
import AddClass from "./addClass.jsx";
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

const MyClasses = () => {
  const { loggedInUser } = useContext(UserContext);
  const [addClassPage, setAddClassPage] = useState(false);
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [classDate, setClassDate] = useState("");
  const [singleClassData, setSingleClassData] = useState([]);
  const [showBookingCard, setShowBookingCard] = useState(false);
  const [classTrainer, setClassTrainer] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchClasses = async () => {
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
          });

          // Cleanup listener on unmount
          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchClasses();
  }, [loggedInUser]);

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

  // function handleFilterOptions(classDate, className, classTrainer, classes) {
  //   // Filter based on both date and class type
  //   return classes.filter((classData) => {
  //     const isDateMatch = classDate ? classData.date === classDate : true;
  //     const isTypeMatch = className ? classData.classType === className : true;
  //     const isTrainerMatch = classTrainer
  //       ? classData.trainerName === classTrainer
  //       : true;

  //     return isDateMatch && isTypeMatch && isTrainerMatch;
  //   });

  //   // } else if (classDate) {
  //   //   // Filter based on date only
  //   //   return classes.filter((classData) => {
  //   //     return classData.date === classDate;
  //   //   });
  //   // } else if (className) {
  //   //   // Filter based on class type only
  //   //   return classes.filter((classData) => {
  //   //     return classData.classType === className;
  //   //   });
  //   // } else {
  //   //   // If no filter is applied, return all classes
  //   //   return classes;
  //   // }
  // }

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
      </section>

      {addClassPage ? (
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
              classData={classDate}
            />
          </div>

          <div className="filter-container">
            <div className="filter-box">
              <label for="class-name">Classes:</label>
              <select id="class-name" name="class-name" onChange={handleChange}>
                <option value="">All Classes</option>
                <option value="Spin Class">Spin Class</option>
                <option value="Yoga">Yoga</option>
                <option value="Hiit Mania">Hiit Mania</option>
              </select>
            </div>
            {loggedInUser && !loggedInUser.isTrainer ? (
              <div className="filter-box">
                <label for="trainer">Trainer:</label>
                <select id="trainer" name="location" onChange={handleChange}>
                  <option value="">All Trainers</option>
                  <option value="Zaid Hassan">Zaid</option>
                  <option value="Sydney Beth">Sydney</option>
                  <option value="Steve Hart">Steve</option>
                </select>
              </div>
            ) : null}

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
            {loggedInUser && filteredClasses && filteredClasses.length > 0 ? (
              pagination(filteredClasses, currentPage).map((classData) => {
                return (
                  <SingleEventCard
                    key={classData.id}
                    classData={classData}
                    setSingleClassData={setSingleClassData}
                    setShowBookingCard={setShowBookingCard}
                  />
                );
              })
            ) : (
              <h1 className="no-classes">No Classes</h1>
            )}
          </div>
        </section>
      )}
      <Footer />
    </>
  );
};

export default MyClasses;
