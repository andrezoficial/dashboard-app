import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import {
  getCitas,
  getPacientes,
  getMotivos,
  crearCita,
} from "../services/api";

export default function Citas() {
  const { darkMode } = useTheme();
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [form, setForm] = useState({
    pacienteId: "",
    fecha: "",
    motivo: "",
  });
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoadingDatos(true);
    try {
      const [citasData, pacientesData, motivosData] = await Promise.all([
        getCitas(),
        getPacientes(),
        getMotivos(),
      ]);
      setCitas(citasData);
      setPacientes(pacientesData);
      setMotivos(motivosData);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando datos");
    } finally {
      setLoadingDatos(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar fecha no anterior a hoy
    const hoy = new Date().setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(form.fecha).setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
      toast.error("La fecha no puede ser anterior a hoy");
      return;
    }

    if (!form.motivo) {
      toast.error("Por favor selecciona un motivo válido");
      return;
    }

    setGuardando(true);
    try {
      await crearCita(form);
      toast.success("Cita guardada correctamente");
      setForm({ pacienteId: "", fecha: "", motivo: "" });
      cargarDatos();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la cita");
    } finally {
      setGuardando(false);
    }
  };

  const inputClasses = `block w-full p-2 border rounded ${
    darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
  }`;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Crear Cita</h2>

      {loadingDatos ? (
        <div className="text-center py-10 text-gray-500">Cargando datos...</div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Select paciente */}
          <select
            name="pacienteId"
            value={form.pacienteId}
            onChange={handleChange}
            required
            className={inputClasses}
          >
            <option value="">Selecciona un paciente</option>
            {pacientes.length === 0 && (
              <option disabled>No hay pacientes disponibles</option>
            )}
            {pacientes.map((paciente) => (
              <option key={paciente._id} value={paciente._id}>
                {paciente.nombre}
              </option>
            ))}
          </select>

          {/* Fecha */}
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]} // Desde hoy
            className={inputClasses}
            placeholder="Selecciona la fecha"
          />

          {/* Select motivo */}
          <select
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            required
            className={inputClasses}
          >
            <option value="">Selecciona un motivo</option>
            {motivos.length === 0 && (
              <option disabled>No hay motivos disponibles</option>
            )}
            {motivos.map((motivo, i) => (
              <option key={motivo._id || i} value={motivo.value}>
                {motivo.label}
              </option>
            ))}
          </select>

          {/* Botón */}
          <button
            type="submit"
            className={`md:col-span-3 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition ${
              guardando ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar Cita"}
          </button>
        </form>
      )}

      <h2 className="text-2xl font-bold mb-4">Citas Registradas</h2>
      {loadingDatos ? (
        <div className="text-center py-10 text-gray-500">Cargando citas...</div>
      ) : citas.length === 0 ? (
        <p className="text-center text-gray-600">No hay citas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Paciente</th>
                <th className="border px-4 py-2 text-left">Fecha</th>
                <th className="border px-4 py-2 text-left">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr
                  key={cita._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="border px-4 py-2">
                    {cita.paciente?.nombre || "Desconocido"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(cita.fecha).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{cita.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
