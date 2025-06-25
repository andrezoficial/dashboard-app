import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://citas-api-91vc.onrender.com"; // Cambia a tu URL real

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [form, setForm] = useState({
    paciente: "",
    fecha: "",
    hora: "",
    estado: "Pendiente",
  });
  const [editId, setEditId] = useState(null);
  const [filtro, setFiltro] = useState("");

  // Cargar citas al inicio
  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    try {
      const res = await axios.get(API_URL);
      setCitas(res.data);
    } catch (error) {
      alert("Error cargando citas");
    }
  };

  // Manejar cambios en formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear o actualizar cita
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Editar
        await axios.put(`${API_URL}/${editId}`, form);
        alert("Cita actualizada");
      } else {
        // Crear
        await axios.post(API_URL, form);
        alert("Cita creada");
      }
      setForm({ paciente: "", fecha: "", hora: "", estado: "Pendiente" });
      setEditId(null);
      fetchCitas();
    } catch (error) {
      alert("Error guardando cita");
    }
  };

  // Cargar datos para editar
  const handleEdit = (cita) => {
    setForm({
      paciente: cita.paciente,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado,
    });
    setEditId(cita.id);
  };

  // Eliminar cita
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta cita?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("Cita eliminada");
        fetchCitas();
      } catch (error) {
        alert("Error eliminando cita");
      }
    }
  };

  // Filtrar citas por paciente o fecha
  const citasFiltradas = citas.filter(
    (cita) =>
      cita.paciente.toLowerCase().includes(filtro.toLowerCase()) ||
      cita.fecha.includes(filtro)
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Citas Médicas</h1>

      <input
        type="text"
        placeholder="Filtrar por paciente o fecha (YYYY-MM-DD)"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Paciente</th>
            <th className="border border-gray-300 p-2">Fecha</th>
            <th className="border border-gray-300 p-2">Hora</th>
            <th className="border border-gray-300 p-2">Estado</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citasFiltradas.map((cita) => (
            <tr key={cita.id}>
              <td className="border border-gray-300 p-2">{cita.paciente}</td>
              <td className="border border-gray-300 p-2">{cita.fecha}</td>
              <td className="border border-gray-300 p-2">{cita.hora}</td>
              <td className="border border-gray-300 p-2">{cita.estado}</td>
              <td className="border border-gray-300 p-2 space-x-2">
                <button
                  onClick={() => handleEdit(cita)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cita.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
          {citasFiltradas.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No hay citas
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-semibold">
          {editId ? "Editar Cita" : "Nueva Cita"}
        </h2>
        <input
          type="text"
          name="paciente"
          placeholder="Paciente"
          value={form.paciente}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="time"
          name="hora"
          value={form.hora}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Confirmada">Confirmada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Actualizar" : "Crear"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ paciente: "", fecha: "", hora: "", estado: "Pendiente" });
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar edición
          </button>
        )}
      </form>
    </div>
  );
}
