import Header from "./Header.jsx";
import SingleEventCard from "./SingleEventCard.jsx";
import "../stylesheets/Home.css";
import Banner from "./Banner.jsx";
import Footer from "./Footer.jsx";

const Home = (setLoggedInUser) => {
  return (
    <>
      <Header setLoggedInUser={setLoggedInUser} />
      {/* <SingleEventCard /> */}
      <Banner />

      <section className="about">
        {/* <img src="../images/projects.jpg" alt="" /> */}

        <div className="about-text">
          <h1>
            FITNESS THE <span>VITAL</span> WAY
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>

        {/* <img src="../images/projects.jpg" alt="" /> */}
      </section>

      <section className="weight-rack-img">
        <img src="../images/weightrack.jpg" alt="" />
      </section>

      <section className="classes-types">
        <h1>
          CLASSES WE <span>OFFER</span>
        </h1>
        <div className="classes-img">
          <img src="../images/hiit.jpg" alt="Hiit Class Image" />
          <img src="../images/spin.jpg" alt="Spin Class Image" />
          <img src="../images/yoga.jpg" alt="Yoga Class Image" />
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
};

export default Home;
