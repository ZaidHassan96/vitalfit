import React from "react";
import "../stylesheets/Banner.css";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    // <div className="banner">
    //   <img src="../images/projects.jpg" alt="" />
    // </div>
    <div className="banner">
      <video autoPlay muted loop playsInline>
        <source src="../images/banner.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* <img src="../images/banner.jpg" alt="" /> */}

      <div class="overlay">
        <h1>
          Join the Fitness <span>Movement</span>
        </h1>
        {/* <Link to={"/sign-up"}>
          <button>Get Started</button>
        </Link> */}
      </div>
    </div>
  );
};

export default Banner;
