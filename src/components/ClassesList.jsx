import React, { useEffect, useState } from "react";
import SingleEventCard from "./SingleEventCard";
import { handleFilterOptions, pagination } from "../utils/utils.js";
import PaginationButtons from "./PaginationButtons.jsx";
import { fetchClasses } from "../utils/fetchingClasses.js";
import "../stylesheets/ClassesList.css";

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
    fetchClasses(setClasses, setLoading); // Call the fetch function
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
