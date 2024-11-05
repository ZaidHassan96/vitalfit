import React, { useState } from "react";
import {
  createEvent,
  getAccessToken,
  handleGoogleLogin,
} from "../utils/googleApiLogic";
import { setImage } from "../utils/utils";
import "../stylesheets/BookingSuccess.css";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const BookingSuccess = ({ singleClassData }) => {
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [googleError, setGoogleError] = useState(false);

  const addToGoogleCalendar = async () => {
    try {
      const currentUser = await handleGoogleLogin();
      const accessToken = await getAccessToken(currentUser);
      await createEvent(singleClassData, accessToken);
      setGoogleError(false);
      setAddToCalendar(true);
    } catch (error) {
      setGoogleError(true);
      console.error(error);
    }
  };

  return (
    <div className="booking-success">
      <img src={setImage(singleClassData)} alt={singleClassData.classType} />
      <TaskAltIcon
        style={{
          color: "rgb(255, 77, 0)",
          fontSize: "5rem",
          marginTop: "2rem",
        }}
      />
      <h1>Booking confirmed</h1>

      <p className="booking-card-h1-p">
        Please Arrive on time as classes do start promptly, if you miss the
        warmup you may not be allowed to partake in the class.
      </p>
      <p className="booking-card-h1-p">{singleClassData.date}</p>
      <p className="booking-card-h1-p">Time: {singleClassData.startTime}</p>
      {googleError && (
        <div className="google-error-container">
          <h3 style={{ fontWeight: "bold", color: "red" }}>
            Class not added to Calendar
          </h3>
          <p style={{ fontWeight: "bold", color: "red" }}>
            Google account login and permission required.
          </p>
        </div>
      )}
      {addToCalendar ? (
        <p className="success-message">Succesfully added to Calendar</p>
      ) : (
        <p className="add-to-google-calendar" onClick={addToGoogleCalendar}>
          Add to Google Calendar
        </p>
      )}
    </div>
  );
};

export default BookingSuccess;
