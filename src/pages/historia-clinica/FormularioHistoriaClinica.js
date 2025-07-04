import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function FormularioHistoriaClinica({ onGuardar, datosIniciales = {} }) {
  const { id: pacienteId } = useParams();

  const [datos, setDatos] = useState({
    motivoConsulta: "",
    antecedentes: "",
    examenFisico: "",
    diagnostico: "",
    tratamiento: "",
    recomendaciones: "",
    procedimiento: null, // si usas select async
  });

  // Cargar datos iniciales desde backend según pacienteId
  useEffect(() => {
    if (!pacienteId) return;

    async function fetchHistoria() {
      try {
        const res = await axios.get(`/api/pacientes/${pacienteId}/historia`);
        if (res.data) {
          setDatos({
            motivoConsulta: res.data.motivoConsulta || "",
            antecedentes: res.data.antecedentes || "",
            examenFisico: res.data.examenFisico || "",
            diagnostico: res.data.diagnostico || "",
            tratamiento: res.data.tratamiento || "",
            recomendaciones: res.data.recomendaciones || "",
            procedimiento: res.data.procedimiento || null,
          });
        }
      } catch (error) {
        console.error("Error cargando historia clínica:", error);
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

    try {
      // Guardar en backend (ajusta endpoint según tu API)
      await axios.post(`/api/pacientes/${pacienteId}/historia`, datos);
      if (onGuardar) onGuardar(datos);
    } catch (error) {
      console.error("Error guardando historia clínica:", error);
    }
  };

  // ... resto del formulario (inputs, selects, etc.) usando handleChange y datos

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow-md dark:bg-gray-800">
      {/* ejemplo textarea motivoConsulta */}
      <textarea
        name="motivoConsulta"
        placeholder="Motivo de consulta"
        value={datos.motivoConsulta}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        rows={2}
      />

      {/* Aquí sigue el resto de campos con el mismo patrón */}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Guardar historia clínica
      </button>
    </form>
  );
}
