import React, { useEffect, useState } from "react";
import { handleFilterOptions, pagination, sortedClasses } from "../utils/utils";
import { useUser } from "../context/User";
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
import SingleEventCard from "./SingleEventCard";
import PaginationButtons from "./PaginationButtons";

const MyClassesList = ({
  filterOptions,
  setShowBookingCard,
  showBookingCard,
  setCurrentPage,
  currentPage,
  setSingleClassData,
}) => {
  const [classes, setClasses] = useState([]);
  const { loggedInUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [classesPerPage, setClassesPerPage] = useState(12); // Default items per page

  //

  const filteredClasses = handleFilterOptions(classes, filterOptions);

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
