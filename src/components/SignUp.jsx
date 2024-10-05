import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <>
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
          <form action="" method="POST">
            <div>
              <label htmlFor="forename"></label>
              <input
                type="forename"
                id="forename"
                name="forename"
                placeholder="Forename"
              />
            </div>
            <div>
              <label htmlFor="surname"></label>
              <input
                type="surname"
                id="surname"
                name="surname"
                placeholder="Surname"
              />
            </div>
            <div>
              <label htmlFor="email"></label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
              />
            </div>

            <div>
              <label htmlFor="password"></label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
              />
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
    </>
  );
};

export default SignUp;
