import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Services from "./Services";
import About from "./About";
import Contact from "./Contact";
import Profile from "./Profile";
import AddExpense from "./Addexpense";
import ExpenseHistory from "./ExpenseHistory";
import BudgetPlanning from "./BudgetPlanning";
import ProtectedRoute from "./ProtectedRoute";
import BudgetHistory from "./BudgetHistory";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-expense"
          element={
            <ProtectedRoute>
              <AddExpense />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expense-history"
          element={
            <ProtectedRoute>
              <ExpenseHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budget-planning"
          element={
            <ProtectedRoute>
              <BudgetPlanning />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budget-history"
          element={
            <ProtectedRoute>
              <BudgetHistory />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
