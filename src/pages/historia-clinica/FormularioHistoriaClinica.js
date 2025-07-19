// src/pages/FormularioHistoriaClinica.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const API_BASE_URL = "https://backend-dashboard-v2.onrender.com/api";
const LOGO_URL = "https://www.viorclinic.es/logo192.png";

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
    datosPaciente: {},
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
    (async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/pacientes/${pacienteId}/historia`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDatos(res.data);
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
          console.error(err);
          setError("Error al cargar la historia clínica");
        }
      }
      try {
        const cupsRes = await axios.get(`${API_BASE_URL}/cups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCupsOpciones(cupsRes.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los CUPS");
      } finally {
        setLoading(false);
      }
    })();
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
    } catch (err) {
      console.error(err);
      alert("Error al guardar la historia clínica");
    }
  };

  const cargarDiagnosticos = async (inputValue, callback) => {
    if (!inputValue || inputValue.length < 3) {
      callback([]);
      return;
    }
    try {
      const res = await axios.get(
        `${API_BASE_URL}/icd11/buscar?termino=${encodeURIComponent(inputValue)}`
      );
      const resultados = res.data.map((item) => ({
        label: `${item.code} - ${item.title}`,
        value: item.code,
        title: item.title,
      }));
      callback(resultados);
    } catch (err) {
      console.error(err);
      callback([]);
    }
  };

  const exportarPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = LOGO_URL;
    await new Promise((r) => (img.onload = r));
    const logoWidth = 40;
    const logoHeight = (logoWidth * img.height) / img.width;
    doc.addImage(img, "PNG", (pageWidth - logoWidth) / 2, 10, logoWidth, logoHeight);

    // Título
    doc
      .setFontSize(18)
      .setTextColor("#1e88e5")
      .text("Historia Clínica - ViorClinic", pageWidth / 2, 60, {
        align: "center",
      });

    // Tabla datos paciente
    const dp = datos.datosPaciente || {};
    const pacienteRows = [
      ["Nombre", dp.nombreCompleto || "-"],
      [
        "Documento",
        dp.tipoDocumento?.toUpperCase() + " " + dp.numeroDocumento || "-",
      ],
      ["Fecha Nac.", dp.fechaNacimiento?.split("T")[0] || "-"],
      ["Sexo", dp.sexo || "-"],
      ["Correo", dp.correo || "-"],
      ["Teléfono", dp.telefono || "-"],
      ["EPS", dp.eps || "-"],
      ["Dirección", dp.direccion || "-"],
      ["Estado Civil", dp.estadoCivil || "-"],
      ["Ocupación", dp.ocupacion || "-"],
      [
        "Contact. Emergencia",
        dp.contactoEmergenciaNombre
          ? `${dp.contactoEmergenciaNombre} (${dp.contactoEmergenciaTelefono})`
          : "-",
      ],
    ];
    autoTable(doc, {
      startY: 70,
      head: [["Campo", "Detalle"]],
      body: pacienteRows,
      theme: "grid",
      headStyles: { fillColor: "#1e88e5" },
      styles: { fontSize: 10 },
      margin: { left: 15, right: 15 },
    });

    // Secciones clínicas
    let y = doc.lastAutoTable.finalY + 10;
    const secciones = [
      { label: "Motivo de consulta", value: datos.motivoConsulta },
      { label: "Antecedentes", value: datos.antecedentes },
      { label: "Examen físico", value: datos.examenFisico },
      { label: "Diagnóstico", value: datos.nombreDiagnostico },
      { label: "Tratamiento", value: datos.tratamiento },
      { label: "Recomendaciones", value: datos.recomendaciones },
    ];
    secciones.forEach(({ label, value }) => {
      doc
        .setFontSize(14)
        .setTextColor("#1e88e5")
        .text(label, 15, y);
      y += 6;
      doc
        .setFontSize(12)
        .setTextColor("#000")
        .text(value || "-", 15, y, { maxWidth: pageWidth - 30 });
      y += doc.getTextDimensions(value || "-").h + 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // CUPS
    if (datos.cupsConNombre.length) {
      doc
        .setFontSize(14)
        .setTextColor("#1e88e5")
        .text("Procedimientos (CUPS)", 15, y);
      y += 6;
      datos.cupsConNombre.forEach(({ codigo, nombre }) => {
        doc
          .setFontSize(12)
          .setTextColor("#000")
          .text(`• ${codigo} - ${nombre}`, 15, y, {
            maxWidth: pageWidth - 30,
          });
        y += 6;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
    }

    doc.save(
      `historia_clinica_${(dp.nombreCompleto || "paciente")
        .replace(/\s+/g, "_")
        .toLowerCase()}.pdf`
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
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
          {datos.datosPaciente.nombreCompleto && (
            <p className="text-blue-100">
              Paciente: {datos.datosPaciente.nombreCompleto}
            </p>
          )}
        </div>
        {/* Formulario */}
        <form onSubmit={handleSubmit} ref={formRef} className="p-6 space-y-6">
          {/* ... el resto de campos igual ... */}
          <div className="flex flex-wrap gap-4 pt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700"
            >
              Guardar historia clínica
            </button>
            <button
              type="button"
              onClick={exportarPDF}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700"
            >
              Exportar a PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
