import React, { useContext, useEffect, useState } from "react";
import "../stylesheets/BookClass.css";
import UserContext from "../context/User";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig.js";
import { Navigate, useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";

const BookClass = ({
  showBookingCard,
  setShowBookingCard,
  singleClassData,
  setSingleClassData,
  classData,
}) => {
  const { loggedInUser } = useContext(UserContext);
  const [bookedMember, setBookedMember] = useState(false);
  const [bookingCancelled, setBookingCancelled] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [googleError, setGoogleError] = useState(false);

  // HANDLE GOOGLE LOGIN
  const handleGoogleLogin = async () => {
  
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
 
      setIsAuthenticated(true);
    } else {
      try {
        const user = await authInstance.signIn();
        setIsAuthenticated(true);
     
      } catch (error) {
        setGoogleError(true);
        console.error("Error signing in", error);
        // if (error.error === "popup_closed_by_user") {
        //   alert(
        //     "You need to login to a google account to add a booking to your calendar."
        //   );
        // }
      }
    }
  };
  // FORMATTING DATE AND TIME FOR UI
  function dateTimeFormat(singleClassData) {
    if (!singleClassData) {
      return;
    } else {
      const classDate = singleClassData.date; // e.g., "Sun, Oct 27"
      const classTime = singleClassData.startTime; // e.g., "17:50"

      const today = new Date();
      const year = today.getFullYear(); // Use the current year

      // Format the date as "Month Day" (e.g., "Oct 27") and combine it with the current year
      const dateParts = classDate ? classDate.split(",")[1].trim() : true; // Get "Oct 27"
      const fullDateString = `${dateParts} ${year}`; // Combine with the year (e.g., "Oct 27 2024")

      // Create a new date string by combining the full date and time
      const startTimeString = `${fullDateString} ${classTime}`; // e.g., "Oct 27 2024 17:50"

      // Create a valid Date object
      const startTime = new Date(startTimeString);
      if (isNaN(startTime.getTime())) {
        console.error("Invalid date format for startTime:", startTimeString);
        alert("The class date or time is invalid.");
        return;
      }
      return startTime;
    }
  }
  // GETTING ACCESSTOKEN FROM GOOGLE ACCOUNT IN-ORDER TO ADD CLASS TO CALENDAR
  async function getAccessToken() {
    const authInstance = gapi.auth2.getAuthInstance();
    const currentUser = authInstance.currentUser.get();

    // Get the current access token
    let accessToken = currentUser.getAuthResponse().access_token;

    // Check if the user has the necessary permissions by inspecting the granted scopes
    const scopes = currentUser.getGrantedScopes();

    // If the current scope does not include 'https://www.googleapis.com/auth/calendar.events'
    if (
      !scopes ||
      !scopes.includes("https://www.googleapis.com/auth/calendar.events")
    ) {
      console.warn(
        "User did not grant calendar permissions, prompting for consent."
      );

      try {
        // Re-prompt the user to grant permission for calendar events
        // await authInstance.signIn({
        //   scope: "https://www.googleapis.com/auth/calendar.events",
        //   prompt: "consent", // Ensure the consent screen is shown again to ask for permission
        // });

        // // Get a new access token after user grants permission
        // accessToken = currentUser.getAuthResponse().access_token;

        if (!accessToken) {
          console.error(
            "Failed to retrieve access token after re-authentication."
          );
          setGoogleError(true);
          return null;
        }
      } catch (error) {
        console.error(
          "User canceled or failed to re-authenticate for additional permissions.",
          error
        );
        setGoogleError(true);
        return null;
      }
    }

    // console.log(
    //   "Successfully retrieved access token with the required permissions."
    // );
    return accessToken;
  }
  // CREATING CLASS EVENT ON GOOGLE CALENDAR
  const createEvent = async () => {
    // Get the access token using the getAccessToken function
    const authInstance = gapi.auth2.getAuthInstance();
    const currentUser = authInstance.currentUser.get();
    const accessToken = await getAccessToken();
    const scopes = currentUser.getGrantedScopes();

    const auth2 = gapi.auth2.getAuthInstance();

    if (
      !accessToken ||
      !scopes ||
      !scopes.includes("https://www.googleapis.com/auth/calendar.events")
    ) {
      console.error(
        "User is not authenticated or failed to retrieve access token."
      );
      if (auth2) {
        await auth.signOut();
        await auth2.disconnect();
        // console.log("Google API session cleared");
      }

      return; // Exit if there's no valid access token
    }

    // console.log(
    //   "Successfully retrieved auth response, proceeding to create event."
    // );

    const startTime = dateTimeFormat(singleClassData); // Format the start time based on class data

    // Event details
    const eventDetails = {
      summary: `${singleClassData.classType} Class`,
      description: `You have successfully booked a ${singleClassData.classType} class.`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: new Date(startTime.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
        timeZone: "America/Los_Angeles",
      },
    };

    // Set token for the API request
    gapi.client.setToken({ access_token: accessToken });

    try {
      // console.log(accessToken);

      // Make the request to create the event
      const response = await gapi.client.request({
        path: `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
        method: "POST",
        body: eventDetails,
      });
      // console.log("Event created:", response.result);

      // Perform success actions
      setAddToCalendar(true);
      setGoogleError(false);
      alert("Class booked and added to your Google Calendar!");
    } catch (error) {
      // Handle errors (e.g., insufficient permissions, invalid token)
      setGoogleError(true);
      console.error("Error creating event in Google Calendar:", error);
    }
  };

  // OPTIMISTIC UI UPDATES
  const updateMembers = () => {
    setSingleClassData((prevObj) => ({
      ...prevObj,
      membersAttending: prevObj.membersAttending.filter(
        (member) => member.email !== loggedInUser.email
      ),
    }));
  };
  // HANDLING UPDATING MEMBERS ATTENDING ARRAY
  const handleUpdateDoc = async () => {
    try {
      const classRef = doc(db, "classes", singleClassData.classId);

      await updateDoc(classRef, {
        membersAttending: arrayUnion({
          email: loggedInUser.email,
          addedToCalendar: false,
        }),
      });

      // console.log("Document updated successfully!");
      setBookingConfirmed(true);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const addToGoogleCalendar = async () => {
    try {
      await handleGoogleLogin();
      await createEvent();
    } catch (error) {
      // console.log(error);
    }
  };

  const cancelBooking = async () => {
    try {
      const classRef = doc(db, "classes", singleClassData.classId);
      // Reference to the class document
      if (loggedInUser && loggedInUser.isTrainer) {
        await deleteDoc(classRef);

        setBookingCancelled(true);
      } else {
        const memberToRemove = singleClassData.membersAttending.find(
          (member) => member.email === loggedInUser.email
        );

        // Update the document by removing the user's email from the 'membersAttending' array
        await updateDoc(classRef, {
          membersAttending: arrayRemove(memberToRemove),
        });

        // console.log("Booking successfully canceled!");

        setBookingCancelled(true);
      }
    } catch (error) {
      console.error("Error canceling booking: ", error);
    }
  };
  // SETTING IMAGE ACCORDING TO CLASS TYPE
  function setImage(singleClassData) {
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

  let cancelled = "";

  if (loggedInUser && loggedInUser.isTrainer) {
    cancelled = "Class Successfully Cancelled";
  } else {
    cancelled = "Booking Successfully Cancelled";
  }

  return (
    <section>
      <div className={showBookingCard ? "booking-card" : "hide-booking-card"}>
        <div>
          <h2
            className="exit"
            onClick={() => {
              setBookingConfirmed(false);
              setBookingCancelled(false);
              setShowBookingCard(false);
              setGoogleError(false);
              setAddToCalendar(false);
            }}
          >
            X
          </h2>
        </div>
        {bookingCancelled || bookingConfirmed ? (
          bookingCancelled ? (
            <h1 className="booking-cancelled">{cancelled}</h1>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <h1 className="booking-confirmed">Booking Confirmed</h1>
              {addToCalendar ? (
                <p>Succesfully added to Calendar</p>
              ) : (
                <p
                  className="add-to-google-calendar"
                  onClick={addToGoogleCalendar}
                >
                  Add to Google Calendar
                </p>
              )}
              {googleError ? (
                <div className="google-error-container">
                  <h3 style={{ fontStyle: "bold", color: "red" }}>
                    Class not added to Calendar
                  </h3>
                  <p style={{ fontStyle: "bold", color: "red" }}>
                    Google account login and permission required.
                  </p>
                </div>
              ) : (
                true
              )}
            </div>
          )
        ) : (
          <div>
            <img
              src={setImage(singleClassData)}
              alt={singleClassData.classType}
            />
            <h1>{singleClassData.classType}</h1>
            <p>{singleClassData.excerpt}</p>
            <p>{singleClassData.date}</p>
            <p>Time: {singleClassData.startTime}</p>
            <p>
              Spaces remaining:&nbsp;&nbsp;
              {singleClassData?.classSize &&
              Array.isArray(singleClassData.membersAttending)
                ? singleClassData.classSize -
                  singleClassData.membersAttending.length
                : "N/A"}
            </p>
            <p>{singleClassData.trainerName}</p>
            <div className="booking-class-info">
              {loggedInUser && singleClassData ? (
                loggedInUser.isTrainer ? (
                  // If the user is a trainer, only show the button if the class belongs to them
                  singleClassData.trainerName ===
                  loggedInUser.firstName + " " + loggedInUser.lastName ? (
                    <button onClick={cancelBooking}>Cancel Class</button> // Show Cancel Booking if it is their class
                  ) : // If the trainer is logged in but it's not their class, show nothing
                  null
                ) : // If the user is not a trainer, handle the booking or cancel logic for members
                Array.isArray(singleClassData.membersAttending) &&
                  singleClassData.membersAttending.find(
                    (member) => member.email === loggedInUser.email
                  ) ? (
                  <button onClick={cancelBooking}>Cancel Booking</button>
                ) : (
                  <button
                    onClick={() => {
                      handleUpdateDoc();
                      updateMembers();
                    }}
                  >
                    Confirm Booking
                  </button>
                )
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookClass;
