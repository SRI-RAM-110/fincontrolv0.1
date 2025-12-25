import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./Profile.css";
import apiFetch, { getSession } from "./utils/api";

const EMPTY_PROFILE = {
  mobile: "",
  gender: "",
  dob: "",
  marital_status: "",
  address: "",
};

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PROFILE);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      const session = getSession();
      if (!session?.token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const data = await apiFetch("/api/auth/me");
        setUser(data);
        setFormData({
          ...EMPTY_PROFILE,
          ...data,
          dob: data?.dob ? data.dob.slice(0, 10) : "",
        });
        setLoading(false);
        return;
      } catch {
        if (session?.user) {
          const u = session.user;
          setUser(u);
          setFormData({
            ...EMPTY_PROFILE,
            ...u,
            dob: u?.dob ? u.dob.slice(0, 10) : "",
          });
          setLoading(false);
          return;
        }
      }

      localStorage.removeItem("fincontrol_session");
      navigate("/login", { replace: true });
    };

    loadProfile();
  }, [navigate]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      const payload = {
        mobile: formData.mobile,
        gender: formData.gender,
        dob: formData.dob,
        marital_status: formData.marital_status,
        address: formData.address,
      };

      const updated = await apiFetch("/api/auth/me", {
        method: "PUT",
        body: payload,
      });

      // 🔥 merge instead of replace
      const mergedUser = { ...user, ...updated };

      setUser(mergedUser);
      setFormData({
        ...EMPTY_PROFILE,
        ...mergedUser,
        dob: mergedUser?.dob ? mergedUser.dob.slice(0, 10) : "",
      });
      setEditMode(false);

      const session = getSession();
      localStorage.setItem(
        "fincontrol_session",
        JSON.stringify({ ...session, user: mergedUser })
      );

      alert("Profile updated successfully");
    } catch (err) {
      alert(err.message || "Update failed");
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (!user) return <div>No profile available</div>;

  const initials = user.name?.charAt(0)?.toUpperCase();

  return (
    <div>
      <Header />

      <div className="profile-page">
        {/* ================= PROFILE CARD ================= */}
        <div className="profile-card">
          <div className="profile-avatar">{initials}</div>
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>

          {!editMode ? (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setFormData({
                    ...EMPTY_PROFILE,
                    ...user,
                    dob: user?.dob ? user.dob.slice(0, 10) : "",
                  });
                  setEditMode(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* ================= PROFILE DETAILS (VIEW MODE) ================= */}
        {!editMode && (
          <div className="profile-summary">
  <div className="profile-row">
    <span className="profile-label">Mobile</span>
    <span className="profile-value">{user.mobile || "Not added"}</span>
  </div>

  <div className="profile-row">
    <span className="profile-label">Gender</span>
    <span className="profile-value">{user.gender || "Not added"}</span>
  </div>

  <div className="profile-row">
    <span className="profile-label">DOB</span>
    <span className="profile-value">
      {user.dob ? new Date(user.dob).toLocaleDateString() : "Not added"}
    </span>
  </div>

  <div className="profile-row">
    <span className="profile-label">Marital Status</span>
    <span className="profile-value">
      {user.marital_status || "Not added"}
    </span>
  </div>

  <div className="profile-row full">
    <span className="profile-label">Address</span>
    <span className="profile-value">{user.address || "Not added"}</span>
  </div>
</div>

        )}

        {/* ================= EDIT FORM ================= */}
        {editMode && (
          <div className="profile-details">
            <h3>Edit Personal Information</h3>

            <div className="details-grid">
              <div>
                <label>Mobile</label>
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Marital Status</label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                </select>
              </div>

              <div className="full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
