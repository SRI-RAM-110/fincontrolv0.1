import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./Profile.css";
import apiFetch, { getSession } from "./utils/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    marital_status: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const session = getSession();
      if (!session || !session.token) {
        // Not logged in
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Try to fetch profile from backend
        const data = await apiFetch("/api/auth/me", { method: "GET" });
        // If backend returns the user object
        if (data) {
          setUser(data);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            mobile: data.mobile || "",
            gender: data.gender || "",
            dob: data.dob ? data.dob.slice(0, 10) : "",
            marital_status: data.marital_status || "",
            address: data.address || "",
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        // If API is not available or returns error, we will fallback to session user
        console.warn("Fetching profile from API failed, falling back to session user", err);
      }

      // Fallback: load user from session stored in localStorage
      const sessionUser = session?.user;
      if (sessionUser) {
        setUser(sessionUser);
        setFormData({
          name: sessionUser.name || "",
          email: sessionUser.email || "",
          mobile: sessionUser.mobile || "",
          gender: sessionUser.gender || "",
          dob: sessionUser.dob ? sessionUser.dob.slice(0, 10) : "",
          marital_status: sessionUser.marital_status || "",
          address: sessionUser.address || "",
        });
        setLoading(false);
        return;
      }

      // If all else fails, force login
      localStorage.removeItem("fincontrol_session");
      navigate("/login", { replace: true });
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const session = getSession();
    if (!session || !session.token) {
      alert("Session expired. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      // Only send the editable fields to the backend
      const payload = {
        mobile: formData.mobile,
        gender: formData.gender,
        dob: formData.dob,
        marital_status: formData.marital_status,
        address: formData.address,
      };

      const data = await apiFetch("/api/auth/me", {
        method: "PUT",
        body: payload,
      });

      // If server returned updated user object, update UI & session
      if (data) {
        setUser(data);
        // update session in localStorage so other pages see updated profile
        const existingSession = getSession() || {};
        const mergedUser = { ...(existingSession.user || {}), ...data };
        localStorage.setItem(
          "fincontrol_session",
          JSON.stringify({ ...existingSession, user: mergedUser })
        );
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      alert(err.message || "Something went wrong. Try again.");
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>No profile available.</div>;

  return (
    <div>
      <Header />
      <div className="profile-container">
        <h2>User Profile</h2>
        <form onSubmit={handleUpdate} className="profile-form">
          <label>
            Name:
            <input type="text" name="name" value={formData.name} readOnly />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} readOnly />
          </label>
          {/* Uncomment editable fields if you want users to update them */}
          {/*
          <label>
            Mobile:
            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
          </label>
          <label>
            Gender:
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            DOB:
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </label>
          <label>
            Marital Status:
            <select name="marital_status" value={formData.marital_status} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </label>
          <label>
            Address:
            <textarea name="address" value={formData.address} onChange={handleChange} />
          </label>
          <button type="submit">Update Profile</button>
          */}
        </form>
      </div>
    </div>
  );
}

export default Profile;
