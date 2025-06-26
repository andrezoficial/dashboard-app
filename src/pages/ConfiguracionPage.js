import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

const API_URL = "https://backend-dashboard-v2.onrender.com/api/configuracion";
const token = localStorage.getItem("token");
const decoded = jwtDecode(token);
let usuarioId = null;
if (token) {
  const decoded = jwt_decode(token);
  usuarioId = decoded.id; // o decoded._id, revisa tu payload
}

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("perfil");

  // Estados perfil (si quieres puedes cargarlos desde backend en useEffect)
  const [nombre, setNombre] = useState("Admin");
  const [email, setEmail] = useState("admin@admin.com");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [temaOscuro, setTemaOscuro] = useState(false);
  const [notificaciones, setNotificaciones] = useState(true);
  const [role, setRole] = useState("Admin");

  // Aquí debes obtener el usuarioId de alguna forma, por ejemplo del token
  // Supongamos que tienes una función para decodificarlo o guardarlo en localStorage
  const usuarioId = localStorage.getItem("usuarioId"); // Ajusta según tu implementación

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Cargar configuración inicial del backend
  useEffect(() => {
    if (!usuarioId) return;
    axios
      .get(`${API_URL}/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const configData = res.data;
        setTemaOscuro(configData.temaOscuro ?? false);
        setNotificaciones(configData.notificaciones ?? true);
        setRole(configData.rolSeleccionado || "Admin");
      })
      .catch((err) => {
        console.error("Error al cargar configuración", err);
      });
  }, []);

  const handleSaveConfiguracion = async (e) => {
    e.preventDefault();
    if (!usuarioId) {
      alert("No se encontró usuario. Por favor inicia sesión.");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/${usuarioId}`,
        {
          temaOscuro,
          notificaciones,
          rolSeleccionado: role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Configuración guardada correctamente");
    } catch (error) {
      alert("Error al guardar configuración");
      console.error(error.response?.data || error.message);
    }
  };

  // Para cambiar contraseña puedes usar otra ruta si la tienes en backend
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/password`, // Asumo que tienes esta ruta en backend
        {
          passwordActual: currentPassword,
          nuevaPassword: newPassword,
        },
        config
      );
      alert("Contraseña cambiada correctamente");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("Error al cambiar la contraseña");
      console.error(err.response?.data || err.message);
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
        <form
          onSubmit={handleSaveConfiguracion}
          className="space-y-4"
          // Aquí puedes separar la actualización de perfil si tienes ruta dedicada
        >
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
        <form onSubmit={handleSaveConfiguracion} className="space-y-4 max-w-md">
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
        <form onSubmit={handleSaveConfiguracion} className="space-y-4 max-w-sm">
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
