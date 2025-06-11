import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import UsuariosPage from "./pages/UsuariosPage";
import ConfiguracionPage from "./pages/ConfiguracionPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirección desde la raíz */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas dentro del layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
        </Route>

        {/* Ruta para no encontrados */}
        <Route path="*" element={<div className="p-6 text-red-500">Página no encontrada</div>} />
      </Routes>
    </Router>
  );
}
