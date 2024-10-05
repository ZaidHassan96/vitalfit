import "../stylesheets/Header.css";
import { Link } from "react-router-dom";
import UserContext from "../context/User";
import { useContext } from "react";

const Header = () => {
  const { loggedInUser } = useContext(UserContext);

  return (
    <header className="header">
      <div className="title">
        <h1 className="vital">Vital</h1>
        <h1 className="fit">Fit</h1>
      </div>
      <nav>
        <ul className="navbar">
          <li>
            <Link className="" to={"/classes"}>
              Find Classes
            </Link>
          </li>
          {loggedInUser ? (
            <li>
              <Link to={"/my-classes"}>My Classes</Link>
            </li>
          ) : (
            <li>
              <Link to={"/login"}>Login</Link>
            </li>
          )}
          {loggedInUser ? (
            <h1 className="user-email">{loggedInUser.email}</h1>
          ) : (
            <li>
              <Link to={"/sign-up"}>Sign up</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
