import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserForm from "../components/UserForm";

const API_URL = "https://backend-dashboard-v2.onrender.com/api";
const roles = ["Todos", "Administrador", "Editor", "Lector"];
const pageSize = 3;

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [formVisible, setFormVisible] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/usuarios`);
        setUsuarios(res.data);
        setError(null);
      } catch (err) {
        setError("Error al cargar usuarios");
        toast.error("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const cumpleBusqueda = `${usuario.nombre} ${usuario.email} ${usuario.rol}`
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const cumpleFiltroRol = filtroRol === "Todos" ? true : usuario.rol === filtroRol;
    return cumpleBusqueda && cumpleFiltroRol;
  });

  const totalPages = Math.ceil(usuariosFiltrados.length / pageSize);
  const usuariosVisibles = usuariosFiltrados.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleFiltroRol = (rol) => {
    setFiltroRol(rol);
    setCurrentPage(1);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await axios.delete(`${API_URL}/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u._id !== id));
      toast.success("Usuario eliminado correctamente");
    } catch {
      toast.error("Error eliminando usuario");
    }
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setFormVisible(true);
  };

  const handleNuevoUsuario = () => {
    setUsuarioEditando(null);
    setFormVisible(true);
  };

  const handleGuardarUsuario = async (usuarioData) => {
    try {
      if (usuarioEditando) {
        const res = await axios.put(
          `${API_URL}/usuarios/${usuarioEditando._id}`,
          usuarioData
        );
        setUsuarios((prev) =>
          prev.map((u) => (u._id === usuarioEditando._id ? res.data : u))
        );
        toast.success("Usuario actualizado correctamente");
      } else {
        const res = await axios.post(`${API_URL}/usuarios`, usuarioData);
        setUsuarios((prev) => [...prev, res.data]);
        toast.success("Usuario creado exitosamente");
      }
      setFormVisible(false);
      setUsuarioEditando(null);
    } catch {
      toast.error("Error guardando usuario");
    }
  };

  const handleCancelar = () => {
    setFormVisible(false);
    setUsuarioEditando(null);
  };

  if (loading) return <p className="p-6">Cargando usuarios...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="w-full max-w-screen-lg mx-auto p-4 bg-white rounded shadow">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Usuarios Registrados</h1>

      {!formVisible && (
        <button
          onClick={handleNuevoUsuario}
          className="mb-4 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 block sm:inline-block"
        >
          Nuevo Usuario
        </button>
      )}

      {formVisible && (
        <div className="mb-6 border border-gray-300 rounded p-4 bg-gray-50">
          <UserForm
            usuarioEditando={usuarioEditando}
            onSubmit={handleGuardarUsuario}
            onCancel={handleCancelar}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre, correo o rol..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setCurrentPage(1);
          }}
          disabled={formVisible}
        />

        <div className="flex flex-wrap gap-2">
          {roles.map((rol) => (
            <button
              key={rol}
              className={`px-3 py-1 rounded border transition whitespace-nowrap ${
                filtroRol === rol
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => handleFiltroRol(rol)}
              disabled={formVisible}
            >
              {rol}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas para móviles */}
      <div className="grid gap-4 sm:hidden">
        {usuariosVisibles.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No se encontraron resultados.
          </p>
        ) : (
          usuariosVisibles.map((usuario) => (
            <div
              key={usuario._id}
              className="bg-white border rounded p-4 shadow flex flex-col gap-1"
            >
              <h2 className="text-lg font-semibold text-blue-700">
                {usuario.nombre}
              </h2>
              <p>
                <strong>Correo:</strong> {usuario.email}
              </p>
              <p>
                <strong>Rol:</strong> {usuario.rol}
              </p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleEditarUsuario(usuario)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(usuario._id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tabla para escritorio */}
      <div className="hidden sm:block overflow-x-auto rounded border bg-white">
        <table className="w-full min-w-[600px] divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Correo</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Rol</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {usuariosVisibles.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              usuariosVisibles.map((usuario) => (
                <tr key={usuario._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{usuario.nombre}</td>
                  <td className="px-4 py-2 text-gray-600">{usuario.email}</td>
                  <td className="px-4 py-2 text-gray-600">{usuario.rol}</td>
                  <td className="px-4 py-2 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEditarUsuario(usuario)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(usuario._id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
        <button
          disabled={currentPage === 1 || formVisible}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0 || formVisible}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
