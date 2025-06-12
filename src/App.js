import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import UsuariosPage from "./pages/UsuariosPage";
import Pacientes from "./pages/Pacientes";
import Citas from "./pages/Citas";
import ConfiguracionPage from "./pages/ConfiguracionPage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from "./context/AuthContext"; // ✅ importar contexto

export default function App() {
  const { isAuthenticated, login } = useContext(AuthContext); // usar contexto

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              // Pasamos la función login para que LoginPage pueda llamar al login en el contexto
              <LoginPage onLoginSuccess={login} />
            )
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="citas" element={<Citas />} />
          <Route path="*" element={<div className="p-6 text-red-500">Página no encontrada</div>} />
        </Route>

        {/* Catch all route for unauthenticated users */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
