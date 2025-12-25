import React from "react";
import { Link } from "react-router-dom";
import "./Styles.css";
import Header from "./Header";

function Home() {
  const session = JSON.parse(localStorage.getItem("fincontrol_session") || "null");
  const user = session?.user;

  return (
    <div>
      <Header />

      <div className="home-container">
        {/* Hero Card */}
        <div className="home-hero card">
          <img
            src="https://i.postimg.cc/Znc0HThY/unnamed.png"
            alt="FinControl Logo"
            className="home-logo"
          />

          <h1 className="home-title">
            Take Control of Your Money
          </h1>

          {user && (
            <p className="home-user">
              Welcome back, <strong>{user.name}</strong>
            </p>
          )}

          <p className="home-subtitle">
            Track expenses, plan budgets, and understand your spending
            <br />
            all in one simple dashboard.
          </p>

          <div className="home-actions">
  <Link to="/add-expense" className="btn-primary">
    Add Expense
  </Link>
  <Link to="/expense-history" className="btn-secondary">
    View History
  </Link>
</div>

        </div>

        {/* Feature Section */}
        <div className="home-features">
          <div className="feature-card">
            <h3>Expense Tracking</h3>
            <p>Log daily expenses and stay aware of your spending.</p>
          </div>

          <div className="feature-card">
            <h3>Budget Planning</h3>
            <p>Create monthly budgets and manage fixed & flexible costs.</p>
          </div>

          <div className="feature-card">
            <h3>Clear Insights</h3>
            <p>Understand where your money goes with simple summaries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
