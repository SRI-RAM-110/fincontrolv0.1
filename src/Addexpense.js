import React, { useState } from "react";
import "./Styles.css";
import { useNavigate } from "react-router-dom";
import apiFetch from "./utils/api";

function AddExpense() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    expense_date: "",
    description: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // read session token
    const session = JSON.parse(localStorage.getItem("fincontrol_session") || "null");
    if (!session || !session.token) {
      alert("You must be logged in to add expenses");
      navigate("/login");
      return;
    }

    // Build payload matching backend Transaction model
    const payload = {
      type: "expense", // your backend expects: 'income' or 'expense'
      amount: Number(formData.amount),
      category: formData.category,
      note: formData.description,
      date: formData.expense_date
        ? new Date(formData.expense_date).toISOString()
        : new Date().toISOString(),
    };

    try {
      const data = await apiFetch("/api/transactions", {
        method: "POST",
        body: payload,
      });

      if (data && data._id) {
        alert("Expense added successfully!");

        // Reset form
        setFormData({
          category: "",
          amount: "",
          expense_date: "",
          description: "",
        });
      }
    } catch (err) {
      alert(err.message || "Failed to add expense");
      console.error("Expense error:", err);
    }
  };

  const goToHistory = () => navigate("/expense-history");
  const goBack = () => navigate("/services");

  return (
    <div className="expense-page-container">
      <h2>Add Expense</h2>

      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        Back
      </button>

      <form className="expense-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.01"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="expense_date"
          value={formData.expense_date}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit">Save Expense</button>
          <button type="button" onClick={goToHistory}>
            History
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddExpense;
