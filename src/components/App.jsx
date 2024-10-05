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

function App() {
  const user = {
    name: "Zaid",
    email: "Zaid@hotmail.com",
    password: "Hello123",
  };
  const [loggedInUser, setLoggedInUser] = useState(null);
  console.log(loggedInUser);
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
