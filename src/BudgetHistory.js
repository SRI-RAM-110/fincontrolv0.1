import React, { useEffect, useState } from "react";
import "./Styles.css";
import { useNavigate } from "react-router-dom";
import apiFetch, { getSession } from "./utils/api";

function BudgetHistory() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudgets = async () => {
      const session = getSession();
      if (!session || !session.token) {
        navigate("/login");
        return;
      }

      try {
        const data = await apiFetch("/api/budgets", { method: "GET" });
        if (Array.isArray(data)) {
          setBudgets(data);
        } else {
          alert(data?.error || "Failed to load budgets");
        }
      } catch (err) {
        console.error("Budget history error:", err);
        alert("Failed to load budget history");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [navigate]);

  const goBack = () => navigate("/budget-planning");

  if (loading) {
    return (
      <div className="planning-expense-page-container">
        Loading...
      </div>
    );
  }

  return (
    <div className="planning-expense-page-container">
      <h2>Budget History</h2>

      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        Back
      </button>

      {budgets.length === 0 ? (
        <p>No budget plans yet.</p>
      ) : (
        budgets.map((budget) => {
          const fixedCategories = budget.categories.filter(c => c.fixed);
          const flexibleCategories = budget.categories.filter(c => !c.fixed);

          const fixedTotal = fixedCategories.reduce(
            (sum, c) => sum + Number(c.amount || 0),
            0
          );

          const flexibleTotal = flexibleCategories.reduce(
            (sum, c) => sum + Number(c.amount || 0),
            0
          );

          return (
            <div
              key={budget._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "6px"
              }}
            >
              <p>
                <strong>Month:</strong> {budget.month}
              </p>
              <p>
                <strong>Total Amount:</strong> {budget.totalAmount}
              </p>
              <p>
                <strong>Fixed Expenses:</strong> {fixedTotal}
              </p>
              <p>
                <strong>Flexible Expenses:</strong> {flexibleTotal}
              </p>
              <p>
                <strong>Remaining Amount:</strong> {budget.remainingAmount}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {budget.createdAt
                  ? new Date(budget.createdAt).toLocaleDateString()
                  : "-"}
              </p>

              <h4>Categories</h4>

              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.categories.map((cat, index) => (
                    <tr key={index}>
                      <td>{cat.name}</td>
                      <td>{cat.amount}</td>
                      <td>{cat.fixed ? "Fixed" : "Flexible"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
}

export default BudgetHistory;
