import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      fetch(`${API_BASE_URL}/pacientes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al actualizar paciente");
          return res.json();
        })
        .then((updatedPaciente) => {
          setPacientes(
            pacientes.map((p) => (p._id === editId ? updatedPaciente : p))
          );
          toast.success("Paciente actualizado correctamente");
          resetForm();
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      fetch(`${API_BASE_URL}/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al crear paciente");
          return res.json();
        })
        .then((nuevoPaciente) => {
          setPacientes([...pacientes, nuevoPaciente]);
          toast.success("Paciente creado exitosamente");
          resetForm();
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  const handleEdit = (paciente) => {
    setFormData({
      nombreCompleto: paciente.nombreCompleto,
      tipoDocumento: paciente.tipoDocumento,
      numeroDocumento: paciente.numeroDocumento,
      sexo: paciente.sexo,
      correo: paciente.correo,
      telefono: paciente.telefono,
      eps: paciente.eps,
    });
    setEditId(paciente._id);
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este paciente?")) return;

    fetch(`${API_BASE_URL}/pacientes/${id}`, {
      method: "DELETE",
    })
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
    <div className="w-full max-w-5xl p-4 mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4">Pacientes</h1>

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
            className="mb-6 p-4 border rounded bg-white grid gap-4 sm:grid-cols-2"
          >
            {[ 
              { label: "Nombre Completo", name: "nombreCompleto", type: "text" },
              { label: "Número de Documento", name: "numeroDocumento", type: "text" },
              { label: "Correo", name: "correo", type: "email" },
              { label: "Teléfono", name: "telefono", type: "text" },
              { label: "EPS", name: "eps", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block font-semibold mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            ))}

            <div>
              <label className="block font-semibold mb-1">Tipo de Documento</label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
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
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

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

      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              {[
                "Nombre Completo",
                "Tipo Documento",
                "Número Documento",
                "Sexo",
                "Correo",
                "Teléfono",
                "EPS",
                "Acciones",
              ].map((title) => (
                <th key={title} className="py-2 px-4 border-b font-medium">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pacientes.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No hay pacientes.
                </td>
              </tr>
            ) : (
              pacientes.map((p) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  className="hover:bg-gray-50"
                >
                  <td className="py-2 px-4 border-b break-words">{p.nombreCompleto}</td>
                  <td className="py-2 px-4 border-b break-words">{p.tipoDocumento.toUpperCase()}</td>
                  <td className="py-2 px-4 border-b break-words">{p.numeroDocumento}</td>
                  <td className="py-2 px-4 border-b break-words">{p.sexo}</td>
                  <td className="py-2 px-4 border-b break-words">{p.correo}</td>
                  <td className="py-2 px-4 border-b break-words">{p.telefono}</td>
                  <td className="py-2 px-4 border-b break-words">{p.eps}</td>
                  <td className="py-2 px-4 border-b whitespace-nowrap flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
