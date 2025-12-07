import React, { useEffect, useState } from "react";
import "./Styles.css";
import { useNavigate } from "react-router-dom";
import apiFetch, { getSession } from "./utils/api";

function ExpenseHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const session = getSession();
      if (!session || !session.token) {
        alert("You must be logged in to view history");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const data = await apiFetch("/api/transactions", { method: "GET" });

        if (Array.isArray(data)) {
          const mapped = data.map((exp) => ({
            id: exp._id,
            category: exp.category || "",
            amount: typeof exp.amount === "number" ? exp.amount : exp.amount ?? "",
            currency: exp.currency || "INR",
            expense_date: exp.date ? new Date(exp.date).toLocaleDateString() : "",
            description: exp.note || exp.notes || exp.title || "",
          }));
          setHistory(mapped);
        } else {
          alert((data && (data.error || data.message)) || "Failed to load expenses");
        }
      } catch (err) {
        console.error("Fetch history error:", err);
        alert(err.message || "Something went wrong while fetching history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const goBack = () => navigate("/add-expense");

  if (loading) return <div className="expense-page-container">Loading expenses...</div>;

  return (
    <div className="expense-page-container">
      <h2>Your Expense History</h2>
      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        Back
      </button>

      {history.length > 0 ? (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {history.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.category}</td>
                <td>{exp.amount}</td>
                <td>{exp.currency}</td>
                <td>{exp.expense_date}</td>
                <td>{exp.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No expenses found.</p>
      )}
    </div>
  );
}

export default ExpenseHistory;
