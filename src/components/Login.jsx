import Header from "./Header";
import "../stylesheets/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleLogin } from "../utils/utils";

const Login = ({ setLoggedInUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(email, password, "/", setError, setLoggedInUser, navigate);
  };

  return (
    <>
      {/* <Header /> */}
      <section className="container">
        <section className="login-page">
          <div className="headline">
            <Link to={"/"}>
              <h1>
                Vital<span className="span-black">Fit</span>
              </h1>
            </Link>
            <h2>Log in</h2>
          </div>
          {error && (
            <p style={{ textAlign: "center" }} className="error">
              Email address or Password is incorrect
            </p>
          )}
          <div className="login-form">
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

export default Login;
