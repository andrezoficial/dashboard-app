import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, logout } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwt_decode(token);
    const now = Date.now().valueOf() / 1000;

    if (decoded.exp && decoded.exp < now) {
      // Token expirado, hacer logout y redirigir
      logout();
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    // Token inválido, hacer logout y redirigir
    logout();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
