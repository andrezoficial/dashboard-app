import React, { useState } from "react";

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("perfil");

  // Estado perfil
  const [nombre, setNombre] = useState("Admin");
  const [email, setEmail] = useState("admin@admin.com");

  // Estado contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estado configuraciones generales
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [notificaciones, setNotificaciones] = useState(true);

  // Estado roles (ejemplo simplificado)
  const [role, setRole] = useState("Admin"); // Puede ser Admin, Editor, Viewer

  // Guardar perfil
  const handleSavePerfil = (e) => {
    e.preventDefault();
    alert(`Datos de perfil guardados:\nNombre: ${nombre}\nEmail: ${email}`);
    // Aquí iría llamada a API para guardar
  };

  // Cambiar contraseña
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    alert("Contraseña cambiada correctamente");
    // Aquí llamada API para cambiar contraseña
  };

  // Guardar configuración general
  const handleSaveGeneral = (e) => {
    e.preventDefault();
    alert(`Configuración guardada:\nTema oscuro: ${temaOscuro}\nNotificaciones: ${notificaciones}`);
    // Aquí llamada API para guardar configuración
  };

  // Guardar rol
  const handleSaveRole = (e) => {
    e.preventDefault();
    alert(`Rol actualizado a: ${role}`);
    // Aquí llamada API para actualizar rol
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Configuración</h2>

      {/* Pestañas */}
      <nav className="mb-6 border-b border-gray-200">
        <ul className="flex space-x-4">
          <li>
            <button
              className={`py-2 px-4 border-b-2 ${
                activeTab === "perfil"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("perfil")}
            >
              Perfil
            </button>
          </li>
          <li>
            <button
              className={`py-2 px-4 border-b-2 ${
                activeTab === "password"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("password")}
            >
              Cambiar Contraseña
            </button>
          </li>
          <li>
            <button
              className={`py-2 px-4 border-b-2 ${
                activeTab === "general"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
          </li>
          <li>
            <button
              className={`py-2 px-4 border-b-2 ${
                activeTab === "roles"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("roles")}
            >
              Roles y Permisos
            </button>
          </li>
        </ul>
      </nav>

      {/* Contenido pestañas */}
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
