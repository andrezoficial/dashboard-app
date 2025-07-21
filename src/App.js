import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import UsuariosPage from "./pages/UsuariosPage";
import Pacientes from "./pages/Pacientes";
import Citas from "./pages/Citas";
import ConfiguracionPage from "./pages/ConfiguracionPage";
import ChatPage from "./pages/ChatPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerHistoriaClinica from "./pages/historia-clinica/VerHistoriaClinica";

import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  const { isAuthenticated } = useAuth();

  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem("tema") === "oscuro";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", modoOscuro);
    localStorage.setItem("tema", modoOscuro ? "oscuro" : "claro");
  }, [modoOscuro]);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Página pública */}
        <Route path="/" element={<LandingPage />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />

        {/* Recuperación de contraseña */}
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Rutas protegidas con layout de Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Inicio del dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Usuarios (solo admin) */}
          <Route
            path="usuarios"
            element={
              <AdminRoute>
                <UsuariosPage />
              </AdminRoute>
            }
          />

          {/* Pacientes */}
          <Route path="pacientes" element={<Pacientes />} />

          {/* Ver historia clínica */}
          <Route
            path="pacientes/:id/historia-clinica/ver"
            element={<VerHistoriaClinica />}
          />

          {/* Citas (solo admin) */}
          <Route
            path="citas"
            element={
              <AdminRoute>
                <Citas />
              </AdminRoute>
            }
          />

          {/* Configuración (solo admin) */}
          <Route
            path="configuracion"
            element={
              <AdminRoute>
                <ConfiguracionPage />
              </AdminRoute>
            }
          />

          {/* Chat */}
          <Route path="chat" element={<ChatPage />} />
        </Route>

        {/* Ruta por defecto si no coincide ninguna */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
