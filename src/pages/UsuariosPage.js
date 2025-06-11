import React, { useState, useEffect } from "react";
import axios from "axios";

const roles = ["Todos", "Administrador", "Editor", "Lector"];
const pageSize = 3;

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");

  // Cargar usuarios desde API
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/usuarios");
        setUsuarios(res.data);
        setError(null);
      } catch (err) {
        setError("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  // Filtrar y buscar usuarios
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const cumpleBusqueda =
      `${usuario.nombre} ${usuario.correo} ${usuario.rol}`
        .toLowerCase()
        .includes(busqueda.toLowerCase());
    const cumpleFiltroRol = filtroRol === "Todos" ? true : usuario.rol === filtroRol;
    return cumpleBusqueda && cumpleFiltroRol;
  });

  // Paginación
  const totalPages = Math.ceil(usuariosFiltrados.length / pageSize);
  const usuariosVisibles = usuariosFiltrados.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Manejar filtro de rol
  const handleFiltroRol = (rol) => {
    setFiltroRol(rol);
    setCurrentPage(1);
  };

  // Eliminar usuario
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await axios.delete(`http://localhost:4000/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Error eliminando usuario");
    }
  };

  if (loading) return <p className="p-6">Cargando usuarios...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Usuarios Registrados</h1>

      {/* Filtros */}
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
        />

        <div className="flex gap-2">
          {roles.map((rol) => (
            <button
              key={rol}
              className={`px-3 py-1 rounded border transition ${
                filtroRol === rol
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => handleFiltroRol(rol)}
            >
              {rol}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Correo</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Rol</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {usuariosVisibles.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              usuariosVisibles.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800">{usuario.nombre}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{usuario.correo}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{usuario.rol}</td>
                  <td className="px-4 py-2 text-sm text-right space-x-2">
                    <button className="text-blue-600 hover:underline text-sm">Editar</button>
                    <button
                      onClick={() => handleEliminar(usuario.id)}
                      className="text-red-600 hover:underline text-sm"
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

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
