import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_BASE_URL = "https://backend-dashboard-v2.onrender.com/api";

const opcionesMotivoConsulta = [
  { value: "Medicina general", label: "Medicina general" },
  { value: "Odontología", label: "Odontología" },
  { value: "Optometría", label: "Optometría" },
  { value: "Medicina con especialistas", label: "Medicina con especialistas" },
  { value: "Laboratorios", label: "Laboratorios" },
];

export default function FormularioHistoriaClinica({ onGuardar }) {
  const { id: pacienteId } = useParams();
  const formRef = useRef();

  const [datos, setDatos] = useState({
    motivoConsulta: "Medicina general",
    antecedentes: "",
    examenFisico: "",
    codigoDiagnostico: "",
    nombreDiagnostico: "",
    tratamiento: "",
    recomendaciones: "",
    cups: [],
    cupsConNombre: [],
    nombrePaciente: "",
  });

  const [cupsOpciones, setCupsOpciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pacienteId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No autorizado");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const historiaRes = await axios.get(
          `${API_BASE_URL}/pacientes/${pacienteId}/historia`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDatos((prev) => ({ ...prev, ...historiaRes.data }));
      } catch (err) {
        if (err.response?.status === 404) {
          setDatos((prev) => ({
            ...prev,
            motivoConsulta: "",
            antecedentes: "",
            examenFisico: "",
            codigoDiagnostico: "",
            nombreDiagnostico: "",
            tratamiento: "",
            recomendaciones: "",
            cups: [],
            cupsConNombre: [],
          }));
        } else {
          console.error("Error cargando historia clínica:", err);
          setError("Error al cargar la historia clínica");
          setLoading(false);
          return;
        }
      }

      try {
        const cupsRes = await axios.get(`${API_BASE_URL}/cups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCupsOpciones(cupsRes.data);
      } catch (err) {
        console.error("Error cargando CUPS:", err);
        setError("Error al cargar los CUPS");
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

  const handleCupsChange = (selected) => {
    setDatos((prev) => ({
      ...prev,
      cups: selected ? selected.map((opt) => opt.value) : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("No autorizado");

    try {
      await axios.post(
        `${API_BASE_URL}/pacientes/${pacienteId}/historia`,
        datos,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onGuardar?.(datos);
      alert("Historia clínica guardada");
    } catch (error) {
      console.error("Error guardando historia clínica:", error);
      alert("Error al guardar la historia clínica");
    }
  };

  const exportarPDF = async () => {
    const input = formRef.current;
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    let yOffset = 20;

    const fechaActual = new Date().toLocaleDateString("es-CO");
    const nombre = datos.nombrePaciente || "Paciente";

    pdf.setFontSize(18);
    pdf.text("Historia Clínica", pdfWidth / 2, yOffset, { align: "center" });

    pdf.setFontSize(12);
    yOffset += 10;
    pdf.text(`Nombre: ${nombre}`, 15, yOffset);
    yOffset += 7;
    pdf.text(`Fecha: ${fechaActual}`, 15, yOffset);

    yOffset += 10;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, yOffset, pdfWidth, imgHeight);

    pdf.save(`historia_clinica_${nombre}.pdf`);
  };

const cargarDiagnosticos = async (inputValue, callback) => {
  if (!inputValue || inputValue.length < 3) return;

  try {
    const response = await axios.get(
      `https://backend-dashboard-v2.onrender.com/api/icd11/buscar?termino=${encodeURIComponent(inputValue)}`
    );
    const resultados = response.data.map((item) => ({
      label: `${item.code} - ${item.title}`,
      value: item.code,
    }));
    callback(resultados);
  } catch (error) {
    console.error("Error cargando diagnósticos:", error.message);
    callback([]);
  }
};

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h1 className="text-2xl font-bold">Historia Clínica</h1>
          {datos.nombrePaciente && (
            <p className="text-blue-100">Paciente: {datos.nombrePaciente}</p>
          )}
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="p-6 space-y-6"
        >
          {/* Motivo de consulta */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Motivo de consulta
            </label>
            <select
              name="motivoConsulta"
              value={datos.motivoConsulta}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {opcionesMotivoConsulta.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Antecedentes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Antecedentes (diagnósticos previos)
            </label>
            <textarea
              name="antecedentes"
              value={datos.antecedentes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ingrese los antecedentes del paciente..."
            />
          </div>

          {/* Examen físico */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Examen físico
            </label>
            <textarea
              name="examenFisico"
              value={datos.examenFisico}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Describa el examen físico realizado..."
            />
          </div>

          {/* Diagnóstico ICD-11 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Diagnóstico (ICD-11)
            </label>
            <AsyncSelect
              cacheOptions
              loadOptions={cargarDiagnosticos}
              defaultOptions
              value={
                datos.codigoDiagnostico
                  ? {
                      value: datos.codigoDiagnostico,
                      label: `${datos.codigoDiagnostico} - ${datos.nombreDiagnostico}`,
                    }
                  : null
              }
              onChange={(selected) =>
                setDatos((prev) => ({
                  ...prev,
                  codigoDiagnostico: selected?.value || "",
                  nombreDiagnostico: selected?.label?.split(" - ")[1] || "",
                }))
              }
              placeholder="Buscar diagnóstico ICD-11..."
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Tratamiento */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tratamiento
            </label>
            <textarea
              name="tratamiento"
              value={datos.tratamiento}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Describa el tratamiento indicado..."
            />
          </div>

          {/* Recomendaciones */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Recomendaciones
            </label>
            <textarea
              name="recomendaciones"
              value={datos.recomendaciones}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ingrese las recomendaciones para el paciente..."
            />
          </div>

          {/* Procedimientos CUPS */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Procedimientos (CUPS)
            </label>
            <Select
              isMulti
              options={cupsOpciones}
              value={
                cupsOpciones.length > 0 && Array.isArray(datos.cups)
                  ? cupsOpciones.filter((opt) => datos.cups.includes(opt.value))
                  : []
              }
              onChange={handleCupsChange}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Buscar y seleccionar CUPS..."
            />
          </div>

          {/* Botones */}
          <div className="flex flex-wrap gap-4 pt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Guardar historia clínica
            </button>
            <button
              type="button"
              onClick={exportarPDF}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Exportar a PDF
            </button>
          </div>
        </form>
      </div>

      {/* Estilos para react-select */}
      <style jsx global>{`
        .react-select-container .react-select__control {
          border: 1px solid #d1d5db;
          min-height: 42px;
          border-radius: 0.5rem;
        }
        .react-select-container .react-select__control--is-focused {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .react-select-container .react-select__menu {
          z-index: 20;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .react-select-container .react-select__multi-value {
          background-color: #e0f2fe;
          border-radius: 0.25rem;
        }
        .react-select-container .react-select__multi-value__label {
          color: #0369a1;
          font-size: 0.875rem;
        }
        .react-select-container .react-select__placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}