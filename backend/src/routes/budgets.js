// backend/src/routes/budgets.js
const express = require("express");
const auth = require("../middleware/auth");
const Budget = require("../models/Budget");

const router = express.Router();

// GET /api/budgets -> all budgets for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(budgets);
  } catch (err) {
    console.error("GET budgets error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/budgets -> create a new budget
router.post("/", auth, async (req, res) => {
  try {
    const { month, amount } = req.body;

    if (!month || !amount) {
      return res.status(400).json({ error: "Month and amount are required" });
    }

    const budget = await Budget.create({
      user: req.user.id,
      month,
      amount,
    });

    return res.status(201).json(budget);
  } catch (err) {
    console.error("POST budget error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
