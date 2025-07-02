import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://backend-dashboard-v2.onrender.com/api/configuracion";
const token = localStorage.getItem("token");

let usuarioId = null;
if (token) {
  try {
    const decoded = jwtDecode(token);
    usuarioId = decoded.id || decoded._id;
  } catch {
    usuarioId = null;
  }
}

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

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!usuarioId) return;
    axios
      .get(`${API_URL}/${usuarioId}`, config)
      .then((res) => {
        const data = res.data;
        setTemaOscuro(data.temaOscuro ?? false);
        setNotificaciones(data.notificaciones ?? true);
        setRole(data.rolSeleccionado || "Admin");
      })
      .catch((err) => console.error("Error al cargar configuración", err));
  }, []);

  const handleSaveConfiguracion = async (e) => {
    e.preventDefault();
    if (!usuarioId) return alert("No se encontró usuario.");
    try {
      await axios.post(
        `${API_URL}/${usuarioId}`,
        { temaOscuro, notificaciones, rolSeleccionado: role, nombre, email },
        config
      );
      alert("Configuración guardada");
    } catch (error) {
      alert("Error al guardar configuración");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return alert("Las contraseñas no coinciden");
    try {
      await axios.put(
        `${API_URL}/password`,
        { passwordActual: currentPassword, nuevaPassword: newPassword },
        config
      );
      alert("Contraseña cambiada");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("Error al cambiar contraseña");
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 bg-white rounded shadow text-sm sm:text-base">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Configuración</h2>

      <nav className="mb-6 border-b border-gray-200 overflow-x-auto">
        <ul className="flex space-x-4 text-sm sm:text-base">
          {["perfil", "password", "general", "roles"].map((tab) => (
            <li key={tab}>
              <button
                className={`py-2 px-4 whitespace-nowrap border-b-2 ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent hover:text-blue-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "perfil"
                  ? "Perfil"
                  : tab === "password"
                  ? "Contraseña"
                  : tab === "general"
                  ? "General"
                  : "Roles"}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {activeTab === "perfil" && (
        <form onSubmit={handleSaveConfiguracion} className="space-y-4 max-w-full sm:max-w-md">
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
            <label className="block mb-1 font-medium">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Guardar Perfil
          </button>
        </form>
      )}

      {activeTab === "password" && (
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-full sm:max-w-md">
          <div>
            <label className="block mb-1 font-medium">Actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Nueva</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirmar</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Cambiar Contraseña
          </button>
        </form>
      )}

      {activeTab === "general" && (
        <form onSubmit={handleSaveConfiguracion} className="space-y-4 max-w-full sm:max-w-md">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="temaOscuro"
              checked={temaOscuro}
              onChange={() => setTemaOscuro(!temaOscuro)}
              className="w-5 h-5"
            />
            <label htmlFor="temaOscuro" className="font-medium select-none">
              Tema oscuro
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
            <label htmlFor="notificaciones" className="font-medium select-none">
              Recibir notificaciones
            </label>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Guardar
          </button>
        </form>
      )}

      {activeTab === "roles" && (
        <form onSubmit={handleSaveConfiguracion} className="space-y-4 max-w-full sm:max-w-xs">
          <label className="block mb-1 font-medium">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Guardar Rol
          </button>
        </form>
      )}
    </div>
  );
}
