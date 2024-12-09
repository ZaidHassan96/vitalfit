import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
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

export function handleFilterOptions(classes, filterOptions) {
  // Filter based on both date and class type
  const { className, classDate, classTrainer } = filterOptions;

  return classes.filter((classData) => {
    const isDateMatch = classDate ? classData.date === classDate : true;
    const isTypeMatch =
      className === "All Classes" || !className
        ? true
        : classData.classType === className;
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

export async function handleLogin(email, password, navigateInput) {
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
      const userInfo = { userData, uid };
      return userInfo;
    }

    navigate(navigateInput);
  } catch (error) {
    throw error;
  }
}

// SETTING IMAGE ACCORDING TO CLASS TYPE
export function setImage(singleClassData) {
  let imageFile = "";
  if (singleClassData.classType === "Hiit Mania") {
    imageFile = "../images/hiit.jpg";
  } else if (singleClassData.classType === "Spin Class") {
    imageFile = "../images/spin.jpg";
  } else {
    imageFile = "../images/yoga.jpg";
  }
  return imageFile;
}

export async function handleSignUp(
  email,
  password,
  userInfo,
  setSigningUp,
  setAccountCreationErr
) {
  setSigningUp(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const uid = user.uid;

    await setDoc(doc(db, "users", uid), {
      email: userInfo.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      isTrainer: userInfo.isTrainer,
      fitnessLevel: userInfo.fitnessLevel,
      // bookedClasses: userInfo.bookedClasses,
      createdAt: serverTimestamp(),
      userId: uid,
    });
    setAccountCreationErr(null);
    setSigningUp(false);
    return true;
  } catch (error) {
    setSigningUp(false);
    setAccountCreationErr(error);

    return false;
  }
}
