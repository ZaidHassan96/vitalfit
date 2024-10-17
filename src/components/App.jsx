import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "../stylesheets/App.css";
import UserContext from "../context/User.jsx";
import Home from "./Home.jsx";
import AllClasses from "./AllClasses.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import MyClasses from "./MyClasses.jsx";
import BookClass from "./BookClass.jsx";
import { gapi } from "gapi-script";

function App() {
  const user = {
    name: "Zaid",
    email: "Zaid@hotmail.com",
    password: "Hello123",
  };
  const [loggedInUser, setLoggedInUser] = useState(null);
  const calendarID = import.meta.env.VITE_CALENDAR_ID;
  const apiKey = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  const accessToken = import.meta.env.VITE_APP_GOOGLE_ACCESS_TOKEN;
  console.log(loggedInUser);

  const getEvents = async (calendarID, apiKey) => {
    try {
      // Load the Google API client
      await new Promise((resolve) => gapi.load("client", resolve));

      // Initialize the client with the provided API key
      await gapi.client.init({
        apiKey: apiKey,
      });

      // Make the request to get the events
      const response = await gapi.client.request({
        path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
      });

      // Extract events from the response
      const events = response.result.items;
      return events;
    } catch (err) {
      // Handle any errors
      return [false, err];
    }
  };

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/classes"
          element={<AllClasses setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="/login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/my-classes" element={<MyClasses />} />
        {/* <Route path="/classes/class" element={<BookClass />} /> */}
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
