import React from "react";
import "./Styles.css";
import Header from "./Header";

function About() {
  return (
    <div>
      <Header />

      <div className="about-page-container">
        <h2>About FinControl</h2>

        <div className="about-container">
          <div className="about-text">
            <p>
              <strong>FinControl</strong> is your all-in-one financial
              management tool, designed to help you track expenses, manage
              budgets, and make smarter financial decisions.
            </p>

            <p>
              Our mission is to empower individuals and businesses to gain
              complete control over their finances through intuitive design,
              real-time analytics, and personalized insights.
            </p>

            <p>
              In near feature we would like to integrate our app with features
              like expense categorization, monthly budget tracking, and
              AI-powered spending recommendations. FinControl transforms the
              way you handle money — making it smarter, simpler, and
              stress-free.
            </p>

            <h3>Our Vision</h3>
            <p>
              We believe financial freedom starts with understanding where your
              money goes. Our goal is to help millions make confident,
              well-informed financial choices.
            </p>
          </div>

          <div className="about-images">
            <img
              src="https://static.sheetgo.com/wp-content/uploads/2023/09/blog-cover_finance-processes-and-templates.webp"
              alt="FinControl Dashboard"
            />

            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHpXgghSN3X9iV5e7Nvq_n_sLlMnXb1sUr_Q&s"
              alt="Mobile App View"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
