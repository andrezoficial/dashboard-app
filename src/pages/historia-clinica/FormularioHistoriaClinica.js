import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://backend-dashboard-v2.onrender.com/api";

export default function FormularioHistoriaClinica({ onGuardar }) {
  const { id: pacienteId } = useParams();
  const [datos, setDatos] = useState({
    motivoConsulta: "",
    antecedentes: "",
    examenFisico: "",
    diagnostico: "",
    tratamiento: "",
    recomendaciones: "",
    cups: [],  // Aquí guardamos los códigos seleccionados
  });
  const [cupsDisponibles, setCupsDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar historia clínica y lista de CUPS
  useEffect(() => {
    if (!pacienteId) return;
    const token = localStorage.getItem("token");

    async function fetchData() {
      try {
        const [historiaRes, cupsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/pacientes/${pacienteId}/historia`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/cups`),
        ]);

        if (historiaRes.data) {
          setDatos((prev) => ({ ...prev, ...historiaRes.data }));
        }
        setCupsDisponibles(cupsRes.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("No se pudo cargar la historia clínica o CUPS");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [pacienteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar selección múltiple de CUPS
  const handleCupsChange = (e) => {
    const opciones = Array.from(e.target.selectedOptions);
    const valores = opciones.map((opt) => opt.value);
    setDatos((prev) => ({ ...prev, cups: valores }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${API_BASE_URL}/pacientes/${pacienteId}/historia`,
        datos,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (onGuardar) onGuardar(datos);
      alert("Historia clínica guardada correctamente");
    } catch (error) {
      console.error("Error guardando historia clínica:", error);
      alert("Error al guardar la historia clínica");
    }
  };

  if (loading) return <p className="text-center py-8">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  // Para mostrar un placeholder más amigable
  const placeholderFriendly = (str) =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow-md dark:bg-gray-800"
    >
      {[
        "motivoConsulta",
        "antecedentes",
        "examenFisico",
        "diagnostico",
        "tratamiento",
        "recomendaciones",
      ].map((campo) => (
        <textarea
          key={campo}
          name={campo}
          placeholder={placeholderFriendly(campo)}
          value={datos[campo]}
          onChange={handleChange}
          required
          rows={3}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
      ))}

      <label htmlFor="cups" className="block font-semibold">
        Procedimientos (CUPS) - selecciona uno o varios:
      </label>
      <select
        id="cups"
        multiple
        value={datos.cups}
        onChange={handleCupsChange}
        className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
        size={Math.min(6, cupsDisponibles.length)} // Mostrar hasta 6 filas
      >
        {cupsDisponibles.map(({ codigo, descripcion }) => (
          <option key={codigo} value={codigo}>
            {codigo} - {descripcion}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Guardar historia clínica
      </button>
    </form>
  );
}
