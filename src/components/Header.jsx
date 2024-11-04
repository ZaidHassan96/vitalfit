import "../stylesheets/Header.css";
import { Link, useNavigate } from "react-router-dom";

import { useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu"; // Burger icon
import CloseIcon from "@mui/icons-material/Close"; //
import { doc } from "firebase/firestore";
import { useUser } from "../context/User";

const Header = () => {
  const { loggedInUser, logOut } = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false); // State to toggle the drawer

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");
      const headerSmall = document.querySelector(".header-small");

      if (header || headerSmall) {
        if (window.scrollY > 60) {
          header.classList.add("scrolled");
          headerSmall.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
          headerSmall.classList.remove("scrolled");
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
    logOut();
  };

  return (
    <>
      <header className="header-small">
        <Link to={"/"}>
          <div className="title">
            <h1 className="vital">Vital</h1>
            <h1 className="fit">Fit</h1>
          </div>
        </Link>
        {!drawerOpen && (
          <MenuIcon
            className="burger-icon"
            onClick={() => setDrawerOpen(true)}
          />
        )}

        <nav className={`drawer ${drawerOpen ? "open" : ""}`}>
          <CloseIcon
            className="close-icon"
            onClick={() => setDrawerOpen(false)}
          />
          <ul className="navbar">
            <li>
              <Link onClick={() => setDrawerOpen(false)} to={"/"}>
                Home
              </Link>
            </li>
            <li>
              <Link onClick={() => setDrawerOpen(false)} to={"/classes"}>
                Classes
              </Link>
            </li>
            {loggedInUser ? (
              <>
                <li>
                  <Link onClick={() => setDrawerOpen(false)} to={"/my-classes"}>
                    My Classes
                  </Link>
                </li>
                <li>
                  <a
                    onClick={(e) => {
                      handleLogout(e);
                      setDrawerOpen(false);
                    }}
                    href=""
                  >
                    Logout
                  </a>
                </li>
              </>
            ) : (
              <li>
                <Link onClick={() => setDrawerOpen(false)} to={"/login"}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
        {drawerOpen && (
          <div
            className="overlay-nav"
            onClick={() => setDrawerOpen(false)}
          ></div>
        )}
      </header>

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
                <AccountCircleIcon
                  style={{ color: "white", fontSize: "1.1rem" }}
                />

                <span className="dropdown-email">{loggedInUser.email}</span>

                <ExpandMoreIcon className="dropdown-arrow" />

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
    </>
  );
};

export default Header;
