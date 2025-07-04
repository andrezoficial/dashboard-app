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
    diagnostico: "", // aquí guardaremos el código CUPS
    tratamiento: "",
    recomendaciones: "",
    cups: [],
    nombrePaciente: "",
  });

  const [cupsOpciones, setCupsOpciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Para mostrar el nombre legible del diagnóstico (basado en el código CUPS)
  const [diagnosticoNombre, setDiagnosticoNombre] = useState("");

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
        // 1. Obtener historia clínica
        const historiaRes = await axios.get(
          `${API_BASE_URL}/pacientes/${pacienteId}/historia`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 2. Obtener lista completa de CUPS para buscar nombres
        const cupsRes = await axios.get(`${API_BASE_URL}/cups`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const opciones = Array.isArray(cupsRes.data)
          ? cupsRes.data.map((cup) => ({
              value: cup.codigo,
              label: `${cup.codigo} - ${cup.nombre}`,
              nombre: cup.nombre,
            }))
          : [];

        setCupsOpciones(opciones);

        if (historiaRes.data) {
          // Aquí extraemos antecedentes: si tienes historial de diagnósticos previos, 
          // los puedes concatenar o usar directamente. Supondré que se guardan en "cups" o "diagnostico"

          // Si quieres mostrar todos los diagnósticos previos por nombre, hacemos:
          const codigosDiagnosticosPrevios = historiaRes.data.cups || [];

          // Buscar nombres en opciones CUPS
          const nombresDiagnosticos = codigosDiagnosticosPrevios
            .map((codigo) => {
              const cup = opciones.find((c) => c.value === codigo);
              return cup ? cup.nombre : null;
            })
            .filter(Boolean);

          const antecedentesTexto =
            nombresDiagnosticos.length > 0
              ? nombresDiagnosticos.join(", ")
              : historiaRes.data.antecedentes || "";

          // Para diagnóstico: si tienes un código guardado, mostrar nombre
          // Supongo que historiaRes.data.diagnostico guarda el código CUPS
          const diagCodigo = historiaRes.data.diagnostico;
          const diagCup = opciones.find((c) => c.value === diagCodigo);
          const diagNombre = diagCup ? diagCup.nombre : "";

          setDatos({
            ...historiaRes.data,
            antecedentes: antecedentesTexto,
            diagnostico: diagCodigo || "",
          });

          setDiagnosticoNombre(diagNombre);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar la historia clínica o CUPS");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [pacienteId]);

  // Cuando cambia diagnóstico, actualizamos estado y nombre para mostrar
  const handleDiagnosticoChange = (e) => {
    const valor = e.target.value;
    setDatos((prev) => ({ ...prev, diagnostico: valor }));

    // Buscar nombre si coincide código
    const cup = cupsOpciones.find((c) => c.value === valor);
    setDiagnosticoNombre(cup ? cup.nombre : "");
  };

  // Para los otros campos normales
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

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <form
      onSubmit={handleSubmit}
      ref={formRef}
      className="space-y-4 p-4 bg-white rounded shadow-md dark:bg-gray-800"
    >
      {/* Motivo consulta */}
      <textarea
        name="motivoConsulta"
        placeholder="Motivo de consulta"
        value={datos.motivoConsulta}
        onChange={handleChange}
        rows={3}
        required
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      {/* Antecedentes con diagnósticos previos o vacío */}
      <textarea
        name="antecedentes"
        placeholder="Antecedentes"
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

      {/* Diagnóstico: código CUPS pero mostramos nombre */}
      <div>
        <label
          htmlFor="diagnostico"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-white"
        >
          Diagnóstico (código CUPS)
        </label>
        <input
          id="diagnostico"
          name="diagnostico"
          type="text"
          placeholder="Código diagnóstico (ej. A123)"
          value={datos.diagnostico}
          onChange={handleDiagnosticoChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        {diagnosticoNombre && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Nombre: {diagnosticoNombre}
          </p>
        )}
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

      {/* Procedimientos (CUPS) multiselección */}
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

      <div className="mt-2">
        <h3 className="font-semibold text-gray-700 dark:text-white">CUPS seleccionados:</h3>
        {datos.cups.length > 0 ? (
          datos.cups.map((codigo) => {
            const cup = cupsOpciones.find((opt) => opt.value === codigo);
            return (
              <p key={codigo} className="text-gray-800 dark:text-gray-300">
                {cup ? cup.label : codigo}
              </p>
            );
          })
        ) : (
          <p className="italic text-gray-500 dark:text-gray-400">
            No hay procedimientos seleccionados
          </p>
        )}
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
