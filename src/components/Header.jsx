import "../stylesheets/Header.css";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/User";
import { useContext } from "react";

const Header = () => {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  console.log(setLoggedInUser);

  const navigate = useNavigate();

  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");

    if (window.scrollY > 60) {
      // Adjust the scroll value as needed
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  const handleLogout = (e) => {
    e.preventDefault();
    setLoggedInUser(null);
    navigate("/");
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
