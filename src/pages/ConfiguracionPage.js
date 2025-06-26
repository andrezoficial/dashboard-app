import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://backend-dashboard-v2.onrender.com/api/configuracion";
const token = localStorage.getItem("token");

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("perfil");

  const [nombre, setNombre] = useState("Admin");
  const [email, setEmail] = useState("admin@admin.com");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [temaOscuro, setTemaOscuro] = useState(false);
  const [notificaciones, setNotificaciones] = useState(true);

  const [role, setRole] = useState("Admin");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleSavePerfil = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/perfil`, { nombre, email }, config);
      alert("Perfil actualizado correctamente");
    } catch (err) {
      alert("Error al actualizar el perfil");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    try {
      await axios.put(`${API_URL}/password`, {
        passwordActual: currentPassword,
        nuevaPassword: newPassword,
      }, config);
      alert("Contraseña cambiada correctamente");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("Error al cambiar la contraseña");
    }
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/preferencias`, {
        temaOscuro,
        notificaciones,
      }, config);
      alert("Preferencias guardadas correctamente");
    } catch (err) {
      alert("Error al guardar preferencias");
    }
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/rol`, { rol: role }, config);
      alert("Rol actualizado correctamente");
    } catch (err) {
      alert("Error al actualizar rol");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Configuración</h2>

      <nav className="mb-6 border-b border-gray-200">
        <ul className="flex space-x-4">
          {["perfil", "password", "general", "roles"].map((tab) => (
            <li key={tab}>
              <button
                className={`py-2 px-4 border-b-2 ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent hover:text-blue-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "perfil"
                  ? "Perfil"
                  : tab === "password"
                  ? "Cambiar Contraseña"
                  : tab === "general"
                  ? "General"
                  : "Roles y Permisos"}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {activeTab === "perfil" && (
        <form onSubmit={handleSavePerfil} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar Perfil
          </button>
        </form>
      )}

      {activeTab === "password" && (
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1 font-medium">Contraseña actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Cambiar Contraseña
          </button>
        </form>
      )}

      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="space-y-4 max-w-md">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="temaOscuro"
              checked={temaOscuro}
              onChange={() => setTemaOscuro(!temaOscuro)}
              className="w-5 h-5"
            />
            <label htmlFor="temaOscuro" className="font-medium">
              Activar tema oscuro
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="notificaciones"
              checked={notificaciones}
              onChange={() => setNotificaciones(!notificaciones)}
              className="w-5 h-5"
            />
            <label htmlFor="notificaciones" className="font-medium">
              Recibir notificaciones
            </label>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar Configuración
          </button>
        </form>
      )}

      {activeTab === "roles" && (
        <form onSubmit={handleSaveRole} className="space-y-4 max-w-sm">
          <label className="block mb-1 font-medium">Seleccionar rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar Rol
          </button>
        </form>
      )}
    </div>
  );
}
