import React, { useContext, useState } from "react";
import "../stylesheets/addClass.css";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import UserContext from "../context/User";
import { db } from "../../firebaseConfig";

const AddClass = ({ setAddClassPage }) => {
  const { loggedInUser } = useContext(UserContext);
  const [dateIncorrect, setDateIncorrect] = useState(false);
  console.log(dateIncorrect);

  const formatDate = (date) => {
    const dateObj = new Date(date);

    const todayDate = new Date();
    // Date comparisson to make sure chosen date is not passed
    const d = dateObj.setHours(0, 0, 0, 0);
    const t = todayDate.setHours(0, 0, 0, 0);

    if (d < t) {
      setDateIncorrect(true);
      alert("Selected Date has past");
      return;
    }

    setDateIncorrect(false);

    console.log(todayDate, dateObj);

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

  console.log(loggedInUser);
  const trainer = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
  console.log(trainer);
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

  console.log(classData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      const newDateVal = formatDate(value);
      setClassData((prevState) => ({ ...prevState, [name]: newDateVal }));
    } else {
      setClassData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const addClassData = async (classData) => {
    try {
      const docRef = await addDoc(collection(db, "classes"), classData);

      await updateDoc(doc(db, "classes", docRef.id), {
        classId: docRef.id,
      });
      console.log("class added succesfuly");
    } catch (error) {
      console.error("Error adding class: ", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addClassData(classData);
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
          <button disabled={dateIncorrect}>Add Class</button>
        </form>
      </div>
    </div>
  );
};

export default AddClass;
