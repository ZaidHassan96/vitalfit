import React, { useEffect, useState } from "react";
import { handleFilterOptions, pagination, sortedClasses } from "../utils/utils";
import { useUser } from "../context/User";
import SingleEventCard from "./SingleEventCard";
import PaginationButtons from "./PaginationButtons";
import { fetchMyClasses } from "../utils/fetchingClasses";

const MyClassesList = ({
  filterOptions,
  setShowBookingCard,
  showBookingCard,
  setCurrentPage,
  currentPage,
  setSingleClassData,
}) => {
  const [myClasses, setMyClasses] = useState([]);
  const { loggedInUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [classesPerPage, setClassesPerPage] = useState(12); // Default items per page

  //

  const filteredClasses = handleFilterOptions(myClasses, filterOptions);

  useEffect(() => {
    fetchMyClasses(setMyClasses, setLoading, loggedInUser);
  }, [loggedInUser]);

  useEffect(() => {
    // Detect screen width and set items per page
    const updateItemsPerPage = () => {
      setClassesPerPage(window.innerWidth <= 900 ? 4 : 12);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

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
      </div>
    </>
  );
};

export default MyClassesList;
