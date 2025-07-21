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
      alert("Historia clínica guardada correctamente");
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

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md mx-auto mt-8">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Historia Clínica</h1>
              {datos.datosPaciente.nombreCompleto && (
                <p className="text-blue-100 mt-1">
                  Paciente: <span className="font-medium">{datos.datosPaciente.nombreCompleto}</span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={exportarPDF}
              className="bg-white text-blue-700 hover:bg-gray-100 py-2 px-4 rounded-lg shadow-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} ref={formRef} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Motivo de consulta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de consulta</label>
              <Select
                options={opcionesMotivoConsulta}
                value={opcionesMotivoConsulta.find(
                  (opt) => opt.value === datos.motivoConsulta
                )}
                onChange={(opt) =>
                  setDatos((prev) => ({ ...prev, motivoConsulta: opt.value }))
                }
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* Antecedentes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Antecedentes</label>
              <textarea
                name="antecedentes"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={datos.antecedentes}
                onChange={handleChange}
                placeholder="Ingrese los antecedentes del paciente"
              />
            </div>

            {/* Examen físico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Examen físico</label>
              <textarea
                name="examenFisico"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={datos.examenFisico}
                onChange={handleChange}
                placeholder="Describa el examen físico realizado"
              />
            </div>

            {/* Diagnóstico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico (ICD-11)</label>
              <AsyncSelect
                cacheOptions
                loadOptions={cargarDiagnosticos}
                onChange={handleDiagnosticoChange}
                placeholder="Buscar diagnóstico ICD-11 (escriba al menos 3 caracteres)"
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={({ inputValue }) =>
                  inputValue.length < 3
                    ? "Escriba al menos 3 caracteres para buscar"
                    : "No se encontraron resultados"
                }
              />
            </div>

            {/* Tratamiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento</label>
              <textarea
                name="tratamiento"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={datos.tratamiento}
                onChange={handleChange}
                placeholder="Describa el tratamiento indicado"
              />
            </div>

            {/* Recomendaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recomendaciones</label>
              <textarea
                name="recomendaciones"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={datos.recomendaciones}
                onChange={handleChange}
                placeholder="Ingrese las recomendaciones para el paciente"
              />
            </div>

            {/* CUPS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Procedimientos (CUPS)</label>
              <Select
                isMulti
                options={cupsOpciones}
                getOptionLabel={(opt) => `${opt.codigo} - ${opt.nombre}`}
                getOptionValue={(opt) => opt.codigo}
                onChange={handleCupsChange}
                value={datos.cupsConNombre}
                placeholder="Seleccione los procedimientos realizados"
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Guardar historia clínica
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}