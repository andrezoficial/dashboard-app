import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext"; 

const API_URL = "https://backend-dashboard-v2.onrender.com/api";

export default function Citas() {
  const { darkMode } = useTheme(); // Obtiene el modo oscuro del contexto

  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    paciente: "",
    fecha: "",
    motivo: "",
    notificarWhatsApp: true,
    notificarSMS: true,
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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/citas/${editId}`, form);
        alert("Cita actualizada");
      } else {
        await axios.post(`${API_URL}/citas`, form);
        toast.success("Cita registrada y correo enviado al paciente");
      }
      setForm({
        paciente: "",
        fecha: "",
        motivo: "",
        notificarWhatsApp: true,
        notificarSMS: true,
      });
      setEditId(null);
      fetchCitas();
    } catch {
      alert("Error guardando cita");
    }
  };

  const handleEdit = (cita) => {
    let pacienteId = "";
    if (cita.paciente) {
      if (typeof cita.paciente === "object") {
        pacienteId = cita.paciente._id || "";
      } else if (typeof cita.paciente === "string") {
        pacienteId = cita.paciente;
      }
    }
    setForm({
      paciente: pacienteId,
      fecha: cita.fecha ? cita.fecha.split("T")[0] : "",
      motivo: cita.motivo || "",
      notificarWhatsApp: true,
      notificarSMS: true,
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
    const nombre = cita.paciente?.nombreCompleto?.toLowerCase() || "";
    const fecha = cita.fecha || "";
    return nombre.includes(filtro.toLowerCase()) || fecha.includes(filtro);
  });

  // Clases condicionales para modo oscuro/claro:
  const containerClasses = `max-w-4xl mx-auto p-4 ${
    darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
  }`;

  const inputClasses = `border p-2 w-full rounded ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-600"
  }`;

  const tableHeaderClasses = `border p-2 ${
    darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-900"
  }`;

  const tableCellClasses = `border p-2 ${
    darkMode ? "border-gray-700 text-gray-100" : "border-gray-300 text-gray-900"
  }`;

  const buttonEditClasses = `px-2 py-1 rounded ${
    darkMode
      ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
      : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
  }`;

  const buttonDeleteClasses = `px-2 py-1 rounded text-white ${
    darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
  }`;

  const buttonSubmitClasses = `bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700`;

  const buttonCancelClasses = `ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600`;

  return (
    <div className={containerClasses}>
      <h1 className="text-2xl font-bold mb-4">Gestión de Citas Médicas</h1>

      <input
        type="text"
        placeholder="Filtrar por paciente o fecha"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className={inputClasses + " mb-4"}
      />

      <table
        className="w-full border-collapse border mb-6"
        style={{ borderColor: darkMode ? "#374151" : "#D1D5DB" }}
      >
        <thead>
          <tr>
            <th className={tableHeaderClasses}>Paciente</th>
            <th className={tableHeaderClasses}>Fecha</th>
            <th className={tableHeaderClasses}>Motivo</th>
            <th className={tableHeaderClasses}>Acciones</th>
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
              <td className={tableCellClasses}>
                {(cita.paciente &&
                  typeof cita.paciente === "object" &&
                  cita.paciente.nombreCompleto) ||
                  "Paciente no asignado"}
              </td>
              <td className={tableCellClasses}>
                {cita.fecha ? cita.fecha.split("T")[0] : ""}
              </td>
              <td className={tableCellClasses}>{cita.motivo}</td>
              <td className={tableCellClasses + " space-x-2"}>
                <button
                  onClick={() => handleEdit(cita)}
                  className={buttonEditClasses}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cita._id)}
                  className={buttonDeleteClasses}
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
          className={inputClasses}
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
          className={inputClasses}
        />

        <input
          type="text"
          name="motivo"
          placeholder="Motivo de la cita"
          value={form.motivo}
          onChange={handleChange}
          required
          className={inputClasses}
        />

        {/* Checkboxes para notificaciones */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="notificarWhatsApp"
              checked={form.notificarWhatsApp}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span>Enviar notificación por WhatsApp</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="notificarSMS"
              checked={form.notificarSMS}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span>Enviar notificación por SMS</span>
          </label>
        </div>

        <button type="submit" className={buttonSubmitClasses}>
          {editId ? "Actualizar" : "Crear"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({
                paciente: "",
                fecha: "",
                motivo: "",
                notificarWhatsApp: true,
                notificarSMS: true,
              });
            }}
            className={buttonCancelClasses}
          >
            Cancelar edición
          </button>
        )}
      </form>
    </div>
  );
}
