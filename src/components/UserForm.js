import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const roles = ["Administrador", "Editor", "Lector"];

export default function UserForm({ onSubmit, onCancel, usuarioEditando }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState(roles[0]);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (usuarioEditando) {
      setNombre(usuarioEditando.nombre || "");
      setCorreo(usuarioEditando.email || "");
      setRol(usuarioEditando.rol || roles[0]);
      setPassword("");
    } else {
      setNombre("");
      setCorreo("");
      setRol(roles[0]);
      setPassword("");
    }
  }, [usuarioEditando]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !correo.trim()) {
      toast.error("Nombre y correo son obligatorios");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(correo)) {
      toast.error("Correo no es válido");
      return;
    }

    if (!usuarioEditando && !password) {
      toast.error("La contraseña es obligatoria para un nuevo usuario");
      return;
    }

    const usuarioData = usuarioEditando
      ? {
          ...usuarioEditando,
          nombre,
          email: correo,
          rol,
          ...(password ? { password } : {}),
        }
      : { nombre, email: correo, rol, password };

    onSubmit(usuarioData);
    toast.success(usuarioEditando ? "Usuario actualizado" : "Usuario creado");

    if (!usuarioEditando) {
      setNombre("");
      setCorreo("");
      setRol(roles[0]);
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {usuarioEditando ? "Editar Usuario" : "Nuevo Usuario"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre completo"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1" htmlFor="correo">
            Correo
          </label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1" htmlFor="rol">
            Rol
          </label>
          <select
            id="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1" htmlFor="password">
            {usuarioEditando ? "Nueva contraseña (opcional)" : "Contraseña"}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={usuarioEditando ? "Déjalo vacío para no cambiar" : ""}
            {...(!usuarioEditando && { required: true })}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {usuarioEditando ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
