import Header from "./Header.jsx";
import SingleEventCard from "./SingleEventCard.jsx";
import "../stylesheets/Home.css";
import Banner from "./Banner.jsx";
import Footer from "./Footer.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";

const Home = (setLoggedInUser) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <section className="home-container">
        <Header setLoggedInUser={setLoggedInUser} />
        {/* <SingleEventCard /> */}
        <Banner />

        <div className="about">
          {/* <img src="../images/projects.jpg" alt="" /> */}

          <div className="about-text">
            <h1>
              FITNESS THE <span>VITAL</span> WAY
            </h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* <img src="../images/projects.jpg" alt="" /> */}
        </div>

        <div className="weight-rack-img">
          <img src="../images/weightrack.jpg" alt="" />
        </div>

        <div className="classes-types">
          <h1>
            CLASSES WE <span>OFFER</span>
          </h1>
          <div className="classes-img">
            <img src="../images/hiit.jpg" alt="Hiit Class Image" />
            <img src="../images/spin.jpg" alt="Spin Class Image" />
            <img src="../images/yoga.jpg" alt="Yoga Class Image" />
          </div>
        </div>
        <div className="footer-home">
          <Footer />
        </div>
      </section>
    </>
  );
};

export default Home;
