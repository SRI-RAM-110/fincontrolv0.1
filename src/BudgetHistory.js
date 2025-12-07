import React, { useEffect, useState } from "react";
import "./Styles.css";
import { useNavigate } from "react-router-dom";
import apiFetch, { getSession } from "./utils/api";

function BudgetHistory() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Default distribution percentages
  const DISTRIBUTION = {
    rent: 0.30,
    food: 0.25,
    transport: 0.10,
    entertainment: 0.10,
    savings: 0.25,
  };

  function splitAmount(amount) {
    if (!amount || isNaN(amount)) {
      return {
        total: "0.00",
        rent: "0.00",
        food: "0.00",
        transport: "0.00",
        entertainment: "0.00",
        savings: "0.00",
        sumCheck: "0.00",
      };
    }

    const raw = {
      rent: amount * DISTRIBUTION.rent,
      food: amount * DISTRIBUTION.food,
      transport: amount * DISTRIBUTION.transport,
      entertainment: amount * DISTRIBUTION.entertainment,
      savings: amount * DISTRIBUTION.savings,
    };

    let rounded = {};
    let sumRounded = 0;

    Object.entries(raw).forEach(([key, value]) => {
      const r = Math.round((value + Number.EPSILON) * 100) / 100;
      rounded[key] = r;
      sumRounded += r;
    });

    // Fix tiny rounding difference
    const diff = Math.round((amount - sumRounded) * 100) / 100;
    rounded.savings = Math.round((rounded.savings + diff) * 100) / 100;

    const format = (v) => Number(v).toFixed(2);

    return {
      total: format(amount),
      rent: format(rounded.rent),
      food: format(rounded.food),
      transport: format(rounded.transport),
      entertainment: format(rounded.entertainment),
      savings: format(rounded.savings),
      sumCheck: format(
        rounded.rent +
          rounded.food +
          rounded.transport +
          rounded.entertainment +
          rounded.savings
      ),
    };
  }

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
          const mapped = data.map((b) => {
            const amount = Number(b.amount ?? 0);
            const split = splitAmount(amount);

            return {
              id: b._id,
              total_amount: split.total,
              rent: split.rent,
              food: split.food,
              transport: split.transport,
              entertainment: split.entertainment,
              savings: split.savings,
              created_at: b.createdAt
                ? new Date(b.createdAt).toLocaleDateString()
                : "-",
            };
          });
          setBudgets(mapped);
        } else {
          alert(data.error || "Failed to load budgets");
        }
      } catch (err) {
        console.error("Budget history error:", err);
        alert(err.message || "Something went wrong while loading budget history.");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [navigate]);

  const goBack = () => navigate("/budget-planning");

  if (loading)
    return <div className="planning-expense-page-container">Loading...</div>;

  return (
    <div className="planning-expense-page-container">
      <h2>Budget History</h2>

      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        Back
      </button>

      {budgets.length > 0 ? (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Total</th>
              <th>Food</th>
              <th>Rent</th>
              <th>Transport</th>
              <th>Entertainment</th>
              <th>Savings</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr key={b.id}>
                <td>{b.total_amount}</td>
                <td>{b.food}</td>
                <td>{b.rent}</td>
                <td>{b.transport}</td>
                <td>{b.entertainment}</td>
                <td>{b.savings}</td>
                <td>{b.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No budget plans yet.</p>
      )}
    </div>
  );
}

export default BudgetHistory;
