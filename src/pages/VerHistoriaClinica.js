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

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md mx-auto mt-8">
      <p>{error}</p>
    </div>
  );
  
  if (!datos) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

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
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              Historia Clínica
            </h1>
            <p className="text-gray-600 mt-1">
              Paciente: <span className="font-medium text-gray-800">{datos.datosPaciente?.nombreCompleto}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setEditando(true)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
            <Link
              to={`/dashboard/pacientes/${pacienteId}/historia-clinica`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Formulario clínico
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Documento</p>
                <p>{datos.identificacion?.tipo} {datos.identificacion?.numero}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                <p>{datos.fechaNacimiento || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">EPS</p>
                <p>{datos.eps || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contacto de Emergencia</p>
                <p>{datos.contactoEmergencia?.nombre ? `${datos.contactoEmergencia.nombre} (${datos.contactoEmergencia.telefono})` : "-"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Motivo de Consulta</h2>
              <p className="text-gray-700">{datos.motivoConsulta?.descripcion || "No registrado"}</p>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Antecedentes</h2>
              <pre className="text-gray-700 whitespace-pre-wrap font-sans">
                {JSON.stringify(datos.antecedentes, null, 2) === "{}" 
                  ? "No registrado" 
                  : JSON.stringify(datos.antecedentes, null, 2)}
              </pre>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Examen Físico</h2>
              <pre className="text-gray-700 whitespace-pre-wrap font-sans">
                {JSON.stringify(datos.examenFisico, null, 2) === "{}" 
                  ? "No registrado" 
                  : JSON.stringify(datos.examenFisico, null, 2)}
              </pre>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Diagnósticos</h2>
              <div className="space-y-2">
                <div>
                  <h3 className="font-medium text-gray-700">Definitivos:</h3>
                  {datos.diagnosticos?.definitivos?.length ? (
                    <ul className="list-disc ml-5">
                      {datos.diagnosticos.definitivos.map((d, i) => (
                        <li key={i}>{d.descripcion}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No registrado</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Tratamiento</h2>
              <pre className="text-gray-700 whitespace-pre-wrap font-sans">
                {JSON.stringify(datos.tratamiento, null, 2) === "{}" 
                  ? "No registrado" 
                  : JSON.stringify(datos.tratamiento, null, 2)}
              </pre>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Procedimientos (CUPS)</h2>
              {datos.tratamiento?.procedimientos?.length ? (
                <div className="space-y-2">
                  {datos.tratamiento.procedimientos.map((c, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{c.codigoCUPS}</p>
                      <p className="text-gray-600">{c.nombre}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay procedimientos registrados</p>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Recomendaciones</h2>
              <pre className="text-gray-700 whitespace-pre-wrap font-sans">
                {JSON.stringify(datos.recomendaciones, null, 2) === "{}" 
                  ? "No registrado" 
                  : JSON.stringify(datos.recomendaciones, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de edición
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Editar Historia Clínica</h1>
          <p className="text-gray-600">Paciente: {datos.datosPaciente?.nombreCompleto}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Motivo de Consulta</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="motivoConsulta"
              value={formData.motivoConsulta.descripcion}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Describa el motivo de consulta del paciente"
            />
          </div>
        </div>

        {/* Aquí puedes agregar los demás campos de edición */}

        <div className="flex flex-wrap gap-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}