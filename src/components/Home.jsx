import Header from "./Header.jsx";
import SingleEventCard from "./SingleEventCard.jsx";
import "../stylesheets/Home.css";

const Home = () => {
  return (
    <>
      <Header />
      {/* <SingleEventCard /> */}
      <div className="banner">
        <img src="../images/projects.jpg" alt="" />
        <div className="info">
          <h1>Hit Mania</h1>
        </div>
      </div>

      <section className="about">
        <img src="../images/projects.jpg" alt="" />

        <div className="about-text">
          <h1>About Us</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>

        <img src="../images/projects.jpg" alt="" />
      </section>

      <section className="upcoming-events">
        <h1>Upcoming Classes</h1>
        <div className="classes">
          <div>
            <img src="../images/projects.jpg" alt="" />
            <h1>Spin Class</h1>
            <h3>Sun, 20 Oct, 10:00</h3>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div>
            <img src="../images/projects.jpg" alt="" />
            <h1>Hiit Class</h1>
            <h3>Sun, 21 Oct, 12:00</h3>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div>
            <img src="../images/projects.jpg" alt="" />
            <h1>Yoga</h1>
            <h3>Sun, 24 Oct, 15:00</h3>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </section>
      <section className="connect-with-us">
        <p>Connect</p>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
      </section>
    </>
  );
};

export default Home;
