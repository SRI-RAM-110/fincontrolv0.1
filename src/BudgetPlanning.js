import React, { useEffect, useState } from "react";
import "./Styles.css";
import { useNavigate } from "react-router-dom";
import apiFetch, { getSession } from "./utils/api";

function BudgetPlanning() {
  const navigate = useNavigate();

  const [month] = useState(new Date().toISOString().slice(0, 7));
  const [totalAmount, setTotalAmount] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- Fixed Expenses (EMI, Rent) ---------------- */

  const [fixedExpenses, setFixedExpenses] = useState([]);

  useEffect(() => {
    const loadFixedExpenses = async () => {
      const session = getSession();
      if (!session || !session.token) {
        navigate("/login");
        return;
      }

      const data = await apiFetch("/api/fixed-expenses", { method: "GET" });

      setFixedExpenses(
        data.map(d => ({
          id: d._id,
          name: d.name,
          amount: d.amount
        }))
      );
    };

    loadFixedExpenses();
  }, [navigate]);

  const updateFixedAmount = async (index, value) => {
    const updated = [...fixedExpenses];
    updated[index].amount = value;
    setFixedExpenses(updated);

    await apiFetch(`/api/fixed-expenses/${updated[index].id}`, {
      method: "PUT",
      body: { amount: Number(value) }
    });
  };

  /* ---------------- Predefined Categories ---------------- */

  const PREDEFINED_CATEGORIES = [
    "Food",
    "Travel",
    "Utilities",
    "Groceries",
    "Entertainment",
    "Healthcare",
    "Education",
    "Savings",
    "Miscellaneous"
  ];

  const [categories, setCategories] = useState([]);

  const addCategory = () => {
    setCategories([
      ...categories,
      { name: "", amount: "" }
    ]);
  };

  const updateCategory = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  /* ---------------- Calculations ---------------- */

  const fixedTotal = fixedExpenses.reduce(
    (sum, f) => sum + Number(f.amount || 0),
    0
  );

  const categoriesTotal = categories.reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0
  );

  const remainingAmount =
    Number(totalAmount || 0) - fixedTotal - categoriesTotal;

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (remainingAmount < 0) {
      alert("Expenses exceed total budget");
      return;
    }

    if (categories.some(c => !c.name)) {
      alert("Please select a category for all entries");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        month,
        totalAmount: Number(totalAmount),
        categories: [
          ...fixedExpenses.map(f => ({
            name: f.name,
            amount: Number(f.amount || 0),
            fixed: true
          })),
          ...categories.map(c => ({
            name: c.name,
            amount: Number(c.amount || 0),
            fixed: false
          }))
        ]
      };

      const data = await apiFetch("/api/budgets", {
        method: "POST",
        body: payload
      });

      if (data && (data._id || data.id)) {
        alert("Budget saved successfully!");
        setTotalAmount("");
        setCategories([]);
      } else {
        alert(data?.error || "Failed to save budget");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Navigation ---------------- */

  const goBack = () => navigate("/services");
  const goToHistory = () => navigate("/budget-history");

  /* ---------------- UI ---------------- */

  return (
    <div className="expense-page-container">
      <h2>Budget Planning</h2>

      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        Back
      </button>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Total Amount"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
        />

        <h3 style={{ marginTop: "20px" }}>Fixed Expenses</h3>

        {fixedExpenses.map((f, index) => (
          <div key={f.id} style={{ marginBottom: "10px" }}>
            <strong>{f.name}</strong>
            <input
              type="number"
              value={f.amount}
              onChange={(e) =>
                updateFixedAmount(index, e.target.value)
              }
              style={{ marginLeft: "10px" }}
            />
          </div>
        ))}

        <h3 style={{ marginTop: "20px" }}>Other Expenses</h3>

        {categories.map((c, index) => (
  <div key={index} className="category-row">
    <select
      className="category-select"
      value={c.name}
      onChange={(e) =>
        updateCategory(index, "name", e.target.value)
      }
      required
    >
      <option value="">Select category</option>
      {PREDEFINED_CATEGORIES.map(cat => (
        <option
          key={cat}
          value={cat}
          disabled={categories.some(
            existing => existing.name === cat
          )}
        >
          {cat}
        </option>
      ))}
    </select>

    <input
      type="number"
      className="category-amount"
      placeholder="Amount"
      value={c.amount}
      onChange={(e) =>
        updateCategory(index, "amount", e.target.value)
      }
      required
    />

    <button
      type="button"
      className="remove-category-btn"
      onClick={() => removeCategory(index)}
    >
      Remove
    </button>
  </div>
))}


        <button type="button" onClick={addCategory}>
          + Add Category
        </button>

        <p style={{ marginTop: "15px" }}>
          <strong>Remaining Amount:</strong> {remainingAmount}
        </p>

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
