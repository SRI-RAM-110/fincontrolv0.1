import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import "./Styles.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);


ChartJS.register(ArcElement, Tooltip, Legend);

function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    const fetchExpenses = async () => {
      const session = JSON.parse(
        localStorage.getItem("fincontrol_session") || "null"
      );
      const token = session?.token;

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const API_BASE =
          process.env.REACT_APP_API_BASE || "http://localhost:5000";

        const res = await fetch(`${API_BASE}/api/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setExpenses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Analytics error:", err);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // ---------- FILTER BY MONTH ----------
  const filteredExpenses = useMemo(() => {
    if (selectedMonth === "all") return expenses;

    return expenses.filter((e) => {
      if (!e.date) return false;
      const month = new Date(e.date).toISOString().slice(0, 7);
      return month === selectedMonth;
    });
  }, [expenses, selectedMonth]);

  // ---------- CALCULATIONS ----------
  const totalSpent = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const categoryTotals = {};
  filteredExpenses.forEach((e) => {
    const cat = e.category || "other";
    categoryTotals[cat] =
      (categoryTotals[cat] || 0) + Number(e.amount || 0);
  });

  const topCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  // ---------- PIE CHART DATA ----------
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#4f46e5",
          "#22c55e",
          "#f97316",
          "#06b6d4",
          "#e11d48",
          "#a855f7",
        ],
        borderWidth: 1,
      },
    ],
  };
  const barData = {
  labels: Object.keys(categoryTotals),
  datasets: [
    {
      label: "Amount Spent (₹)",
      data: Object.values(categoryTotals),
      backgroundColor: "#3b82f6",
      borderRadius: 8,
    },
  ],
};


  // ---------- MONTH OPTIONS ----------
  const monthOptions = [
    ...new Set(
      expenses
        .filter((e) => e.date)
        .map((e) => new Date(e.date).toISOString().slice(0, 7))
    ),
  ];

  return (
    <div>
      <Header />

      <div className="analytics-container">
        <h1>Analytics</h1>
        <p className="analytics-subtitle">
          Understand your spending at a glance
        </p>

        {/* Month Filter */}
        <div className="analytics-filter">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Empty State */}
        {!loading && filteredExpenses.length === 0 && (
          <div className="empty-state">
            <h3>No expenses found</h3>
            <p>Add expenses to see analytics</p>
          </div>
        )}

        {/* Stats */}
        {!loading && filteredExpenses.length > 0 && (
          <>
            <div className="analytics-cards">
              <div className="analytics-card">
                <h3>Total Spent</h3>
                <p>₹ {totalSpent.toFixed(2)}</p>
              </div>

              <div className="analytics-card">
                <h3>Expenses</h3>
                <p>{filteredExpenses.length}</p>
              </div>

              <div className="analytics-card">
                <h3>Top Category</h3>
                <p>{topCategory}</p>
              </div>
            </div>

            {/* Chart */}
           <div className="charts-row">
  <div className="chart-box">
    <Pie
      data={pieData}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
      }}
    />
  </div>

  <div className="chart-box">
    <Bar
      data={barData}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `₹ ${value}`,
            },
          },
        },
      }}
    />
  </div>
</div>

            
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
