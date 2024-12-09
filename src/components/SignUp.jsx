import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import BeatLoader from "react-spinners/BeatLoader";
import { handleSignUp } from "../utils/utils";

const SignUp = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    fitnessLevel: "",
    bookedClasses: {},
    isTrainer: false,
  });

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [firstNameErr, setFirstNameErr] = useState("");
  const [lastNameErr, setLastNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [error, setError] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [accountCreationErr, setAccountCreationErr] = useState(null);
  const [signingUp, setSigningUp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  //   const email = userInfo.email;

  // const handleSignUp = async (email, password, userInfo) => {
  //   setSigningUp(true);
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const user = userCredential.user;
  //     const uid = user.uid;

  //     await setDoc(doc(db, "users", uid), {
  //       email: userInfo.email,
  //       firstName: userInfo.firstName,
  //       lastName: userInfo.lastName,
  //       isTrainer: userInfo.isTrainer,
  //       fitnessLevel: userInfo.fitnessLevel,
  //       // bookedClasses: userInfo.bookedClasses,
  //       createdAt: serverTimestamp(),
  //       userId: uid,
  //     });
  //     setAccountCreationErr(null);
  //     setSigningUp(false);
  //     return true;
  //   } catch (error) {
  //     setSigningUp(false);
  //     setAccountCreationErr(error);

  //     return false;
  //   }
  // };
  const nameRegex =
    /^[A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,50}(?: [A-Za-zÀ-ÖØ-öø-ÿ'’-]{2,50})*$/;

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}\s*$/;
  ``;
  const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}\s*$/;

  const isFormValid = () => {
    if (
      firstNameErr ||
      lastNameErr ||
      emailErr ||
      passwordErr ||
      !userInfo.fitnessLevel
    ) {
      setError("Please fill out all sections.");
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (isFormValid()) {
      try {
        // Wait for handleSignUp to finish before continuing
        const signUpSuccess = await handleSignUp(
          userInfo.email,
          password,
          userInfo,
          setSigningUp,
          setAccountCreationErr
        );

        if (signUpSuccess && !accountCreationErr) {
          navigate("/login");
        } else {
          console.warn("Sign-up failed, not navigating to login.");
        }
      } catch (error) {
        setError(error); // Handle error during sign-up
        console.error("Error during sign-up:", error);
      }
    } else {
      console.warn("Form validation failed.");
    }
  };

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

            <h2>Sign up</h2>
          </div>
          {accountCreationErr &&
            accountCreationErr.code === "auth/email-already-in-use" && (
              <p className="error" style={{ textAlign: "center" }}>
                Email already Exists.
              </p>
            )}
          {error && (
            <p className="error" style={{ textAlign: "center" }}>
              {error}
            </p>
          )}
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
                  onBlur={() => {
                    if (!nameRegex.test(userInfo.firstName)) {
                      setFirstNameErr(
                        "Forename must be between 2-50 characters long"
                      );
                    } else {
                      setFirstNameErr("");
                    }
                  }}
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
                  onBlur={() => {
                    if (!nameRegex.test(userInfo.lastName)) {
                      setLastNameErr(
                        "Surname must be between 2-50 characters long"
                      );
                    } else {
                      setLastNameErr("");
                    }
                  }}
                />
              </div>
              <div>
                {emailErr && <p className="error">{emailErr}</p>}
                <label htmlFor="email"></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  onChange={handleChange}
                  onBlur={() => {
                    if (!emailRegex.test(userInfo.email)) {
                      setEmailErr("Please enter a valid email.");
                    } else {
                      setEmailErr("");
                    }
                  }}
                />
              </div>

              <div>
                {passwordErr && <p className="error">{passwordErr}</p>}
                <label htmlFor="password"></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => {
                    if (!passwordRegex.test(password)) {
                      setPasswordErr(
                        "Password needs to be at least 6 characters long, including both letters and numbers."
                      );
                    } else {
                      setPasswordErr("");
                    }
                  }}
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
                {signingUp ? (
                  <BeatLoader color="rgb(255, 77, 0)" />
                ) : (
                  <button disabled={!isFormValid} type="submit">
                    Sign up
                  </button>
                )}
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
