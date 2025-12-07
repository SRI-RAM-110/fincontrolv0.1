import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Read session
  const session = JSON.parse(localStorage.getItem("fincontrol_session") || "null");

  // If no session or no token → redirect to login
  if (!session || !session.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
