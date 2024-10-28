import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

// UTILS FOR ALLCLASSES AND BOOKED CLASSES:
export function sortedClasses(
  arr,
  dateField = "date",
  timeField = "startTime"
) {
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
}

export function formatDate(date) {
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
}

export function handleFilterOptions(
  classDate,
  className,
  classTrainer,
  classes
) {
  // Filter based on both date and class type
  return classes.filter((classData) => {
    const isDateMatch = classDate ? classData.date === classDate : true;
    const isTypeMatch = className ? classData.classType === className : true;
    const isTrainerMatch = classTrainer
      ? classData.trainerName === classTrainer
      : true;

    return isDateMatch && isTypeMatch && isTrainerMatch;
  });
}

export function pagination(filteredClasses, currentPage, classesPerPage) {
  const startIndex = (currentPage - 1) * classesPerPage;
  const endIndex = startIndex + classesPerPage;

  return filteredClasses.slice(startIndex, endIndex);
}

//UTILS FOR LOGIN AND SMALLLOGIN:

export async function handleLogin(
  email,
  password,
  navigateInput,
  setError,
  setLoggedInUser,
  navigate
) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const uid = user.uid;

    // After signing in, fetch the user document from Firestore
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = await userDocSnap.data(); // This is where you get your custom user fields
      setLoggedInUser(userData);

      localStorage.setItem("userId", uid); // Store the user's ID
      localStorage.setItem("userData", JSON.stringify(userData));
      // console.log("User data:", userData);
    } else {
      // console.log("No such document!");
    }

    console.log("succesfully logged in");
    navigate(navigateInput);
  } catch (error) {
    setError(error);
    console.log(error.code);
  }
}
