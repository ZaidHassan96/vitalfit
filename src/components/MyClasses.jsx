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
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

const MyClasses = () => {
  const { loggedInUser } = useContext(UserContext);
  const [addClassPage, setAddClassPage] = useState(false);
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [classDate, setClassDate] = useState("");
  console.log("this one", classDate);
  // useEffect(() => {
  //   const fetchClasses = async () => {
  //     try {
  //       if (!loggedInUser) return; // Ensure loggedInUser is available
  //       let querySnapshot;

  //       if (loggedInUser.isTrainer) {
  //         console.log("hello");
  //         const trainer = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
  //         const trainerQuery = query(
  //           collection(db, "classes"),
  //           where("trainerName", "==", trainer)
  //         );
  //         querySnapshot = await getDocs(trainerQuery);
  //       } else {
  //         console.log("else");

  //         const email = loggedInUser.email;
  //         const membersAttending = query(
  //           collection(db, "classes"),
  //           where("membersAttending", "array-contains", email)
  //         );

  //         // Execute the query
  //         querySnapshot = await getDocs(membersAttending);
  //       }

  //       // Fetch all documents in the collection

  //       // Loop through the documents and log their data
  //       const classes = [];
  //       querySnapshot.forEach((doc) => {
  //         // doc.data() is the actual data of the document
  //         classes.push({ ...doc.data(), id: doc.id });
  //         console.log(`${doc.id} => `, doc.data());
  //       });

  //       setClasses(classes); // Optionally return the array of class objects
  //     } catch (error) {
  //       console.error("Error fetching documents: ", error);
  //     }
  //   };
  //   fetchClasses();
  // }, [loggedInUser]);

  const sortedClasses = (arr, dateField = "date", timeField = "startTime") => {
    if (arr && arr.length > 0) {
      return arr.sort((a, b) => {
        if (new Date(a[dateField]) - new Date(b[dateField]) !== 0) {
          return new Date(a[dateField]) - new Date(b[dateField]);
        } else {
          return parseInt(a[timeField]) - parseInt(b[timeField]);
        }
      });
    }
    return arr;
  };

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
          onSnapshot(trainerQuery, (snapshot) => {
            const classesArray = [];
            snapshot.forEach((doc) => {
              classesArray.push({ ...doc.data(), id: doc.id });
            });
            const sortedArr = sortedClasses(classesArray, "date", "startTime");
            setClasses(sortedArr); // Update state with new data
          });
        } else {
          const email = loggedInUser.email;
          const membersAttendingQuery = query(
            collection(db, "classes"),
            where("membersAttending", "array-contains", email)
          );

          // Listen to real-time updates
          onSnapshot(membersAttendingQuery, (snapshot) => {
            const classesArray = [];
            snapshot.forEach((doc) => {
              classesArray.push({ ...doc.data(), id: doc.id });
            });
            const sortedArr = sortedClasses(classesArray, "date", "startTime");
            setClasses(sortedArr); // Update state with new data
          });
        }
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchClasses();
  }, [loggedInUser]);

  console.log(classes.sort(), "<<<");

  const formatDate = (date) => {
    if (date.length === 0) {
      return;
    }

    const dateObj = new Date(date);

    if (dateObj.length === 0) {
      return "";
    }

    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "short", // (e.g., "Sun")
      month: "short", // e.g., "Oct")
      day: "numeric", // (e.g., "10")
    });

    return formattedDate;
  };

  const handleChange = (event) => {
    if (event.target.name === "class-name") {
      setClassName(event.target.value);
    } else {
      const formattedDate = formatDate(event.target.value);

      setClassDate(formattedDate);
    }
  };

  function handleFilterOptions(classDate, className, classes) {
    if (classDate && className) {
      // Filter based on both date and class type
      return classes.filter((classData) => {
        const isDateMatch = classDate ? classData.date === classDate : true;
        const isTypeMatch = className
          ? classData.classType === className
          : true;

        return isDateMatch && isTypeMatch;
      });
    } else if (classDate) {
      // Filter based on date only
      return classes.filter((classData) => {
        return classData.date === classDate;
      });
    } else if (className) {
      // Filter based on class type only
      return classes.filter((classData) => {
        return classData.classType === className;
      });
    } else {
      // If no filter is applied, return all classes
      return classes;
    }
  }

  console.log("this one", classDate, className);

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
              <label for="class-name">Classes:</label>
              <select id="class-name" name="class-name" onChange={handleChange}>
                <option value="">All Classes</option>
                <option value="Spin Class">Spin Class</option>
                <option value="Yoga">Yoga</option>
                <option value="Hiit Mania">Hiit Mania</option>
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
              <input
                type="date"
                id="date"
                name="date"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="all-rows">
            {classes.length > 0 ? (
              handleFilterOptions(classDate, className, classes).map(
                (classData) => {
                  return (
                    <SingleEventCard key={classData.id} classData={classData} />
                  );
                }
              )
            ) : (
              <h1>No Classes</h1>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default MyClasses;
