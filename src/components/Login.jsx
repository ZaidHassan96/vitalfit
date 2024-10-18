import Header from "./Header";
import "../stylesheets/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

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
  const navigate = useNavigate();

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
      const uid = user.uid;

      // After signing in, fetch the user document from Firestore
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
      navigate("/");
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
