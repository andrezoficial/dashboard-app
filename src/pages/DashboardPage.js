import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [pacientesCount, setPacientesCount] = useState(0);
  const [citasCount, setCitasCount] = useState(0);

  useEffect(() => {
    fetch("https://backend-dashboard-v2.onrender.com/api/usuarios")
      .then(res => res.json())
      .then(data => setUsuariosCount(data.length))
      .catch(() => setUsuariosCount(0));

    fetch("https://backend-dashboard-v2.onrender.com/api/pacientes")
      .then(res => res.json())
      .then(data => setPacientesCount(data.length))
      .catch(() => setPacientesCount(0));

    fetch("https://backend-dashboard-v2.onrender.com/api/citas")
      .then(res => res.json())
      .then(data => setCitasCount(data.length))
      .catch(() => setCitasCount(0));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Vior Clinic</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-blue-600">Usuarios Activos</h2>
          <p className="text-3xl font-bold text-gray-800">{usuariosCount}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-green-600">Pacientes</h2>
          <p className="text-3xl font-bold text-gray-800">{pacientesCount}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-purple-600">Citas</h2>
          <p className="text-3xl font-bold text-gray-800">{citasCount}</p>
        </div>
      </div>
    </div>
  );
}
