// backend/src/models/Budget.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  fixed: {
    type: Boolean,
    default: false
  }
});

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  month: {
    type: String,
    required: true // format: YYYY-MM
  },

  totalAmount: {
    type: Number,
    required: true
  },

  categories: {
    type: [CategorySchema],
    default: []
  },

  remainingAmount: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Budget", BudgetSchema);
