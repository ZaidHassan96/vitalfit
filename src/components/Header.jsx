import "../stylesheets/Header.css";

const Header = () => {
  return (
    <header>
      <div className="title">
        <h1>Vital</h1>
        <h1 className="fit">Fit</h1>
      </div>
      <nav>
        <ul className="navbar">
          <li>
            <a href="#">Find Events</a>
          </li>
          <li>
            <a href="#">Login</a>
          </li>
          <li>
            <a href="#">Sign Up</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
