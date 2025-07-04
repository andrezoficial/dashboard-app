import React from "react";
import { useParams, Link } from "react-router-dom";
import FormularioHistoriaClinica from "../components/FormularioHistoriaClinica";

export default function HistoriaClinicaPage() {
  const { id } = useParams(); // pacienteId

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Historia Clínica del Paciente
        </h1>

        <FormularioHistoriaClinica onGuardar={() => alert("Datos guardados")} />

        <Link
          to="/dashboard" // o a donde quieras que vuelva
          className="inline-block mt-6 text-blue-600 hover:underline"
        >
          ← Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
