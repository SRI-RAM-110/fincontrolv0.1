// backend/src/routes/budgets.js
const express = require("express");
const auth = require("../middleware/auth");
const Budget = require("../models/Budget");

const router = express.Router(); // ✅ THIS WAS MISSING

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
    const { month, totalAmount, categories } = req.body;

    if (!month || !totalAmount || !Array.isArray(categories)) {
      return res.status(400).json({
        error: "Month, totalAmount, and categories are required"
      });
    }

    const fixedTotal = categories
      .filter(cat => cat.fixed === true)
      .reduce((sum, cat) => sum + Number(cat.amount || 0), 0);

    if (fixedTotal > totalAmount) {
      return res.status(400).json({
        error: "Fixed category amounts exceed total budget"
      });
    }

    const budget = await Budget.create({
      user: req.user.id,
      month,
      totalAmount,
      categories,
      remainingAmount: totalAmount - fixedTotal
    });

    return res.status(201).json(budget);
  } catch (err) {
    console.error("POST budget error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
