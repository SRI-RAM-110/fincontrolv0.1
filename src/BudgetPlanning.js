import React, { useState } from "react";
import "./Styles.css";
import { useNavigate } from "react-router-dom";
import apiFetch, { getSession } from "./utils/api";

function BudgetPlanning() {
  const [totalAmount, setTotalAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const session = getSession();
    if (!session || !session.token) {
      alert("You must be logged in");
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    try {
      // Backend expects { month, amount }
      const payload = {
        month: new Date().toISOString().slice(0, 7), // "YYYY-MM"
        amount: Number(totalAmount),
      };

      // Use the shared api helper (it adds Authorization header)
      const data = await apiFetch("/api/budgets", {
        method: "POST",
        body: payload,
      });

      if (data && (data._id || data.id)) {
        alert("Budget saved successfully!");
        setTotalAmount("");
      } else {
        alert((data && (data.error || data.message)) || "Failed to save budget");
      }
    } catch (err) {
      console.error("Save budget error:", err);
      alert(err.message || "Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  const goToHistory = () => navigate("/budget-history");
  const goBack = () => navigate("/services");

  return (
    <div className="expense-page-container">
      <h2>Budget Planning</h2>
      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        Back
      </button>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          step="0.01"
          placeholder="Total Amount"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Budget"}
          </button>
          <button type="button" onClick={goToHistory}>
            History
          </button>
        </div>
      </form>
    </div>
  );
}

export default BudgetPlanning;
