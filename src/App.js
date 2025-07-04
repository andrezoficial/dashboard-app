import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import UsuariosPage from "./pages/UsuariosPage";
import Pacientes from "./pages/Pacientes";
import Citas from "./pages/Citas";
import ConfiguracionPage from "./pages/ConfiguracionPage";
import ChatPage from "./pages/ChatPage";
import ResetPasswordPage from "./pages/ResetPasswordPage"; // <-- Importaste esta
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />

        {/* Ruta pública para resetear contraseña */}
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route
            path="usuarios"
            element={
              <AdminRoute>
                <UsuariosPage />
              </AdminRoute>
            }
          />

          <Route path="pacientes" element={<Pacientes />} />
          <Route path="citas" element={<AdminRoute><Citas /></AdminRoute>} />
          <Route path="configuracion" element={<AdminRoute><ConfiguracionPage /></AdminRoute>} />
          <Route path="chat" element={<ChatPage />} />

          <Route path="*" element={<div className="p-6 text-red-500">Página no encontrada</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
