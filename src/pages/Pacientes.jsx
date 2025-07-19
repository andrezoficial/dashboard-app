import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import GraficoCitas from "../components/GraficoCitas";

const API_BASE_URL = "https://backend-dashboard-v2.onrender.com/api";

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    tipoDocumento: "cc",
    numeroDocumento: "",
    sexo: "Masculino",
    correo: "",
    telefono: "",
    eps: "",
    fechaNacimiento: "",
    direccion: "",
    estadoCivil: "Soltero(a)",
    ocupacion: "",
    contactoEmergenciaNombre: "",
    contactoEmergenciaTelefono: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/pacientes`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar pacientes");
        return res.json();
      })
      .then((data) => setPacientes(data))
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormVisible(false);
    setFormData({
      nombreCompleto: "",
      tipoDocumento: "cc",
      numeroDocumento: "",
      sexo: "Masculino",
      correo: "",
      telefono: "",
      eps: "",
      fechaNacimiento: "",
      direccion: "",
      estadoCivil: "Soltero(a)",
      ocupacion: "",
      contactoEmergenciaNombre: "",
      contactoEmergenciaTelefono: "",
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editId
      ? `${API_BASE_URL}/pacientes/${editId}`
      : `${API_BASE_URL}/pacientes`;
    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error(
            editId
              ? "Error al actualizar paciente"
              : "Error al crear paciente"
          );
        return res.json();
      })
      .then((paciente) => {
        if (editId) {
          setPacientes(pacientes.map((p) => (p._id === editId ? paciente : p)));
          toast.success("Paciente actualizado correctamente");
        } else {
          setPacientes([...pacientes, paciente]);
          toast.success("Paciente creado exitosamente");
        }
        resetForm();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleEdit = (paciente) => {
    setFormData({ ...paciente });
    setEditId(paciente._id);
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este paciente?")) return;

    fetch(`${API_BASE_URL}/pacientes/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar paciente");
        setPacientes(pacientes.filter((p) => p._id !== id));
        toast.success("Paciente eliminado correctamente");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 text-gray-900 dark:text-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-xl sm:text-2xl font-bold mb-4">Pacientes</h1>
      <GraficoCitas />
      <div className="mb-6 p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-2 text-center">Estadísticas de citas</h2>
        <GraficoCitas />
      </div>

      <button
        onClick={() => {
          resetForm();
          setFormVisible(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Agregar paciente
      </button>

      <AnimatePresence>
        {formVisible && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 grid gap-4 grid-cols-1 sm:grid-cols-2"
          >
            {/* Campos existentes */}
            {[
              { label: "Nombre Completo", name: "nombreCompleto", type: "text" },
              { label: "Número de Documento", name: "numeroDocumento", type: "text" },
              { label: "Correo", name: "correo", type: "email" },
              { label: "Teléfono", name: "telefono", type: "text" },
              { label: "EPS", name: "eps", type: "text" },
              { label: "Fecha de Nacimiento", name: "fechaNacimiento", type: "date" },
              { label: "Dirección", name: "direccion", type: "text" },
              { label: "Ocupación", name: "ocupacion", type: "text" },
              { label: "Contacto de Emergencia - Nombre", name: "contactoEmergenciaNombre", type: "text" },
              { label: "Contacto de Emergencia - Teléfono", name: "contactoEmergenciaTelefono", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block font-semibold mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={name !== "ocupacion" && name !== "direccion" && !name.startsWith("contacto")}
                  className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
            ))}

            {/* Selects */}
            <div>
              <label className="block font-semibold mb-1">Tipo de Documento</label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="cc">CC</option>
                <option value="ti">TI</option>
                <option value="ce">CE</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Sexo</label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Estado Civil</label>
              <select
                name="estadoCivil"
                value={formData.estadoCivil}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="Soltero(a)">Soltero(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Unión libre">Unión libre</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viudo(a)">Viudo(a)</option>
              </select>
            </div>

            {/* Botones */}
            <div className="col-span-full flex flex-col sm:flex-row gap-2 mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex-1"
              >
                {editId ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={() => setFormVisible(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex-1"
              >
                Cancelar
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Lista responsive para móviles */}
      <div className="grid gap-4 sm:hidden">
        {pacientes.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No hay pacientes.</p>
        ) : (
          pacientes.map((p) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow p-4 space-y-1"
            >
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-400">{p.nombreCompleto}</h2>
              <p><strong>Documento:</strong> {p.tipoDocumento.toUpperCase()} - {p.numeroDocumento}</p>
              <p><strong>Correo:</strong> {p.correo}</p>
              <p><strong>Teléfono:</strong> {p.telefono}</p>
              <p><strong>EPS:</strong> {p.eps}</p>
              <p><strong>Sexo:</strong> {p.sexo}</p>
              <p><strong>Fecha de nacimiento:</strong> {p.fechaNacimiento}</p>
              <p><strong>Dirección:</strong> {p.direccion}</p>
              <p><strong>Estado Civil:</strong> {p.estadoCivil}</p>
              <p><strong>Ocupación:</strong> {p.ocupacion}</p>
              <p><strong>Contacto emergencia:</strong> {p.contactoEmergenciaNombre} - {p.contactoEmergenciaTelefono}</p>
              <div className="flex gap-4 mt-2">
                <button onClick={() => handleEdit(p)} className="text-blue-600 dark:text-blue-400 hover:underline">
                  Editar
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline">
                  Eliminar
                </button>
                <Link to={`/dashboard/pacientes/${p._id}/historia-clinica`} className="text-green-600 hover:underline">
                  Historia Clínica
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Tabla para escritorio */}
      <div className="hidden sm:block overflow-x-auto rounded border bg-white dark:bg-gray-900 dark:border-gray-700 mt-4">
        <table className="min-w-[920px] w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left text-gray-900 dark:text-gray-100">
            <tr>
              {[
                "Nombre Completo",
                "Tipo Documento",
                "Número Documento",
                "Sexo",
                "Correo",
                "Teléfono",
                "EPS",
                "Fecha Nacimiento",
                "Dirección",
                "Estado Civil",
                "Ocupación",
                "Contacto Emergencia",
                "Acciones",
              ].map((title) => (
                <th key={title} className="py-2 px-4 border-b dark:border-gray-700 font-medium">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <motion.tr
                key={p._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="py-2 px-4 border-b dark:border-gray-700">{p.nombreCompleto}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{p.tipoDocumento.toUpperCase()}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{p.numeroDocumento}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{p.sexo}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{p.correo}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{p.telefono}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{p.eps}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{p.fechaNacimiento}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{p.direccion}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{p.estadoCivil}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{p.ocupacion}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  {p.contactoEmergenciaNombre} - {p.contactoEmergenciaTelefono}
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700 whitespace-nowrap flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 dark:text-blue-400 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                  <Link to={`/dashboard/pacientes/${p._id}/historia-clinica`} className="text-green-600 hover:underline">
                    Historia Clínica
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
