import React, { useState, useEffect } from "react";

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", telefono: "", email: "" });
  const [editId, setEditId] = useState(null);

  // Simulación de carga de datos (aquí llamas a la API)
  useEffect(() => {
    // TODO: fetch pacientes desde backend
    setPacientes([
      { id: 1, nombre: "Juan Perez", telefono: "123456789", email: "juan@mail.com" },
      { id: 2, nombre: "Ana Gomez", telefono: "987654321", email: "ana@mail.com" },
    ]);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(editId) {
      // TODO: llamar API para actualizar paciente
      setPacientes(pacientes.map(p => p.id === editId ? { ...p, ...formData } : p));
    } else {
      // TODO: llamar API para crear paciente
      const newPaciente = { id: Date.now(), ...formData };
      setPacientes([...pacientes, newPaciente]);
    }
    setFormVisible(false);
    setFormData({ nombre: "", telefono: "", email: "" });
    setEditId(null);
  };

  const handleEdit = (paciente) => {
    setFormData({ nombre: paciente.nombre, telefono: paciente.telefono, email: paciente.email });
    setEditId(paciente.id);
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    // TODO: llamar API para eliminar paciente
    setPacientes(pacientes.filter(p => p.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pacientes</h1>

      <button
        onClick={() => { setFormVisible(true); setEditId(null); setFormData({ nombre: "", telefono: "", email: "" }); }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Agregar paciente
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-white">
          <div className="mb-2">
            <label className="block mb-1 font-semibold">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
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
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Teléfono</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{p.nombre}</td>
              <td className="py-2 px-4 border-b">{p.telefono}</td>
              <td className="py-2 px-4 border-b">{p.email}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(p)}
                  className="mr-2 text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {pacientes.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">No hay pacientes.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
