import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../stylesheets/SmallLogin.css";
import { useUser } from "../context/User";
import { BeatLoader } from "react-spinners";

const SmallLogin = ({ showBookingCard, setShowBookingCard }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUser();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoggingIn(true);
      await logIn(email, password, "/classes");
      setLoggingIn(false);
    } catch (error) {
      setLoggingIn(false);
      setError(error);
    }
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
          <h2>Log in</h2>
        </div>
        {error && (
          <p
            style={{ textAlign: "center", color: "orangered" }}
            className="error"
          >
            Email address or Password is incorrect
          </p>
        )}
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
              {loggingIn ? (
                <BeatLoader color="rgb(255, 77, 0)" />
              ) : (
                <button type="submit">Log in</button>
              )}
            </div>
          </form>
        </div>
        <div className="sign-up-option-small">
          <div>
            <div className="split-container__divider">
              <div className="split-container__divider-line-small"></div>
              <div className="split-container__divider-text">or</div>
              <div className="split-container__divider-line-small"></div>
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
