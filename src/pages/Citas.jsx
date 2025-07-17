import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://backend-dashboard-v2.onrender.com/api";

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [form, setForm] = useState({
    pacienteId: "",
    fecha: "",
    motivo: "",
  });

  useEffect(() => {
    fetchCitas();
    fetchPacientes();
    fetchMotivos();
  }, []);

  const fetchCitas = async () => {
    try {
      const res = await axios.get(`${API_URL}/citas`);
      setCitas(res.data);
    } catch (error) {
      toast.error("Error al cargar las citas");
      console.error(error);
    }
  };

  const fetchPacientes = async () => {
    try {
      const res = await axios.get(`${API_URL}/pacientes`);
      setPacientes(res.data);
    } catch (error) {
      toast.error("Error al cargar pacientes");
      console.error(error);
    }
  };

  const fetchMotivos = async () => {
    try {
      const res = await axios.get(`${API_URL}/motivos`);
      setMotivos(res.data);
    } catch (error) {
      toast.error("No se pudieron cargar los motivos");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/citas`, form);
      toast.success("Cita guardada correctamente");
      setForm({ pacienteId: "", fecha: "", motivo: "" });
      fetchCitas();
    } catch (error) {
      toast.error("Error al guardar la cita");
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 text-gray-900 dark:text-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-2xl font-bold mb-6">Crear Cita</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white dark:bg-gray-800 p-6 rounded border dark:border-gray-700"
      >
        <div>
          <label htmlFor="pacienteId" className="block font-semibold mb-1">
            Paciente
          </label>
          <select
            id="pacienteId"
            name="pacienteId"
            value={form.pacienteId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">Selecciona un paciente</option>
            {pacientes.map((paciente) => (
              <option
                key={paciente._id}
                value={paciente._id}
                className="dark:bg-gray-700 dark:text-gray-100"
              >
                {paciente.nombreCompleto || paciente.nombre || "Sin nombre"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fecha" className="block font-semibold mb-1">
            Fecha
          </label>
          <input
            id="fecha"
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
        </div>

        <div>
          <label htmlFor="motivo" className="block font-semibold mb-1">
            Motivo
          </label>
          <select
            id="motivo"
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">Selecciona un motivo</option>
            {motivos.map((motivo) => (
              <option
                key={motivo._id || motivo.value || motivo.label}
                value={motivo.value || motivo.label}
                className="dark:bg-gray-700 dark:text-gray-100"
              >
                {motivo.label || motivo.value}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 flex justify-end items-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Guardar Cita
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4">Citas Registradas</h2>

      {citas.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No hay citas registradas.</p>
      ) : (
        <div className="overflow-x-auto rounded border bg-white dark:bg-gray-900 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left text-gray-900 dark:text-gray-100">
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-700">Paciente</th>
                <th className="py-2 px-4 border-b dark:border-gray-700">Fecha</th>
                <th className="py-2 px-4 border-b dark:border-gray-700">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr
                  key={cita._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-2 px-4 border-b dark:border-gray-700">
                    {cita.paciente?.nombreCompleto || cita.paciente?.nombre || "Desconocido"}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">
                    {new Date(cita.fecha).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{cita.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
