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
              At Vital Fitness, we empower you to achieve your health goals
              through personalized training and a supportive community. Our
              expert trainers are dedicated to helping you build strength,
              improve flexibility, and enhance overall wellness. Join us on your
              journey to a healthier you!
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
            <div>
              <img src="/images/hiit.jpg" alt="Hiit Class Image" />
              <h3 className="hiit-overlay">Hiit</h3>
            </div>
            <div>
              <img src="/images/spin.jpg" alt="Spin Class Image" />
              <h3 className="spin-overlay">Spin</h3>
            </div>
            <div>
              <img src="/images/yoga.jpg" alt="Yoga Class Image" />
              <h3 className="yoga-overlay">Yoga</h3>
            </div>
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
