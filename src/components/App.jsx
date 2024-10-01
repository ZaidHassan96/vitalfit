import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "../stylesheets/App.css";
import UserContext from "../context/User.jsx";
import Home from "./Home.jsx";
import AllClasses from "./AllClasses.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";

function App() {
  return (
    <UserContext.Provider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classes" element={<AllClasses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
