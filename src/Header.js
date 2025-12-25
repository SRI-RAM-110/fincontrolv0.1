import "./Styles.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  // Read session stored after login/register
  const session = JSON.parse(localStorage.getItem("fincontrol_session") || "null");
  const user = session?.user || null;

  const handleLogout = () => {
    localStorage.removeItem("fincontrol_session");
    navigate("/login", { replace: true });
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo-container">
          <img
            src="https://i.postimg.cc/Znc0HThY/unnamed.png"
            alt="FinControl Logo"
            className="logo"
          />
          <div className="brand-text">
            <h1>FinControl</h1>
            <p>Smart Finance, Smarter Life</p>
          </div>
        </div>

        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/analytics">Analytics</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>

        {user && (
          <div className="navbar-user">
            {user.name} | 
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
