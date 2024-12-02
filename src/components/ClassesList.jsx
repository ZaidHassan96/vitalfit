import React, { useEffect, useState } from "react";
import SingleEventCard from "./SingleEventCard";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import {
  handleFilterOptions,
  pagination,
  sortedClasses,
} from "../utils/utils.js";
import PaginationButtons from "./PaginationButtons.jsx";

const ClassesList = ({
  filterOptions,
  setShowBookingCard,
  showBookingCard,
  setCurrentPage,
  currentPage,
  setSingleClassData,
}) => {
  const [classes, setClasses] = useState([]);
  const [classesPerPage, setClassesPerPage] = useState(12); // Default items per page
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Detect screen width and set items per page
    const updateItemsPerPage = () => {
      setClassesPerPage(window.innerWidth <= 900 ? 4 : 12);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
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

  const filteredClasses = handleFilterOptions(classes, filterOptions);
  //

  return (
    <>
      <div className="availability">
        <p>Available 🟢</p>
        <p>Full 🔴</p>
      </div>
      <PaginationButtons
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        filteredClasses={filteredClasses}
        classesPerPage={classesPerPage}
      />
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
  );
};

export default ClassesList;
