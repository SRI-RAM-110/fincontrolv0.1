// src/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// CORS
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
app.use(cors({ origin: CLIENT_ORIGIN }));

/* ---------------- Routes ---------------- */

// Auth
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Transactions
const txnRoutes = require("./routes/transaction");
app.use("/api/transactions", txnRoutes);

// Budgets
const budgetsRoutes = require("./routes/budgets");
app.use("/api/budgets", budgetsRoutes);

// Fixed Expenses (EMI, Rent)
const fixedExpensesRoutes = require("./routes/fixedExpenses");
app.use("/api/fixed-expenses", fixedExpensesRoutes);

// Health check
app.get("/", (req, res) => res.json({ ok: true }));

/* ---------------- MongoDB ---------------- */

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME || "fincontrol";
const DB_HOST = process.env.MONGODB_HOST;

if (!DB_USER || !DB_PASS || !DB_HOST) {
  console.error("Missing DB config in .env");
  process.exit(1);
}

const encodedPass = encodeURIComponent(DB_PASS);
const MONGODB_URI = `mongodb+srv://${DB_USER}:${encodedPass}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 5000;

// Connect and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
