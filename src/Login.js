import React, { useState } from "react";
import "./Styles.css";
import { Link, useNavigate } from "react-router-dom";
import apiFetch from "./utils/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      // backend returns { user, token } on success
      if (data && data.token) {
        // save session (consistent key used across app)
        localStorage.setItem(
          "fincontrol_session",
          JSON.stringify({ token: data.token, user: data.user })
        );

        // navigate to home (or dashboard) after successful login
        navigate("/home", { replace: true });
      } else {
        alert((data && (data.error || data.message)) || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="auth-container">
        <img
          src="https://i.postimg.cc/Znc0HThY/unnamed.png"
          alt="FinControl Logo"
          className="logo"
        />
        <h2>Login to FinControl</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
          <p className="alt-text">
            Don't have an account?
            <Link to="/register"> Sign Up </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
