// pages/historia-clinica/verhistoriaclinica.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function VerHistoriaClinica() {
  const { id: pacienteId } = useParams();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setError("No autorizado");

    (async () => {
      try {
        const res = await axios.get(
          `https://backend-dashboard-v2.onrender.com/api/pacientes/${pacienteId}/historia`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDatos(res.data);
      } catch (err) {
        setError("Error al cargar la historia clínica");
      }
    })();
  }, [pacienteId]);

  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!datos) return <div className="text-center mt-8">Cargando...</div>;

  const dp = datos.datosPaciente || {};

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Historia Clínica de {dp.nombreCompleto || "Paciente"}</h1>
        <Link
          to={`/historia-clinica/${pacienteId}/formulario`}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        >
          📝 Formulario clínico
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
        <p><strong>Motivo de consulta:</strong> {datos.motivoConsulta || "-"}</p>
        <p><strong>Antecedentes:</strong> {datos.antecedentes || "-"}</p>
        <p><strong>Examen físico:</strong> {datos.examenFisico || "-"}</p>
        <p><strong>Diagnóstico:</strong> {datos.nombreDiagnostico || "-"}</p>
        <p><strong>Tratamiento:</strong> {datos.tratamiento || "-"}</p>
        <p><strong>Recomendaciones:</strong> {datos.recomendaciones || "-"}</p>
        <div>
          <strong>CUPS:</strong>
          <ul className="list-disc ml-6 mt-1">
            {datos.cupsConNombre?.length ? (
              datos.cupsConNombre.map((c, i) => (
                <li key={i}>{c.codigo} - {c.nombre}</li>
              ))
            ) : (
              <li>No hay procedimientos registrados</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
