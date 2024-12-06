import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "../stylesheets/App.css";
import Home from "./Home.jsx";
import AllClasses from "./AllClasses.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import MyClasses from "./MyClasses.jsx";
import { gapi } from "gapi-script";
import ScrollToTop from "./ScrollToTop.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { initializeGAPI } from "../utils/googleApiLogic.js";

function App() {
  const [filterOptions, setFilterOptions] = useState({
    className: "",
    classDate: "",
    classTrainer: "",
  });

  //Initializing Google API
  useEffect(() => {
    gapi.load("client:auth2", initializeGAPI);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="*"
          element={<ErrorPage errMsg={"Error 404: page not found"} />}
        />
        <Route path="/" element={<Home />} />
        <Route
          path="/classes"
          element={
            <AllClasses
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/my-classes"
          element={
            <MyClasses
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
