import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
import FormularioHistoriaClinica from "./pages/historia-clinica/FormularioHistoriaClinica";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import VerHistoriaClinica from "./pages/historia-clinica/VerHistoriaClinica";

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

        {/* Recuperar contraseña */}
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Área privada con dashboard y rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />

          <Route
            path="usuarios"
            element={
              <AdminRoute>
                <UsuariosPage />
              </AdminRoute>
            }
          />

          <Route path="pacientes" element={<Pacientes />} />

          <Route
  path="pacientes/:id/historia-clinica/ver"
  element={<VerHistoriaClinica />}
/>

          <Route
            path="citas"
            element={
              <AdminRoute>
                <Citas />
              </AdminRoute>
            }
          />

          <Route
            path="configuracion"
            element={
              <AdminRoute>
                <ConfiguracionPage />
              </AdminRoute>
            }
          />

          <Route path="chat" element={<ChatPage />} />
        </Route>

        {/* Ruta fallback: redirige a landing si no existe la ruta */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

