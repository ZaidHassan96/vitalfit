import React from "react";
import "../stylesheets/Footer.css";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const Footer = () => {
  return (
    <div className="footer">
      <div className="quotes">
        <h1>
          Fitness is <span>Vital</span>
        </h1>
        <p>
          "Vital Fitness transformed my health! The personalized training and
          supportive community helped me achieve my goals. The trainers are
          amazing!"
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
            <h1 style={{ marginLeft: "1.5rem", fontSize: "2rem" }}>
              <span style={{ marginRight: "2rem" }}>Connect</span>
            </h1>
          </div>
          <div className="socials">
            <InstagramIcon />
            <XIcon />
            <WhatsAppIcon />
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
