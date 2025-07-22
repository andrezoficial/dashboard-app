// src/pages/historia-clinica/VerHistoriaClinica.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function VerHistoriaClinica() {
  const { id: pacienteId } = useParams();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    motivoConsulta: { descripcion: "" },
    antecedentes: {},
    examenFisico: {},
    diagnosticos: { presuntivos: [], definitivos: [], diferenciales: [] },
    tratamiento: { medicamentos: [], procedimientos: [] },
    recomendaciones: {},
    sexo: "",
    fechaNacimiento: "",
    identificacion: { tipo: "", numero: "" },
    estadoCivil: "",
    ocupacion: "",
    direccion: "",
    telefono: "",
    correo: "",
    eps: "",
    contactoEmergencia: { nombre: "", relacion: "", telefono: "" },
  });

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

        setFormData({
          motivoConsulta: res.data.motivoConsulta || { descripcion: "" },
          antecedentes: res.data.antecedentes || {},
          examenFisico: res.data.examenFisico || {},
          diagnosticos:
            res.data.diagnosticos || { presuntivos: [], definitivos: [], diferenciales: [] },
          tratamiento: res.data.tratamiento || { medicamentos: [], procedimientos: [] },
          recomendaciones: res.data.recomendaciones || {},
          sexo: res.data.sexo || "",
          fechaNacimiento: res.data.fechaNacimiento
            ? new Date(res.data.fechaNacimiento).toISOString().substr(0, 10)
            : "",
          identificacion: res.data.identificacion || { tipo: "", numero: "" },
          estadoCivil: res.data.estadoCivil || "",
          ocupacion: res.data.ocupacion || "",
          direccion: res.data.direccion || "",
          telefono: res.data.telefono || "",
          correo: res.data.correo || "",
          eps: res.data.eps || "",
          contactoEmergencia:
            res.data.contactoEmergencia || { nombre: "", relacion: "", telefono: "" },
        });
      } catch (err) {
        setError("Error al cargar la historia clínica");
      }
    })();
  }, [pacienteId]);

  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!datos) return <div className="text-center mt-8">Cargando...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("identificacion.")) {
      setFormData((prev) => ({
        ...prev,
        identificacion: { ...prev.identificacion, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("contactoEmergencia.")) {
      setFormData((prev) => ({
        ...prev,
        contactoEmergencia: {
          ...prev.contactoEmergencia,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name === "motivoConsulta") {
      setFormData((prev) => ({ ...prev, motivoConsulta: { descripcion: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return setError("No autorizado");

    try {
      const body = {
        motivoConsulta: formData.motivoConsulta,
        antecedentes: formData.antecedentes,
        examenFisico: formData.examenFisico,
        diagnosticos: formData.diagnosticos,
        tratamiento: formData.tratamiento,
        recomendaciones: formData.recomendaciones,
        cups: formData.tratamiento.procedimientos || [],
        sexo: formData.sexo,
        fechaNacimiento: formData.fechaNacimiento,
        identificacion: formData.identificacion,
        estadoCivil: formData.estadoCivil,
        ocupacion: formData.ocupacion,
        direccion: formData.direccion,
        telefono: formData.telefono,
        correo: formData.correo,
        eps: formData.eps,
        contactoEmergencia: formData.contactoEmergencia,
      };

      await axios.put(
        `https://backend-dashboard-v2.onrender.com/api/pacientes/${pacienteId}/historia`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setError(null);
      setEditando(false);
      const res = await axios.get(
        `https://backend-dashboard-v2.onrender.com/api/pacientes/${pacienteId}/historia`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDatos(res.data);
    } catch {
      setError("Error al guardar la historia clínica. Verifique los datos ingresados.");
    }
  };

  // Vista de solo lectura
  if (!editando) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">
            Historia Clínica de {datos.datosPaciente?.nombreCompleto}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setEditando(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
            >
              ✏️ Editar
            </button>
            {/* ← Enlace corregido */}
            <Link
              to={`/dashboard/pacientes/${pacienteId}/historia-clinica`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              📝 Formulario clínico
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
          <p>
            <strong>Motivo de consulta:</strong> {datos.motivoConsulta?.descripcion || "-"}
          </p>
          <p>
            <strong>Antecedentes:</strong>{" "}
            {JSON.stringify(datos.antecedentes) || "-"}
          </p>
          <p>
            <strong>Examen físico:</strong>{" "}
            {JSON.stringify(datos.examenFisico) || "-"}
          </p>
          <p>
            <strong>Diagnóstico:</strong>{" "}
            {datos.diagnosticos?.definitivos
              ?.map((d) => d.descripcion)
              .join(", ") || "-"}
          </p>
          <p>
            <strong>Tratamiento:</strong> {JSON.stringify(datos.tratamiento) || "-"}
          </p>
          <p>
            <strong>Recomendaciones:</strong>{" "}
            {JSON.stringify(datos.recomendaciones) || "-"}
          </p>
          <div>
            <strong>CUPS:</strong>
            <ul className="list-disc ml-6 mt-1">
              {datos.tratamiento?.procedimientos?.length ? (
                datos.tratamiento.procedimientos.map((c, i) => (
                  <li key={i}>
                    {c.codigoCUPS} - {c.nombre}
                  </li>
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

  // Vista de edición
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Editar Historia Clínica de {datos.datosPaciente?.nombreCompleto}
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 text-gray-700">
        <div>
          <label className="font-semibold">Motivo de consulta</label>
          <textarea
            name="motivoConsulta"
            value={formData.motivoConsulta.descripcion}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Aquí puedes seguir poniendo los demás campos de formulario */}

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
