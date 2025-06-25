import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== "Administrador") {
    return (
      <div className="p-6 text-red-500">
        Acceso denegado: necesitas permisos de administrador.
      </div>
    );
  }

  return children;
}
