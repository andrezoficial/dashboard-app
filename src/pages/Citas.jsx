import React, { useEffect, useState } from "react";

const mockPacientes = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "Ana López" },
];

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [form, setForm] = useState({
    id: null,
    pacienteId: "",
    fecha: "",
    hora: "",
    estado: "pendiente",
  });

  useEffect(() => {
    // Simulación de llamada a API
    const mockCitas = [
      {
        id: 1,
        pacienteId: 1,
        fecha: "2025-06-15",
        hora: "10:00",
        estado: "confirmada",
      },
      {
        id: 2,
        pacienteId: 2,
        fecha: "2025-06-16",
        hora: "11:30",
        estado: "pendiente",
      },
    ];
    setCitas(mockCitas);
  }, []);

  const getNombrePaciente = (id) => {
    const paciente = mockPacientes.find((p) => p.id === Number(id));
    return paciente ? paciente.nombre : "Desconocido";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.id) {
      // Editar
      setCitas((prev) =>
        prev.map((c) => (c.id === form.id ? form : c))
      );
    } else {
      // Crear
      const nuevaCita = {
        ...form,
        id: Date.now(),
      };
      setCitas((prev) => [...prev, nuevaCita]);
    }
    setForm({ id: null, pacienteId: "", fecha: "", hora: "", estado: "pendiente" });
  };

  const handleEdit = (cita) => {
    setForm(cita);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Cancelar esta cita?")) {
  setCitas((prev) => prev.filter((c) => c.id !== id));
}
  };

  const citasFiltradas = citas.filter((cita) => {
    const paciente = getNombrePaciente(cita.pacienteId).toLowerCase();
    return paciente.includes(filtro.toLowerCase());
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Citas</h1>

      {/* Filtro */}
      <input
        type="text"
        placeholder="Buscar por paciente"
        className="border p-2 mb-4 w-full md:w-1/2"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {/* Tabla */}
      <table className="w-full table-auto border border-collapse mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Paciente</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Hora</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citasFiltradas.map((cita) => (
            <tr key={cita.id}>
              <td className="border p-2">{getNombrePaciente(cita.pacienteId)}</td>
              <td className="border p-2">{cita.fecha}</td>
              <td className="border p-2">{cita.hora}</td>
              <td className="border p-2">{cita.estado}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(cita)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cita.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario */}
      <h2 className="text-xl font-semibold mb-2">
        {form.id ? "Editar Cita" : "Nueva Cita"}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          required
          value={form.pacienteId}
          onChange={(e) => setForm({ ...form, pacienteId: e.target.value })}
          className="border p-2"
        >
          <option value="">Seleccionar paciente</option>
          {mockPacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        <input
          type="date"
          required
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          className="border p-2"
        />
        <input
          type="time"
          required
          value={form.hora}
          onChange={(e) => setForm({ ...form, hora: e.target.value })}
          className="border p-2"
        />
        <select
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value })}
          className="border p-2"
        >
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
        >
          {form.id ? "Actualizar Cita" : "Crear Cita"}
        </button>
      </form>
    </div>
  );
}
