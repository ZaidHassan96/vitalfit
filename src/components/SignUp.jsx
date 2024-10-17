import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";

const SignUp = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    fitnessLevel: "",
    bookedClasses: {},
    isTrainer: false,
  });

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  //   const email = userInfo.email;

  const handleSignUp = async (email, password, userInfo) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;

      await setDoc(doc(db, "users", uid), {
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        isTrainer: userInfo.isTrainer,
        fitnessLevel: userInfo.fitnessLevel,
        bookedClasses: userInfo.bookedClasses,
        createdAt: serverTimestamp(),
        userId: uid,
      });
      console.log("user created succesfully");
    } catch (error) {
      setError(error);
      console.log("error:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSignUp(userInfo.email, password, userInfo);
  };

  console.log(userInfo);

  return (
    <>
      <section className="container">
        <section className="login-page">
          <div className="headline">
            <Link to={"/"}>
              <h1>
                Vital<span>Fit</span>
              </h1>
            </Link>
            <Link to={"/login"}>
              <h2>Sign up</h2>
            </Link>
          </div>
          <div className="login-form">
            <form action="" onSubmit={handleSubmit} method="POST">
              <div>
                <label htmlFor="forename"></label>
                <input
                  type="forename"
                  id="forename"
                  name="firstName"
                  placeholder="Forename"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="surname"></label>
                <input
                  type="surname"
                  id="surname"
                  name="lastName"
                  placeholder="Surname"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email"></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password"></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="fitnesslevel"></label>
                <select
                  id="fitnesslevel"
                  name="fitnessLevel"
                  value={userInfo.fitnessLevel}
                  onChange={handleChange}
                >
                  <option value="">Select Fitness Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <button type="submit">Sign up</button>
              </div>
            </form>
          </div>
          <div className="sign-up-option">
            <div>
              <div className="split-container__divider">
                <div className="split-container__divider-line"></div>
                <div className="split-container__divider-text">or</div>
                <div className="split-container__divider-line"></div>
              </div>
            </div>
            <Link to={"/login"}>
              <p>Login here</p>
            </Link>
          </div>
        </section>
        <section className="side-banner">
          <video autoPlay muted loop playsInline>
            <source src="../images/banner.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </section>
      </section>
    </>
  );
};

export default SignUp;

// const handleSignup = async (email, password, name) => {
//     try {
//         // Sign up user
//         const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
//         const user = userCredential.user; // Get user object
//         const uid = user.uid; // Get user UID

//         // Create user document in Firestore
//         await firebase.firestore().collection("users").doc(uid).set({
//             email: email,
//             name: name,
//             isTrainer: false,
//             createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//             updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
//         });

//         console.log("User created successfully!");
//     } catch (error) {
//         console.error("Error signing up:", error.message);
//         // Show error to user
//     }
// };
