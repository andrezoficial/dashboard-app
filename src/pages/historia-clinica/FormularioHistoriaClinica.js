import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
    motivoConsulta: "",
    antecedentes: "",
    examenFisico: "",
    diagnostico: "",
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
          `${API_BASE_URL}/historiaClinica/${pacienteId}/historia`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (historiaRes.data) {
          setDatos((prev) => ({ ...prev, ...historiaRes.data }));
        }

        const cupsRes = await axios.get(`${API_BASE_URL}/cups`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const opciones = Array.isArray(cupsRes.data)
          ? cupsRes.data
          : [];

        setCupsOpciones(opciones);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar la historia clínica o CUPS");
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
        `${API_BASE_URL}/historiaClinica/${pacienteId}/historia`,
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

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <form
      onSubmit={handleSubmit}
      ref={formRef}
      className="space-y-4 p-4 bg-white rounded shadow-md dark:bg-gray-800"
    >
      {/* Motivo de consulta */}
      <label className="block font-medium mb-1 text-gray-700 dark:text-white">
        Motivo de consulta
      </label>
      <select
        name="motivoConsulta"
        value={datos.motivoConsulta}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      >
        <option value="">Seleccione un motivo</option>
        {opcionesMotivoConsulta.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Antecedentes */}
      <textarea
        name="antecedentes"
        placeholder="Antecedentes (diagnósticos previos)"
        value={datos.antecedentes}
        onChange={handleChange}
        rows={3}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      {/* Examen físico */}
      <textarea
        name="examenFisico"
        placeholder="Examen físico"
        value={datos.examenFisico}
        onChange={handleChange}
        rows={3}
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      {/* Diagnóstico */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-white">
          Diagnóstico
        </label>
        <Select
          options={cupsOpciones}
          value={cupsOpciones.find((opt) => opt.value === datos.diagnostico) || null}
          onChange={(selected) => {
            setDatos((prev) => ({
              ...prev,
              diagnostico: selected ? selected.value : "",
            }));
          }}
          placeholder="Buscar diagnóstico..."
          isClearable
          className="text-black"
        />
      </div>

      {/* Tratamiento */}
      <textarea
        name="tratamiento"
        placeholder="Tratamiento"
        value={datos.tratamiento}
        onChange={handleChange}
        rows={3}
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      {/* Recomendaciones */}
      <textarea
        name="recomendaciones"
        placeholder="Recomendaciones"
        value={datos.recomendaciones}
        onChange={handleChange}
        rows={3}
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      {/* Procedimientos (CUPS) */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
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
          className="text-black"
          placeholder="Buscar y seleccionar CUPS..."
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar historia clínica
        </button>
        <button
          type="button"
          onClick={exportarPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Exportar a PDF
        </button>
      </div>
    </form>
  );
}
