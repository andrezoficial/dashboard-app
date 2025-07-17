import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

const API_URL = "https://backend-dashboard-v2.onrender.com/api";

export default function Citas() {
  const { darkMode } = useTheme();
  const [pacientes, setPacientes] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [formData, setFormData] = useState({ paciente: null, motivo: null, fecha: "" });
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    fetchPacientes();
    fetchMotivos();
    fetchCitas();
  }, []);

  const fetchPacientes = async () => {
    try {
      const res = await axios.get(`${API_URL}/pacientes`);
      const opciones = res.data.map((p) => ({
        value: p._id,
        label: `${p.nombre} - ${p.documento}`,
      }));
      setPacientes(opciones);
    } catch (error) {
      toast.error("Error cargando pacientes");
    }
  };

  const fetchMotivos = async () => {
    try {
      const res = await axios.get(`${API_URL}/citas/motivos`);
      setMotivos(res.data); // ya vienen con { value, label }
    } catch (error) {
      toast.error("Error cargando motivos");
    }
  };

  const fetchCitas = async () => {
    try {
      const res = await axios.get(`${API_URL}/citas`);
      setCitas(res.data);
    } catch (error) {
      toast.error("Error cargando citas");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/citas`, {
        paciente: formData.paciente?.value,
        motivo: formData.motivo?.value,
        fecha: formData.fecha,
      });
      toast.success("Cita guardada");
      setFormData({ paciente: null, motivo: null, fecha: "" }); // 🛠 Fix: usar null
      fetchCitas();
    } catch (error) {
      toast.error("Error al guardar cita");
    }
  };

  const cancelarCita = async (id) => {
    const confirmar = window.confirm("¿Cancelar esta cita?");
    if (!confirmar) return;

    try {
      await axios.put(`${API_URL}/citas/${id}/cancelar`);
      toast.info("Cita cancelada");
      fetchCitas();
    } catch (error) {
      toast.error("Error al cancelar cita");
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: darkMode ? "#1e1e1e" : "#fff",
      color: darkMode ? "#fff" : "#000",
      borderColor: state.isFocused ? "#007bff" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 1px #007bff" : null,
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: darkMode ? "#333" : "#fff",
      color: darkMode ? "#fff" : "#000",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: darkMode ? "#fff" : "#000",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: darkMode ? "#aaa" : "#666",
    }),
  };

  return (
    <div className={`p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h2 className="text-2xl font-semibold mb-4">Registrar Cita</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select
          styles={customStyles}
          options={pacientes}
          placeholder="Seleccionar paciente"
          value={formData.paciente}
          onChange={(val) => handleChange("paciente", val)}
        />
        <Select
          styles={customStyles}
          options={motivos}
          placeholder="Seleccionar motivo"
          value={formData.motivo}
          onChange={(val) => handleChange("motivo", val)}
        />
        <input
          type="datetime-local"
          className={`p-2 rounded ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100"}`}
          value={formData.fecha}
          onChange={(e) => handleChange("fecha", e.target.value)}
        />
        <button
          type="submit"
          className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Guardar Cita
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Citas registradas</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700">
          <thead className={`${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
            <tr>
              <th className="p-2">Paciente</th>
              <th className="p-2">Motivo</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita._id} className="text-center border-t dark:border-gray-700">
                <td className="p-2">{cita.paciente?.nombre}</td>
                <td className="p-2">{cita.motivo}</td>
                <td className="p-2">{new Date(cita.fecha).toLocaleString()}</td>
                <td className="p-2 capitalize">{cita.estado || "pendiente"}</td>
                <td className="p-2">
                  {cita.estado !== "cancelada" && (
                    <button
                      onClick={() => cancelarCita(cita._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {citas.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-400">
                  No hay citas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
