import Header from "./Header";
import "../stylesheets/Login.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const Login = ({ setLoggedInUser }) => {
  console.log({ setLoggedInUser });
  //   const user = {
  //     name: "Zaid",
  //     email: "Zaid@hotmail.com",
  //     password: "Hello123",
  //   };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //   function verifyUser(event) {
  //     event.preventDefault();
  //     if (email !== user.email || password !== user.password) {
  //       console.log("incorrect details");
  //     } else {
  //       setLoggedInUser(user);
  //       console.log("logged in");
  //     }
  //   }

  const handleLogin = async (email, password) => {
    console.log("hello");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      setLoggedInUser(user);
      console.log("succesfully logged in");
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(email, password);
  };

  return (
    <>
      {/* <Header /> */}
      <section className="login-page">
        <div className="headline">
          <Link to={"/"}>
            <h1>
              Vital<span>Fit</span>
            </h1>
          </Link>
          <h2>Log in</h2>
        </div>
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
    </>
  );
};

export default Login;
