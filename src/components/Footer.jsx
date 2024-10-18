import React from "react";
import "../stylesheets/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="quotes">
        <h1>
          Fitness is <span>Vital</span>
        </h1>
        <p>
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos maiores,
          vitae recusandae quibusdam ipsam rem explicabo id dicta et vero
          debitis quas sed fuga provident excepturi nihil incidunt quidem
          delectus.""
        </p>
      </div>
      <div className="connect">
        <div>
          <h1 style={{ fontSize: "3rem" }}>
            Vital<span>Fit</span>
          </h1>
        </div>
        <div className="socials-container">
          <div>
            <h1 style={{ marginLeft: "0rem", fontSize: "2rem" }}>
              <span>Connect</span>
            </h1>
          </div>
          <div className="socials">
            <p>Insta</p>
            <p>Twitter</p>
            <p>WhatsApp</p>
          </div>
        </div>
        <div>
          <div>
            <h1 style={{ fontSize: "2rem" }}>
              <span>Contact Us</span>
            </h1>
          </div>
          <div>
            <p>07565732876</p>
            <p>VitalFit@hotmail.com</p>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
