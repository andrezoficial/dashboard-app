import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://backend-dashboard-v2.onrender.com/api";

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    paciente: "",
    fecha: "",
    motivo: "",
  });
  const [editId, setEditId] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchCitas();
    fetchPacientes();
  }, []);

  const fetchCitas = async () => {
    try {
      const res = await axios.get(`${API_URL}/citas`);
      setCitas(res.data);
    } catch {
      alert("Error cargando citas");
    }
  };

  const fetchPacientes = async () => {
    try {
      const res = await axios.get(`${API_URL}/pacientes`);
      setPacientes(res.data);
    } catch {
      alert("Error cargando pacientes");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/citas/${editId}`, form);
        alert("Cita actualizada");
      } else {
        await axios.post(`${API_URL}/citas`, form);
        alert("Cita creada");
      }
      setForm({ paciente: "", fecha: "", motivo: "" });
      setEditId(null);
      fetchCitas();
    } catch {
      alert("Error guardando cita");
    }
  };

  const handleEdit = (cita) => {
    setForm({
      paciente: cita.paciente?._id || cita.paciente || "",
      fecha: cita.fecha ? cita.fecha.split("T")[0] : "",
      motivo: cita.motivo || "",
    });
    setEditId(cita._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta cita?")) {
      try {
        await axios.delete(`${API_URL}/citas/${id}`);
        alert("Cita eliminada");
        fetchCitas();
      } catch {
        alert("Error eliminando cita");
      }
    }
  };

 const citasFiltradas = citas.filter((cita) => {
  const nombrePaciente = cita.paciente?.nombreCompleto || "";
  const fecha = cita.fecha || "";
  return (
    nombrePaciente.toLowerCase().includes(filtro.toLowerCase()) ||
    fecha.includes(filtro)
  );
});

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Citas Médicas</h1>

      <input
        type="text"
        placeholder="Filtrar por paciente o fecha"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Paciente</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Motivo</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citasFiltradas.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No hay citas
              </td>
            </tr>
          )}
          {citasFiltradas.map((cita) => (
            <tr key={cita._id}>
              <td className="border p-2">
                {cita.paciente?.nombreCompleto || "Paciente no asignado"}
              </td>
              <td className="border p-2">{cita.fecha ? cita.fecha.split("T")[0] : ""}</td>
              <td className="border p-2">{cita.motivo}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(cita)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cita._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-semibold">
          {editId ? "Editar Cita" : "Nueva Cita"}
        </h2>

        <select
          name="paciente"
          value={form.paciente}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        >
          <option value="">Selecciona un paciente</option>
          {pacientes.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nombreCompleto}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="motivo"
          placeholder="Motivo de la cita"
          value={form.motivo}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />

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
              setForm({ paciente: "", fecha: "", motivo: "" });
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
