const mongoose = require("mongoose");

const FixedExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("FixedExpense", FixedExpenseSchema);
