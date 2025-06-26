import React, { useState, useEffect } from "react";

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

  // Cargar pacientes desde el backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/pacientes`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar pacientes");
        return res.json();
      })
      .then((data) => setPacientes(data))
      .catch((error) => alert(error.message));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      // Actualizar paciente
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
          resetForm();
        })
        .catch((error) => alert(error.message));
    } else {
      // Crear nuevo paciente
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
          resetForm();
        })
        .catch((error) => alert(error.message));
    }
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
        // Eliminar del estado local
        setPacientes(pacientes.filter((p) => p._id !== id));
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div>
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

      {formVisible && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-white">
          <div className="mb-2">
            <label className="block mb-1 font-semibold">Nombre Completo</label>
            <input
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-semibold">Tipo de Documento</label>
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

          <div className="mb-2">
            <label className="block mb-1 font-semibold">Número de Documento</label>
            <input
              type="text"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-semibold">Sexo</label>
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

          <div className="mb-2">
            <label className="block mb-1 font-semibold">Correo</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-semibold">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-semibold">EPS</label>
            <input
              type="text"
              name="eps"
              value={formData.eps}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {editId ? "Actualizar" : "Crear"}
          </button>
          <button
            type="button"
            onClick={() => setFormVisible(false)}
            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        </form>
      )}

      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Nombre Completo</th>
            <th className="py-2 px-4 border-b">Tipo Documento</th>
            <th className="py-2 px-4 border-b">Número Documento</th>
            <th className="py-2 px-4 border-b">Sexo</th>
            <th className="py-2 px-4 border-b">Correo</th>
            <th className="py-2 px-4 border-b">Teléfono</th>
            <th className="py-2 px-4 border-b">EPS</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No hay pacientes.
              </td>
            </tr>
          )}
          {pacientes.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{p.nombreCompleto}</td>
              <td className="py-2 px-4 border-b">{p.tipoDocumento.toUpperCase()}</td>
              <td className="py-2 px-4 border-b">{p.numeroDocumento}</td>
              <td className="py-2 px-4 border-b">{p.sexo}</td>
              <td className="py-2 px-4 border-b">{p.correo}</td>
              <td className="py-2 px-4 border-b">{p.telefono}</td>
              <td className="py-2 px-4 border-b">{p.eps}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(p)}
                  className="mr-2 text-blue-600 hover:underline"
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
