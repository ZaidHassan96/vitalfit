import {
  collection,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import { sortedClasses } from "../utils/utils.js";

//

// fetch all classes, then sort the classes in accordance to date and time of posting
export function fetchClasses(setClasses, setLoading) {
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
}

export async function fetchMyClasses(setMyClasses, setLoading, loggedInUser) {
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
        setMyClasses(sortedArr); // Update state with new data
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
        setMyClasses(sortedArr); // Update state with new data
        setLoading(false);
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
    }
  } catch (error) {
    setLoading(false);
    console.error("Error fetching documents: ", error);
  }
}
