import "../stylesheets/Header.css";
import { Link } from "react-router-dom";

const Header = () => {
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
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
          <li>
            <Link to={"/sign-up"}>Sign Up</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
