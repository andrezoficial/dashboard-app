// src/pages/FormularioHistoriaClinica.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
        const res = await axios.get(`${API_BASE_URL}/pacientes/${pacienteId}/historia`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDatos((prev) => ({ ...prev, ...res.data }));
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
          setError("Error al cargar la historia clínica");
        }
      }
      try {
        const cupsRes = await axios.get(`${API_BASE_URL}/cups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCupsOpciones(cupsRes.data);
      } catch (err) {
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

  const handleDiagnosticoChange = (opcion) => {
    setDatos((prev) => ({
      ...prev,
      codigoDiagnostico: opcion?.value || "",
      nombreDiagnostico: opcion?.title || "",
    }));
  };

  const handleCupsChange = (selected) => {
    setDatos((prev) => ({
      ...prev,
      cups: selected ? selected.map((opt) => opt.codigo) : [],
      cupsConNombre: selected || [],
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
      alert("Error al guardar la historia clínica");
    }
  };

  const cargarDiagnosticos = async (inputValue, callback) => {
    if (!inputValue || inputValue.length < 3) return callback([]);
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
    } catch {
      callback([]);
    }
  };

  const exportarPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = LOGO_URL;
    await new Promise((r) => (img.onload = r));
    const logoWidth = 40;
    const logoHeight = (logoWidth * img.height) / img.width;
    doc.addImage(img, "PNG", (pageWidth - logoWidth) / 2, 10, logoWidth, logoHeight);

    doc
      .setFontSize(18)
      .setTextColor("#1e88e5")
      .text("Historia Clínica - ViorClinic", pageWidth / 2, 60, {
        align: "center",
      });

    const dp = datos.datosPaciente || {};
    const pacienteRows = [
      ["Nombre", dp.nombreCompleto || "-"],
      ["Documento", `${dp.tipoDocumento?.toUpperCase() || ""} ${dp.numeroDocumento || "-"}`],
      ["Fecha Nac.", dp.fechaNacimiento?.split("T")[0] || "-"],
      ["Sexo", dp.sexo || "-"],
      ["Correo", dp.correo || "-"],
      ["Teléfono", dp.telefono || "-"],
      ["EPS", dp.eps || "-"],
      ["Dirección", dp.direccion || "-"],
      ["Estado Civil", dp.estadoCivil || "-"],
      ["Ocupación", dp.ocupacion || "-"],
      ["Contacto Emergencia", dp.contactoEmergenciaNombre ? `${dp.contactoEmergenciaNombre} (${dp.contactoEmergenciaTelefono})` : "-"],
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
      doc.setFontSize(14).setTextColor("#1e88e5").text(label, 15, y);
      y += 6;
      doc.setFontSize(12).setTextColor("#000").text(value || "-", 15, y, {
        maxWidth: pageWidth - 30,
      });
      y += doc.getTextDimensions(value || "-").h + 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    if (datos.cupsConNombre.length) {
      doc.setFontSize(14).setTextColor("#1e88e5").text("CUPS", 15, y);
      y += 6;
      datos.cupsConNombre.forEach(({ codigo, nombre }) => {
        doc.setFontSize(12).setTextColor("#000").text(`• ${codigo} - ${nombre}`, 15, y);
        y += 6;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
    }

    doc.setFontSize(10).setTextColor("gray").text("Generado por ViorClinic", 15, 290, { align: "center" });
    doc.save(`historia_clinica_${(dp.nombreCompleto || "paciente").replace(/\s+/g, "_")}.pdf`);
  };

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg dark:bg-gray-800">
        <div className="bg-blue-700 p-6 text-white rounded-t-xl">
          <h1 className="text-2xl font-bold">Historia Clínica</h1>
          {datos.datosPaciente.nombreCompleto && (
            <p className="text-blue-100">
              Paciente: {datos.datosPaciente.nombreCompleto}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} ref={formRef} className="p-6 space-y-4">
          <Select
            options={opcionesMotivoConsulta}
            value={opcionesMotivoConsulta.find(
              (opt) => opt.value === datos.motivoConsulta
            )}
            onChange={(opt) =>
              setDatos((prev) => ({ ...prev, motivoConsulta: opt.value }))
            }
          />
          <textarea
            name="antecedentes"
            className="w-full border rounded p-2"
            rows={2}
            value={datos.antecedentes}
            onChange={handleChange}
            placeholder="Antecedentes"
          />
          <textarea
            name="examenFisico"
            className="w-full border rounded p-2"
            rows={2}
            value={datos.examenFisico}
            onChange={handleChange}
            placeholder="Examen físico"
          />
          <AsyncSelect
            cacheOptions
            loadOptions={cargarDiagnosticos}
            onChange={handleDiagnosticoChange}
            placeholder="Buscar diagnóstico ICD-11"
          />
          <textarea
            name="tratamiento"
            className="w-full border rounded p-2"
            rows={2}
            value={datos.tratamiento}
            onChange={handleChange}
            placeholder="Tratamiento"
          />
          <textarea
            name="recomendaciones"
            className="w-full border rounded p-2"
            rows={2}
            value={datos.recomendaciones}
            onChange={handleChange}
            placeholder="Recomendaciones"
          />
          <Select
            isMulti
            options={cupsOpciones}
            getOptionLabel={(opt) => `${opt.codigo} - ${opt.nombre}`}
            getOptionValue={(opt) => opt.codigo}
            onChange={handleCupsChange}
            value={datos.cupsConNombre}
            placeholder="Seleccionar CUPS"
          />

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow"
            >
              Guardar historia clínica
            </button>
            <button
              type="button"
              onClick={exportarPDF}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded shadow"
            >
              Exportar PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
