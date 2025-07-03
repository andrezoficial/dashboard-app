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

  // Datos perfil
  const [nombre, setNombre] = useState("Admin");
  const [email, setEmail] = useState("admin@admin.com");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Configuraciones generales
  const [temaOscuro, setTemaOscuro] = useState(() => {
    // Intenta cargar la preferencia guardada localmente
    return localStorage.getItem("temaOscuro") === "true";
  });
  const [notificaciones, setNotificaciones] = useState(true);

  // Rol
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
        setNombre(data.nombre || "Admin");
        setEmail(data.email || "admin@admin.com");
      })
      .catch((err) => console.error("Error al cargar configuración", err));
  }, []);

  // Aplicar modo oscuro en <body>
  useEffect(() => {
    if (temaOscuro) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Guardar en localStorage
    localStorage.setItem("temaOscuro", temaOscuro.toString());
  }, [temaOscuro]);

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

  // Clases para contenedor principal, cambia según tema
  const containerClasses =
    "w-full max-w-3xl mx-auto p-4 transition-colors duration-300 " +
    (temaOscuro
      ? "bg-gray-900 text-gray-100"
      : "bg-white text-gray-900");

  const tabClasses = (tab) =>
    `px-4 py-2 whitespace-nowrap border-b-2 cursor-pointer ${
      activeTab === tab
        ? "border-blue-500 text-blue-500 font-semibold"
        : temaOscuro
        ? "border-transparent text-gray-400 hover:text-blue-400"
        : "border-transparent text-gray-600 hover:text-blue-600"
    }`;

  const inputClasses =
    "w-full p-2 border rounded " +
    (temaOscuro
      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-600");

  const buttonClasses =
    "w-full sm:w-auto px-4 py-2 rounded text-white hover:bg-blue-700 transition-colors duration-200 " +
    (temaOscuro ? "bg-blue-600" : "bg-blue-600");

  const labelClasses = "block font-semibold mb-1";

  return (
    <div className={containerClasses}>
      <h2 className="text-2xl font-bold mb-6">Configuración</h2>

      <nav className="mb-6 border-b border-gray-300 dark:border-gray-700 overflow-x-auto">
        <ul className="flex gap-2 text-sm sm:text-base">
          {["perfil", "password", "general", "roles"].map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={tabClasses(tab)}
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
        <form onSubmit={handleSaveConfiguracion} className="space-y-4">
          <div>
            <label className={labelClasses}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              required
            />
          </div>
          <button type="submit" className={buttonClasses}>
            Guardar Perfil
          </button>
        </form>
      )}

      {activeTab === "password" && (
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className={labelClasses}>Contraseña Actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Nueva Contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClasses}
              required
            />
          </div>
          <button type="submit" className={buttonClasses}>
            Cambiar Contraseña
          </button>
        </form>
      )}

      {activeTab === "general" && (
        <form onSubmit={handleSaveConfiguracion} className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="temaOscuro"
              checked={temaOscuro}
              onChange={() => setTemaOscuro(!temaOscuro)}
              className="w-5 h-5 cursor-pointer"
            />
            <label htmlFor="temaOscuro" className="font-medium select-none cursor-pointer">
              Tema Oscuro
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="notificaciones"
              checked={notificaciones}
              onChange={() => setNotificaciones(!notificaciones)}
              className="w-5 h-5 cursor-pointer"
            />
            <label htmlFor="notificaciones" className="font-medium select-none cursor-pointer">
              Recibir Notificaciones
            </label>
          </div>
          <button type="submit" className={buttonClasses}>
            Guardar Preferencias
          </button>
        </form>
      )}

      {activeTab === "roles" && (
        <form onSubmit={handleSaveConfiguracion} className="space-y-4 max-w-xs">
          <label className={labelClasses}>Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClasses}
          >
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
          <button type="submit" className={buttonClasses}>
            Guardar Rol
          </button>
        </form>
      )}
    </div>
  );
}
