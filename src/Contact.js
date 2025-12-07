import React from "react";
import "./Styles.css";
import Header from "./Header";

function Contact() {
  return (
    <div>
      <Header />

      <div className="contact-page-container">
        <h2>Contact Us</h2>

        <div className="contact-container">
          <p>
            If you have any questions, ideas, or opportunities, feel free to
            reach out.
          </p>

          <div className="contact-details">
            <p>
              <strong>Email:</strong> fincontrol@gmail.com
            </p>
            <p>
              <strong>Mobile:</strong> +91-9876543210
            </p>
          </div>

          <h3>Connect with me</h3>

          <ul>
            <li>
              <a
                href="https://www.linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>

            <li>
              <a
                href="https://www.hackerrank.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
              >
                HackerRank
              </a>
            </li>

            <li>
              <a
                href="https://yourportfolio.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Contact;
