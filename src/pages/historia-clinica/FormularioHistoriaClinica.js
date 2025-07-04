import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_BASE_URL = "https://backend-dashboard-v2.onrender.com/api";

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
    nombrePaciente: "", // opcional si lo traes
  });

  const [cupsOpciones, setCupsOpciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔽 Obtener historia clínica del paciente
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
        // Historia clínica
        const historiaRes = await axios.get(
          `${API_BASE_URL}/pacientes/${pacienteId}/historia`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (historiaRes.data) {
          setDatos((prev) => ({ ...prev, ...historiaRes.data }));
        }

        // Opciones de CUPS
        const cupsRes = await axios.get(`${API_BASE_URL}/cups`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const opciones = cupsRes.data.map((cup) => ({
          value: cup.codigo,
          label: `${cup.codigo} - ${cup.nombre}`,
        }));

        setCupsOpciones(opciones);
      } catch (err) {
        if (err.response?.status === 404) {
          setDatos((prev) => ({
            ...prev,
            motivoConsulta: "",
            antecedentes: "",
            examenFisico: "",
            diagnostico: "",
            tratamiento: "",
            recomendaciones: "",
            cups: [],
          }));
        } else {
          console.error("Error cargando datos:", err);
          setError("Error al cargar la historia clínica o CUPS");
        }
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
      cups: selected.map((opt) => opt.value),
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

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <form
      onSubmit={handleSubmit}
      ref={formRef}
      className="space-y-4 p-4 bg-white rounded shadow-md dark:bg-gray-800"
    >
      {[
        { name: "motivoConsulta", label: "Motivo de consulta" },
        { name: "antecedentes", label: "Antecedentes" },
        { name: "examenFisico", label: "Examen físico" },
        { name: "diagnostico", label: "Diagnóstico" },
        { name: "tratamiento", label: "Tratamiento" },
        { name: "recomendaciones", label: "Recomendaciones" },
      ].map(({ name, label }) => (
        <textarea
          key={name}
          name={name}
          placeholder={label}
          value={datos[name]}
          onChange={handleChange}
          rows={3}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
      ))}

      {/* Autocompletado de CUPS */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
          Procedimientos (CUPS)
        </label>
        <Select
          isMulti
          options={cupsOpciones}
          value={cupsOpciones.filter((opt) => datos.cups.includes(opt.value))}
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
