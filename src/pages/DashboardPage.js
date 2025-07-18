import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext"; // Ajusta la ruta según tu estructura

export default function DashboardPage() {
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [pacientesCount, setPacientesCount] = useState(0);
  const [citasCount, setCitasCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Usando tu contexto de tema existente
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuariosRes, pacientesRes, citasRes] = await Promise.all([
          fetch("https://backend-dashboard-v2.onrender.com/api/usuarios"),
          fetch("https://backend-dashboard-v2.onrender.com/api/pacientes"),
          fetch("https://backend-dashboard-v2.onrender.com/api/citas")
        ]);

        const usuariosData = await usuariosRes.json();
        const pacientesData = await pacientesRes.json();
        const citasData = await citasRes.json();

        setUsuariosCount(usuariosData.length);
        setPacientesCount(pacientesData.length);
        setCitasCount(citasData.length);
      } catch (error) {
        console.error("Error fetching data:", error);
        setUsuariosCount(0);
        setPacientesCount(0);
        setCitasCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Clases condicionales basadas en el modo oscuro
  const textColor = darkMode ? "text-gray-100" : "text-gray-800";
  const secondaryText = darkMode ? "text-gray-300" : "text-gray-600";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-indigo-300" : "text-indigo-800"}`}>
            Vior Clinic Dashboard
          </h1>
          <p className={secondaryText}>Resumen general del sistema</p>
        </header>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`${cardBg} p-6 rounded-xl shadow-sm animate-pulse ${borderColor}`}>
                <div className={`h-6 w-3/4 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded mb-4`}></div>
                <div className={`h-10 w-1/2 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Usuarios Card */}
            <div className={`${cardBg} p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all ${borderColor}`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className={`text-lg font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>
                  Usuarios Activos
                </h2>
                <div className={`p-2 rounded-lg ${darkMode ? "bg-blue-900" : "bg-blue-100"}`}>
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className={`text-4xl font-bold ${textColor}`}>{usuariosCount}</p>
              <p className={`text-sm ${secondaryText} mt-2`}>Total de usuarios registrados</p>
            </div>

            {/* Pacientes Card */}
            <div className={`${cardBg} p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-all ${borderColor}`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className={`text-lg font-semibold ${darkMode ? "text-green-300" : "text-gray-700"}`}>
                  Pacientes
                </h2>
                <div className={`p-2 rounded-lg ${darkMode ? "bg-green-900" : "bg-green-100"}`}>
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className={`text-4xl font-bold ${textColor}`}>{pacientesCount}</p>
              <p className={`text-sm ${secondaryText} mt-2`}>Pacientes atendidos</p>
            </div>

            {/* Citas Card */}
            <div className={`${cardBg} p-6 rounded-xl shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-all ${borderColor}`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className={`text-lg font-semibold ${darkMode ? "text-purple-300" : "text-gray-700"}`}>
                  Citas
                </h2>
                <div className={`p-2 rounded-lg ${darkMode ? "bg-purple-900" : "bg-purple-100"}`}>
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className={`text-4xl font-bold ${textColor}`}>{citasCount}</p>
              <p className={`text-sm ${secondaryText} mt-2`}>Citas programadas</p>
            </div>
          </div>
        )}

        {/* Additional Sections */}
        <div className={`mt-12 ${cardBg} p-6 rounded-xl shadow-sm ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textColor} mb-4`}>Actividad Reciente</h2>
          <div className={`text-center py-8 ${secondaryText}`}>
            <svg className={`mx-auto h-12 w-12 ${darkMode ? "text-gray-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2">Próximamente: Gráficos y actividad reciente</p>
          </div>
        </div>
      </div>
    </div>
  );
}