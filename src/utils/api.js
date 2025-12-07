// src/utils/api.js
// Centralized API helper used across the app

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem("fincontrol_session") || "null");
  } catch {
    return null;
  }
}

function getAuthHeaders() {
  const session = getSession();
  const token = session?.token;
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export default async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const config = {
    method: options.method || "GET",
    headers: Object.assign({}, getAuthHeaders(), options.headers || {}),
  };

  // allow FormData passthrough
  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  } else if (options.body instanceof FormData) {
    // remove JSON header for FormData
    delete config.headers["Content-Type"];
    config.body = options.body;
  }

  const res = await fetch(url, config);

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || res.statusText || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    err.response = data;
    throw err;
  }

  return data;
}

export { getAuthHeaders };
