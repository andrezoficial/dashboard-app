import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try {
    const user = jwt_decode(token);
    return children;
  } catch {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
