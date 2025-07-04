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
    procedimiento: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pacienteId) return;
    const token = localStorage.getItem("token");

    async function fetchHistoria() {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/pacientes/${pacienteId}/historia`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data) {
          setDatos((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error("Error cargando historia clínica:", err);
        setError("No se pudo cargar la historia clínica");
      } finally {
        setLoading(false);
      }
    }

    fetchHistoria();
  }, [pacienteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
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
    } catch (error) {
      console.error("Error guardando historia clínica:", error);
      alert("Error al guardar la historia clínica");
    }
  };

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow-md dark:bg-gray-800"
    >
      {["motivoConsulta", "antecedentes", "examenFisico", "diagnostico", "tratamiento", "recomendaciones"].map((campo) => (
        <textarea
          key={campo}
          name={campo}
          placeholder={campo.replace(/([A-Z])/g, " $1")}
          value={datos[campo]}
          onChange={handleChange}
          required
          rows={3}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
      ))}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Guardar historia clínica
      </button>
    </form>
  );
}
