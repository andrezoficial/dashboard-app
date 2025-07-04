import React from "react";
import { Link } from "react-router-dom";
import logo from "../logo-viorclinic.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow">
        <div className="flex items-center gap-2">
          <img src={logo} alt="ViorClinic Logo" className="h-10" />
          <h1 className="text-xl font-bold text-blue-600">ViorClinic</h1>
        </div>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Iniciar sesión
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-blue-50">
        <div className="max-w-xl mb-10 md:mb-0">
          <h2 className="text-4xl font-bold text-blue-800 mb-6">
            Tu puerta digital a citas médicas rápidas, seguras y sin complicaciones.
          </h2>
          <ul className="text-lg space-y-4">
            <li>📍 Reserva en minutos con especialistas certificados.</li>
            <li>🔒 Datos 100% protegidos con encriptación avanzada.</li>
            <li>⏱️ Olvida las esperas: agenda, gestiona y recibe recordatorios.</li>
          </ul>
          <p className="mt-6 italic text-gray-600">«Salud rápida, atención segura»</p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1588776814546-d98059e7b63c"
          alt="Ilustración médica"
          className="w-full max-w-md rounded shadow-lg"
        />
      </section>

      {/* Beneficios */}
      <section className="px-6 md:px-20 py-12 bg-white">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">¿Por qué elegir ViorClinic?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2 text-blue-600">Agenda Inteligente</h4>
            <p>Automatiza la gestión de citas y minimiza cancelaciones y tiempos muertos.</p>
          </div>
          <div className="p-6 rounded shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2 text-blue-600">Control Total</h4>
            <p>Panel administrativo intuitivo para supervisar pacientes, citas y especialistas.</p>
          </div>
          <div className="p-6 rounded shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2 text-blue-600">Privacidad Garantizada</h4>
            <p>Encriptación avanzada y cumplimiento de normas de protección de datos.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-20 py-12 bg-blue-600 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">¿Listo para transformar tu clínica?</h3>
        <p className="mb-6">Comienza hoy mismo con una solución confiable y segura.</p>
        <Link
          to="/login"
          className="bg-white text-blue-600 px-6 py-3 rounded shadow hover:bg-gray-100 transition"
        >
          Acceder al sistema
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center text-sm py-4 text-gray-600">
        © {new Date().getFullYear()} ViorClinic — Todos los derechos reservados.
      </footer>
    </div>
  );
}
