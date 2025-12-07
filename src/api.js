// src/utils/api.js

// Base URL for backend
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

/* -------------------------
   SESSION HELPERS
-------------------------- */

// Read session from localStorage
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem("fincontrol_session") || "null");
  } catch {
    return null;
  }
}

// Get Authorization header
function getAuthHeaders() {
  const session = getSession();
  const token = session?.token;

  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

/* -------------------------
   UNIVERSAL API FETCH
-------------------------- */

export default async function apiFetch(endpoint, options = {}) {
  const config = {
    method: options.method || "GET",
    headers: getAuthHeaders(),
  };

  // Add request body only when needed
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const url = `${API_BASE}${endpoint}`;

  const res = await fetch(url, config);

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || "API request failed");
  }

  return data;
}

/* -------------------------
   AUTH API
-------------------------- */

export async function registerUser(userData) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: userData,
  });
}

export async function loginUser(credentials) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
}

/* -------------------------
   TRANSACTIONS (Expenses)
-------------------------- */

// Get all transactions
export async function getTransactions() {
  return apiFetch("/api/transactions", { method: "GET" });
}

// Add a new transaction
export async function addTransaction(data) {
  return apiFetch("/api/transactions", {
    method: "POST",
    body: data,
  });
}

// Update transaction
export async function updateTransaction(id, data) {
  return apiFetch(`/api/transactions/${id}`, {
    method: "PUT",
    body: data,
  });
}

// Delete transaction
export async function deleteTransaction(id) {
  return apiFetch(`/api/transactions/${id}`, {
    method: "DELETE",
  });
}

/* -------------------------
   BUDGET API
-------------------------- */

export async function getBudgets() {
  return apiFetch("/api/budgets", { method: "GET" });
}

export async function addBudget(data) {
  return apiFetch("/api/budgets", {
    method: "POST",
    body: data,
  });
}

export async function updateBudget(id, data) {
  return apiFetch(`/api/budgets/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteBudget(id) {
  return apiFetch(`/api/budgets/${id}`, {
    method: "DELETE",
  });
}
