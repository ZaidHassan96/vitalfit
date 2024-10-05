import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../stylesheets/SmallLogin.css";

const SmallLogin = ({
  showBookingCard,
  setShowBookingCard,
  setLoggedInUser,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = {
    name: "Zaid",
    email: "Zaid@hotmail.com",
    password: "Hello123",
  };
  function verifyUser(event) {
    event.preventDefault();
    if (email !== user.email || password !== user.password) {
      console.log("incorrect details");
    } else {
      setLoggedInUser(user);
      console.log("logged in");
    }
  }
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
          <form action="" method="POST" onSubmit={verifyUser}>
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