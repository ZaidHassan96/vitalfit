import { useEffect, useState } from "react";
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
import ScrollToTop from "./ScrollToTop.jsx";
import ErrorPage from "./ErrorPage.jsx";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  useEffect(() => {
    function initializeGAPI() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
        })
        .then(() => {})
        .catch((error) => {
          console.error("Google API initialization failed", error);
        });
    }

    gapi.load("client:auth2", initializeGAPI);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userData = localStorage.getItem("userData");

    if (userId) {
      // Set the logged-in user state
      setLoggedInUser(JSON.parse(userData));
    }
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <ScrollToTop />
      <Routes>
        <Route
          path="*"
          element={<ErrorPage errMsg={"Error 404: page not found"} />}
        />
        <Route path="/" element={<Home setLoggedInUser={setLoggedInUser} />} />
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
