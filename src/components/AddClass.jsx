import React, { useState } from "react";
import "../stylesheets/addClass.css";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useUser } from "../context/User";
import BeatLoader from "react-spinners/BeatLoader";

const AddClass = ({ setAddClassPage }) => {
  const { loggedInUser } = useUser();
  const [dateIncorrect, setDateIncorrect] = useState(false);
  const [formNotValid, setFormNotValid] = useState(false);
  const [addingClass, setAddingClass] = useState(false);

  const formatDate = (date) => {
    const dateObj = new Date(date);

    const todayDate = new Date();
    // Date comparisson to make sure chosen date is not passed
    const d = dateObj.setHours(0, 0, 0, 0);
    const t = todayDate.setHours(0, 0, 0, 0);

    if (d < t) {
      setDateIncorrect(true);
      alert(
        "The selected date has already passed. Please choose a future date."
      );
      return;
    }

    setDateIncorrect(false);

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

  const trainer = `${loggedInUser.firstName} ${loggedInUser.lastName}`;

  const [classData, setClassData] = useState({
    classId: "",
    classType: "",
    classSize: 0,
    date: "",
    excerpt: "",
    membersAttending: [],
    startTime: "",
    trainerName: trainer,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      const newDateVal = formatDate(value);
      setClassData((prevState) => ({ ...prevState, [name]: newDateVal }));
    } else {
      setClassData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const checkFormValidity = () => {
    const { classType, classSize, date, startTime, excerpt } = classData;
    if (
      classType &&
      classSize > 0 &&
      date &&
      startTime &&
      !dateIncorrect &&
      excerpt
    ) {
      return true;
    } else {
      return false;
    }
  };

  // useEffect(() => {
  //   checkFormValidity();
  // }, [classData]);

  const addClassData = async (classData) => {
    setAddingClass(true);
    try {
      const docRef = await addDoc(collection(db, "classes"), classData);

      await updateDoc(doc(db, "classes", docRef.id), {
        classId: docRef.id,
      });

      setAddingClass(false);
    } catch (error) {
      setAddingClass(false);
      console.error("Error adding class: ", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Prevent form submission if the form is invalid
    if (!checkFormValidity()) {
      setFormNotValid(true);

      return; // Stop further execution if form is invalid
    }

    // Proceed with adding class data and hiding the form page
    setFormNotValid(false);
    await addClassData(classData);
    setAddClassPage(false);
  };

  return (
    <div className="add-class-page">
      <h3
        onClick={() => {
          setAddClassPage(false);
        }}
      >
        View Classes
      </h3>
      <div className="add-class-form">
        <h1>Add Class</h1>
        {formNotValid && (
          <p
            style={{
              fontSize: "1.2rem",
            }}
            className="error"
          >
            Please fill out all sections.
          </p>
        )}
        <form action="" onSubmit={handleSubmit}>
          <div className="classType">
            <label htmlFor="classType"></label>
            <select name="classType" id="classType" onChange={handleChange}>
              <option value="">Class Type</option>
              <option value="Hiit Mania">Hiit Mania</option>
              <option value="Spin Class">Spin Class</option>
              <option value="Yoga">Yoga</option>
            </select>
          </div>
          <div>
            <label htmlFor="classSize"></label>
            <input
              type="number"
              id="classSize"
              name="classSize"
              min="1"
              max="100"
              placeholder="Enter class size"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            {dateIncorrect && (
              <p className="error">Please choose a future date.</p>
            )}
            <label htmlFor="date"></label>
            <input
              type="date"
              id="date"
              name="date"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="startTime"></label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              required
              onChange={handleChange}
            />
          </div>
          <div className="excerpt">
            <label htmlFor="excerpt"></label>
            <input
              type="text"
              id="excerpt"
              name="excerpt"
              placeholder="Excerpt"
              onChange={handleChange}
            />
          </div>
          {addingClass ? (
            <button>
              {" "}
              <BeatLoader color="white" />
            </button>
          ) : (
            <button>Add Class</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddClass;
