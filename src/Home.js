import React from "react";
import { Link } from "react-router-dom";
import "./Styles.css";
import Header from "./Header";

function Home() {
  // Read user from the session
  const session = JSON.parse(localStorage.getItem("fincontrol_session") || "null");
  const user = session?.user;

  return (
    <div>
      <Header />

      <div className="home-container">
        <img
          src="https://i.postimg.cc/Znc0HThY/unnamed.png"
          alt="FinControl Logo"
          className="logo"
        />
        <h1>Welcome to FinControl</h1>

        {/* Show user's name only if logged in */}
        {user && <h1>{user.name}</h1>}

        <p>
          Smart savings,
          <br />
          Manage your expenses wisely
        </p>

        <Link to="/services" className="get-started-btn">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default Home;
