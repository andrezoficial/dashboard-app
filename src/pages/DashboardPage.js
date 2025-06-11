import React from "react";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Bienvenido al Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-blue-600">Usuarios Activos</h2>
          <p className="text-3xl font-bold text-gray-800">1,245</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-green-600">Ventas</h2>
          <p className="text-3xl font-bold text-gray-800">$12,340</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-purple-600">Nuevos Registros</h2>
          <p className="text-3xl font-bold text-gray-800">58</p>
        </div>
      </div>
    </div>
  );
}
