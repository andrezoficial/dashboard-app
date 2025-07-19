import React, { useState, useEffect } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "https://backend-dashboard-v2.onrender.com/api";

export default function FormularioHistoriaClinica() {
  const [datos, setDatos] = useState({
    pacienteId: "",
    motivoConsulta: "",
    antecedentes: "",
    diagnostico: "", // campo para diagnóstico manual seleccionado
    codigoDiagnostico: "",
    nombreDiagnostico: "",
    tratamiento: "",
    cups: [],
  });

  const [pacientes, setPacientes] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [cups, setCups] = useState([]);

  // Estados para búsqueda manual ICD-11 integrada
  const [terminoICD, setTerminoICD] = useState("");
  const [resultadosICD, setResultadosICD] = useState([]);
  const [loadingICD, setLoadingICD] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        const [pacientesRes, motivosRes, cupsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/pacientes`, config),
          axios.get(`${API_BASE_URL}/motivos`, config),
          axios.get(`${API_BASE_URL}/cups`, config),
        ]);

        setPacientes(pacientesRes.data);
        setMotivos(motivosRes.data);
        setCups(cupsRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, []);

  const cargarDiagnosticos = async (inputValue) => {
    if (!inputValue || inputValue.length < 3) return [];

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${API_BASE_URL}/icd11/buscar`,
        {
          params: { termino: inputValue },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data.map(item => ({
        value: item.code,
        label: `${item.code} - ${item.title}`,
      }));
    } catch (error) {
      console.error("Error cargando diagnósticos ICD-11:", error);
      return [];
    }
  };

  // Función para buscar ICD-11 manualmente con botón
  const buscarDiagnosticoICD = async () => {
    if (!terminoICD.trim()) return;
    try {
      setLoadingICD(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/icd11/buscar`,
        {
          params: { termino: terminoICD },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResultadosICD(res.data);
    } catch (error) {
      console.error("Error al buscar diagnóstico ICD-11:", error.message);
      toast.error("Error al buscar diagnóstico ICD-11");
    } finally {
      setLoadingICD(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/historia-clinica`, datos, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Historia clínica guardada correctamente");
    } catch (error) {
      console.error("Error al guardar historia clínica:", error);
      toast.error("Error al guardar historia clínica");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label>Paciente:</label>
        <Select
          options={pacientes.map((p) => ({
            value: p._id,
            label: `${p.nombre} - ${p.correo}`,
          }))}
          onChange={(selected) =>
            setDatos({ ...datos, pacienteId: selected.value })
          }
        />
      </div>

      <div className="mb-4">
        <label>Motivo de consulta:</label>
        <Select
          options={motivos.map((m) => ({
            value: m.nombre,
            label: m.nombre,
          }))}
          onChange={(selected) =>
            setDatos({ ...datos, motivoConsulta: selected.value })
          }
        />
      </div>

      <div className="mb-4">
        <label>Antecedentes:</label>
        <textarea
          className="w-full border rounded"
          value={datos.antecedentes}
          onChange={(e) =>
            setDatos({ ...datos, antecedentes: e.target.value })
          }
        />
      </div>

      {/* Campo AsyncSelect original para diagnóstico ICD-11 */}
      <div className="mb-4">
        <label>Diagnóstico (ICD-11) - Búsqueda instantánea:</label>
        <AsyncSelect
          cacheOptions
          loadOptions={cargarDiagnosticos}
          defaultOptions={false}
          onChange={(selected) =>
            setDatos((prev) => ({
              ...prev,
              codigoDiagnostico: selected?.value || "",
              nombreDiagnostico: selected?.label?.split(" - ")[1] || "",
              diagnostico: selected?.label || "", // guardar texto completo
            }))
          }
          value={
            datos.codigoDiagnostico
              ? {
                  value: datos.codigoDiagnostico,
                  label: `${datos.codigoDiagnostico} - ${datos.nombreDiagnostico}`,
                }
              : null
          }
        />
      </div>

      {/* NUEVO: Búsqueda manual con input y botón */}
      <div className="mb-4 border p-2 rounded">
        <label className="font-bold mb-2 block">Buscar diagnóstico (ICD-11) manual:</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={terminoICD}
            onChange={(e) => setTerminoICD(e.target.value)}
            placeholder="Ej: diabetes, asma, hipertensión..."
            className="border px-3 py-1 rounded w-full"
          />
          <button
            type="button"
            onClick={buscarDiagnosticoICD}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Buscar
          </button>
        </div>

        {loadingICD && <p>Buscando diagnósticos...</p>}

        <ul className="list-disc ml-6 space-y-1 max-h-40 overflow-y-auto">
          {resultadosICD.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                setDatos((prev) => ({
                  ...prev,
                  diagnostico: `${item.code} - ${item.title}`,
                  codigoDiagnostico: item.code,
                  nombreDiagnostico: item.title,
                }));
                setResultadosICD([]);
                setTerminoICD("");
              }}
              className="cursor-pointer hover:bg-gray-100 p-1 rounded"
            >
              <strong>{item.code}</strong>: {item.title}
            </li>
          ))}
        </ul>

        {/* Mostrar campo diagnóstico manual (solo lectura) */}
        <input
          type="text"
          name="diagnostico"
          value={datos.diagnostico}
          readOnly
          className="border px-3 py-1 rounded w-full mt-2 bg-gray-100"
          placeholder="Diagnóstico seleccionado"
        />
      </div>

      <div className="mb-4">
        <label>Tratamiento:</label>
        <textarea
          className="w-full border rounded"
          value={datos.tratamiento}
          onChange={(e) =>
            setDatos({ ...datos, tratamiento: e.target.value })
          }
        />
      </div>

      <div className="mb-4">
        <label>Procedimientos (CUPS):</label>
        <Select
          isMulti
          options={cups}
          onChange={(selected) =>
            setDatos({ ...datos, cups: selected.map((s) => s.value) })
          }
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar historia clínica
      </button>
    </form>
  );
}
