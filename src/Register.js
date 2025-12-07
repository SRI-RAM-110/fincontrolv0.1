import React, { useState } from "react";
import "./Styles.css";
import { Link, useNavigate } from "react-router-dom";
import apiFetch from "./utils/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== rePassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!name.trim() || !email.trim() || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { name, email, password },
      });

      // Backend returns { user, token } on success
      if (data && data.token) {
        // Save session (optional — keeps user logged in if you want)
        localStorage.setItem(
          "fincontrol_session",
          JSON.stringify({ token: data.token, user: data.user })
        );

        alert("Registration successful! You can now log in.");
        navigate("/login");
      } else {
        alert((data && data.error) || "Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-auth-container">
      <img
        src="https://i.postimg.cc/Znc0HThY/unnamed.png"
        alt="FinControl Logo"
        className="logo"
      />
      <h2>Register to FinControl</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
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
        <input
          type="password"
          placeholder="Re-enter Password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="alt-text">
          Already have an account?
          <Link to="/login"> Sign In </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
