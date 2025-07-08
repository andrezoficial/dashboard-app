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
    cupsConNombre: [],
    nombrePaciente: "",
  });

  const [cupsOpciones, setCupsOpciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Para detalle de diagnóstico
  const [detalleDiagnostico, setDetalleDiagnostico] = useState(null);
  // Para preview PDF
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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

        // Opciones CUPS
        const cupsRes = await axios.get(`${API_BASE_URL}/cups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("👉 cupsRes.data:", cupsRes.data);
        
  
        const opciones = cupsRes.data.map((cup) => ({
          value: cup.codigo,
          label: `${cup.codigo} - ${cup.nombre}`,
        }));
        setCupsOpciones(opciones);
      } catch (err) {
        console.error(err);
        setError("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pacienteId]);useEffect(() => {
  if (!pacienteId) return;

  const token = localStorage.getItem("token");
  if (!token) {
    setError("No autorizado");
    setLoading(false);
    return;
  }

  async function fetchData() {
    try {
      // ✅ 1. Traer historia clínica (incluye cupsConNombre, etc.)
      const historiaRes = await axios.get(
        `${API_BASE_URL}/pacientes/${pacienteId}/historia`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (historiaRes.data) {
        setDatos((prev) => ({ ...prev, ...historiaRes.data }));
      }

      // ✅ 2. Traer opciones de CUPS ya formateadas desde el backend
      const cupsRes = await axios.get(`${API_BASE_URL}/cups`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Opciones CUPS recibidas:", cupsRes.data);

      // ⛔ NO necesitas hacer map, porque backend ya manda [{ value, label }]
      setCupsOpciones(cupsRes.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar la historia clínica o CUPS");
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [pacienteId]);


  // Cuando cambia diagnóstico, trae su detalle
  useEffect(() => {
    if (!datos.diagnostico) {
      setDetalleDiagnostico(null);
      return;
    }
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/cups/${datos.diagnostico}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDetalleDiagnostico(res.data))
      .catch(() => setDetalleDiagnostico(null));
  }, [datos.diagnostico]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleCupsChange = (selected) => {
    const nuevos = selected || [];
    const cups = nuevos.map((opt) => opt.value);
    const cupsConNombre = nuevos.map((opt) => {
      const [_code, ...rest] = opt.label.split(" - ");
      return { codigo: opt.value, nombre: rest.join(" - ") };
    });
    const antecedentes = cupsConNombre.map((c) => c.nombre).join(", ");
    setDatos((prev) => ({
      ...prev,
      cups,
      cupsConNombre,
      antecedentes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación
    if (!datos.diagnostico && datos.cups.length === 0) {
      return alert(
        "Debes seleccionar al menos un diagnóstico o procedimiento (CUPS)."
      );
    }
    // Confirmación
    if (!window.confirm("¿Seguro que deseas guardar la historia clínica?"))
      return;

    const token = localStorage.getItem("token");
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
      alert("Error al guardar");
    }
  };

  const exportarPDF = async () => {
    const input = formRef.current;
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    setPreviewImage(imgData);
    setShowPreview(true);
  };

  const generarPDFfinal = () => {
    if (!previewImage) return;
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (document
      .createElement("img")
      .height = 0); // dummy for typing
    pdf.addImage(previewImage, "PNG", 0, 20, pdfWidth, (canvasHeight) => {
      return (canvasHeight * pdfWidth) / pdfWidth;
    });
    pdf.save(
      `historia_clinica_${datos.nombrePaciente || "Paciente"}.pdf`
    );
    setShowPreview(false);
  };

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="space-y-4 p-4 bg-white rounded shadow-md dark:bg-gray-800"
      >
        <textarea
          name="motivoConsulta"
          placeholder="Motivo de consulta"
          value={datos.motivoConsulta}
          onChange={handleChange}
          rows={3}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />

        <textarea
          name="antecedentes"
          placeholder="Antecedentes (diagnósticos previos)"
          value={datos.antecedentes}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />

        <textarea
          name="examenFisico"
          placeholder="Examen físico"
          value={datos.examenFisico}
          onChange={handleChange}
          rows={3}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-white">
            Diagnóstico
          </label>
          <Select
            options={cupsOpciones}
            value={
              cupsOpciones.find((o) => o.value === datos.diagnostico) ||
              null
            }
            onChange={(sel) =>
              setDatos((p) => ({
                ...p,
                diagnostico: sel ? sel.value : "",
              }))
            }
            placeholder="Buscar diagnóstico..."
            isClearable
            className="text-black"
            formatOptionLabel={(opt) => (
              <div title={opt.label}>
                {opt.label}
              </div>
            )}
          />
          {detalleDiagnostico && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {detalleDiagnostico.descripcion}
            </p>
          )}
        </div>

        <textarea
          name="tratamiento"
          placeholder="Tratamiento"
          value={datos.tratamiento}
          onChange={handleChange}
          rows={3}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />

        <textarea
          name="recomendaciones"
          placeholder="Recomendaciones"
          value={datos.recomendaciones}
          onChange={handleChange}
          rows={3}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
            Procedimientos (CUPS)
          </label>
          <Select
            isMulti
            options={cupsOpciones}
            value={cupsOpciones.filter((o) =>
              datos.cups.includes(o.value)
            )}
            onChange={handleCupsChange}
            className="text-black"
            placeholder="Buscar y seleccionar CUPS..."
            formatOptionLabel={(opt) => (
              <div title={opt.label}>{opt.label}</div>
            )}
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
            Preview PDF
          </button>
        </div>
      </form>

      {/* Modal de Preview */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow p-4 max-w-lg w-full">
            <h2 className="text-xl mb-2">Vista previa PDF</h2>
            {previewImage && (
              <img src={previewImage} alt="Preview" className="w-full" />
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
              <button
                onClick={generarPDFfinal}
                className="px-4 py-2 rounded bg-green-600 text-white"
              >
                Generar y descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
