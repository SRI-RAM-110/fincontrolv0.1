const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const FixedExpense = require("../models/FixedExpense");

// GET fixed expenses for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    let expenses = await FixedExpense.find({ user: req.user.id });

    // Auto-create EMI & Rent if missing
    const defaults = ["EMI", "Rent"];

    for (const name of defaults) {
      if (!expenses.find(e => e.name === name)) {
        const created = await FixedExpense.create({
          user: req.user.id,
          name,
          amount: 0
        });
        expenses.push(created);
      }
    }

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE fixed expense amount
router.put("/:id", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const expense = await FixedExpense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { amount },
      { new: true }
    );

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
