import "../stylesheets/Header.css";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/User";
import { useContext, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const Header = () => {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  console.log(setLoggedInUser);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");

      if (header) {
        if (window.scrollY > 60) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default behavior of the event
    try {
      await signOut(auth); // Sign out the user from Firebase
      setLoggedInUser(null); // Update the state to reflect that the user is logged out
      navigate("/");
      const auth2 = gapi.auth2.getAuthInstance();
      if (auth2) {
        await auth.signOut();
        await auth2.disconnect();
        console.log("Google API session cleared");
      }
      // Redirect to the home page or desired route
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error); // Handle any errors that occur during sign out
    }
  };

  return (
    <header className="header">
      <Link to={"/"}>
        <div className="title">
          <h1 className="vital">Vital</h1>
          <h1 className="fit">Fit</h1>
        </div>
      </Link>
      <nav>
        <ul className="navbar">
          <li>
            <Link className="" to={"/"}>
              Home
            </Link>
          </li>
          <li>
            <Link className="" to={"/classes"}>
              Classes
            </Link>
          </li>
          {loggedInUser ? (
            <div className="dropdown">
              <span className="dropdown-email">{loggedInUser.email}</span>
              <div className="dropdown-content">
                <Link to={"/my-classes"}>My Classes</Link>
                <a onClick={handleLogout} href="">
                  Logout
                </a>
              </div>
            </div>
          ) : (
            <li>
              <Link to={"/login"}>Login</Link>
            </li>
          )}
          {/* {loggedInUser ? (
            <div className="dropdown">
              <span className="dropdown-email">{loggedInUser.email}</span>
              <div className="dropdown-content">
                <Link to={"/my-classes"}>My Classes</Link>
                <a onClick={handleLogout} href="">
                  Logout
                </a>
              </div>
            </div>
          ) : (
            // <h1  className="user-email">{loggedInUser.email}</h1>
            <li>
              <Link to={"/sign-up"}>Sign up</Link>
            </li>
          )} */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
