// src/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

// CORS - allow your React dev origin (configure via .env)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: CLIENT_ORIGIN }));

// Mount auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Mount transactions route (your file is routes/transaction.js)
const txnRoutes = require('./routes/transaction');
app.use('/api/transactions', txnRoutes);

const budgetsRoutes = require('./routes/budgets');
app.use('/api/budgets', budgetsRoutes);

// Optional: try to mount budgets route if you add it later (no crash if missing)
try {
  const budgetsRoutes = require('./routes/budgets');
  app.use('/api/budgets', budgetsRoutes);
} catch (err) {
  // budgets route not present yet — ignore silently
}

// Simple health-check route
app.get('/', (req, res) => res.json({ ok: true }));

// Build MongoDB Atlas URI safely (encodes password)
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME || 'fincontrol';
const DB_HOST = process.env.MONGODB_HOST;

if (!DB_USER || !DB_PASS || !DB_HOST) {
  console.error('Missing DB config in .env (DB_USER, DB_PASS, MONGODB_HOST)');
  process.exit(1);
}

const encodedPass = encodeURIComponent(DB_PASS);
const MONGODB_URI = `mongodb+srv://${DB_USER}:${encodedPass}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
