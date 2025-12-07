// src/routes/transactions.js
const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const router = express.Router();

// GET /api/transactions  -> list user's transactions
router.get('/', auth, async (req, res) => {
  try {
    const txns = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(txns);
  } catch (err) {
    console.error('Get transactions error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/transactions  -> create transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;
    if (!type || typeof amount === 'undefined') return res.status(400).json({ error: 'Missing fields' });

    const txn = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      note,
      date: date || Date.now()
    });

    res.status(201).json(txn);
  } catch (err) {
    console.error('Create transaction error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/transactions/:id  -> update
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('Update txn error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/transactions/:id  -> delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete txn error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
