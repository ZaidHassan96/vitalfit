import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "../stylesheets/App.css";
import Home from "./Home.jsx";
import AllClasses from "./AllClasses.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classes" element={<AllClasses />} />
      </Routes>
    </>
  );
}

export default App;
