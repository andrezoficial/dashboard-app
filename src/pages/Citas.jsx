import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const API_URL = "https://backend-dashboard-v2.onrender.com/api";

export default function Citas() {
  const { darkMode } = useTheme();

  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    paciente: "",
    fecha: "",
    motivo: "",
  });
  const [editId, setEditId] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCitas();
    fetchPacientes();
  }, []);

  const fetchCitas = async () => {
    try {
      const res = await axios.get(`${API_URL}/citas`);
      setCitas(res.data);
    } catch (error) {
      console.error("Error cargando citas:", error);
      alert("Error cargando citas");
    }
  };

  const fetchPacientes = async () => {
    try {
      const res = await axios.get(`${API_URL}/pacientes`);
      setPacientes(res.data);
    } catch (error) {
      console.error("Error cargando pacientes:", error);
      alert("Error cargando pacientes");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hoy = new Date().setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(form.fecha).setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
      toast.error("La fecha no puede ser anterior a hoy");
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API_URL}/citas/${editId}`, form);
        toast.success("Cita actualizada");
      } else {
        await axios.post(`${API_URL}/citas`, form);
        toast.success("Cita registrada y correo enviado al paciente");
      }
      setForm({ paciente: "", fecha: "", motivo: "" });
      setEditId(null);
      fetchCitas();
    } catch (error) {
      console.error("Error guardando cita:", error);
      alert("Error guardando cita");
    } finally {
      setLoading(false);
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
    });
    setEditId(cita._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta cita?")) {
      try {
        await axios.delete(`${API_URL}/citas/${id}`);
        toast.info("Cita eliminada");
        fetchCitas();
        if (editId === id) {
          setEditId(null);
          setForm({ paciente: "", fecha: "", motivo: "" });
        }
      } catch (error) {
        console.error("Error eliminando cita:", error);
        alert("Error eliminando cita");
      }
    }
  };

  const citasFiltradas = citas.filter((cita) => {
    const nombre = cita.paciente?.nombreCompleto?.toLowerCase() || "";
    const fecha = cita.fecha || "";
    return nombre.includes(filtro.toLowerCase()) || fecha.includes(filtro);
  });

  const eventosCalendario = citas.map((cita) => ({
    id: cita._id,
    title: `${cita.paciente?.nombreCompleto || "Paciente"} - ${cita.motivo}`,
    start: new Date(cita.fecha),
    end: new Date(new Date(cita.fecha).getTime() + 60 * 60 * 1000),
  }));

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

  const buttonSubmitClasses = `bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50`;

  const buttonCancelClasses = `ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600`;

  const onSelectEvent = (event) => {
    const citaSeleccionada = citas.find((c) => c._id === event.id);
    if (citaSeleccionada) {
      handleEdit(citaSeleccionada);
    }
  };

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

      <div style={{ height: 500, marginBottom: 20 }}>
        <Calendar
          localizer={localizer}
          events={eventosCalendario}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          messages={{
            next: "Sig.",
            previous: "Ant.",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            noEventsInRange: "No hay eventos en este rango.",
          }}
          onSelectEvent={onSelectEvent}
          popup={true}
        />
      </div>

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

        <button
          type="submit"
          disabled={loading}
          className={buttonSubmitClasses}
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
            className={buttonCancelClasses}
          >
            Cancelar edición
          </button>
        )}
      </form>
    </div>
  );
}
