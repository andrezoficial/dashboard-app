import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:4000/api/pacientes"; // Ajusta si tienes otro puerto o URL

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
    eps: ""
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Cargar pacientes desde backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPacientes(data))
      .catch(() => setError("Error cargando pacientes"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editId) {
        // Actualizar paciente
        const res = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error actualizando paciente");
        }
        const actualizado = await res.json();
        setPacientes(pacientes.map(p => (p._id === editId ? actualizado : p)));
      } else {
        // Crear paciente
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error creando paciente");
        }
        const nuevo = await res.json();
        setPacientes([...pacientes, nuevo]);
      }

      setFormVisible(false);
      setFormData({
        nombreCompleto: "",
        tipoDocumento: "cc",
        numeroDocumento: "",
        sexo: "Masculino",
        correo: "",
        telefono: "",
        eps: ""
      });
      setEditId(null);
    } catch (err) {
      setError(err.message);
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
    setError("");
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.status === 204) {
        setPacientes(pacientes.filter(p => p._id !== id));
      } else {
        const data = await res.json();
        throw new Error(data.error || "Error eliminando paciente");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pacientes</h1>

      {error && <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</div>}

      <button
        onClick={() => {
          setFormVisible(true);
          setEditId(null);
          setFormData({
            nombreCompleto: "",
            tipoDocumento: "cc",
            numeroDocumento: "",
            sexo: "Masculino",
            correo: "",
            telefono: "",
            eps: ""
          });
          setError("");
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Agregar paciente
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-white">
          <div className="mb-2">
            <label className="block mb-1 font-semibold">Nombre completo</label>
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
            <label className="block mb-1 font-semibold">Tipo de documento</label>
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
            <label className="block mb-1 font-semibold">Número de documento</label>
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
            <th className="py-2 px-4 border-b">Nombre completo</th>
            <th className="py-2 px-4 border-b">Tipo documento</th>
            <th className="py-2 px-4 border-b">Número documento</th>
            <th className="py-2 px-4 border-b">Sexo</th>
            <th className="py-2 px-4 border-b">Correo</th>
            <th className="py-2 px-4 border-b">Teléfono</th>
            <th className="py-2 px-4 border-b">EPS</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{p.nombreCompleto}</td>
              <td className="py-2 px-4 border-b">{p.tipoDocumento}</td>
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
          {pacientes.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No hay pacientes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
