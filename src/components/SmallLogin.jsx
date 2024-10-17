import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../stylesheets/SmallLogin.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const SmallLogin = ({
  showBookingCard,
  setShowBookingCard,
  setLoggedInUser,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    console.log("hello");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;

      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = await userDocSnap.data(); // This is where you get your custom user fields
        setLoggedInUser(userData);
        console.log("User data:", userData);
      } else {
        console.log("No such document!");
      }

      console.log("succesfully logged in");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(email, password);
  };

  return (
    <>
      <section
        className={showBookingCard ? "small-login-page" : "hide-small-login"}
      >
        <div>
          <h2
            className="exit"
            onClick={() => {
              setShowBookingCard(false);
            }}
          >
            X
          </h2>
        </div>
        <div className="small-login-headline">
          {/* <Link to={"/"}>
            <h1>
              Vital<span>Fit</span>
            </h1>
          </Link> */}
          <h2>Log in</h2>
        </div>
        <div className="small-login-form">
          <form action="" method="POST" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email"></label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="password"></label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div>
              <button type="submit">Log in</button>
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
          <Link to={"/sign-up"}>
            <p>Sign up</p>
          </Link>
        </div>
      </section>
    </>
  );
};

export default SmallLogin;
