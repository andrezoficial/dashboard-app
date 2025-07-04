import React from "react";
import { Link } from "react-router-dom";
import logo from "../logo-viorclinic.png";
import ilustracion from '../ilustracion.png';
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 shadow-md bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={logo} alt="ViorClinic Logo" className="h-12" />
          <h1 className="text-2xl font-extrabold text-blue-700 tracking-wide select-none">
            ViorClinic
          </h1>
        </div>
        <Link
          to="/login"
          className="bg-blue-700 text-white px-5 py-2 rounded-md font-semibold shadow-md hover:bg-blue-800 transition"
        >
          Iniciar sesión
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-24 py-20 bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-xl space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight text-blue-900">
            Tu puerta digital a citas médicas rápidas, seguras y sin complicaciones.
          </h2>
          <ul className="text-xl space-y-4 text-gray-700">
            <li>📍 Reserva en minutos con especialistas certificados.</li>
            <li>🔒 Datos 100% protegidos con encriptación avanzada.</li>
            <li>⏱️ Olvida las esperas: agenda, gestiona y recibe recordatorios.</li>
          </ul>
          <p className="mt-4 italic text-gray-600 font-medium">«Salud rápida, atención segura»</p>
          <Link
            to="/login"
            className="inline-block mt-6 bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-800 transition-transform transform hover:-translate-y-1"
          >
            Acceder al sistema
          </Link>
        </div>
        <img
        src={ilustracion}
         alt="Ilustración médica"
            className="w-full max-w-lg rounded-xl shadow-2xl object-cover"
         loading="lazy"
          />
      </section>

      {/* Beneficios */}
      <section className="px-8 md:px-24 py-16 bg-white">
        <h3 className="text-4xl font-bold text-center text-blue-900 mb-14 tracking-wide">
          ¿Por qué elegir ViorClinic?
        </h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-tr from-blue-100 to-blue-50">
            <h4 className="text-2xl font-semibold mb-4 text-blue-700">Agenda Inteligente</h4>
            <p className="text-gray-800 leading-relaxed">
              Automatiza la gestión de citas y minimiza cancelaciones y tiempos muertos.
            </p>
          </div>
          <div className="p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-tr from-green-100 to-green-50">
            <h4 className="text-2xl font-semibold mb-4 text-green-700">Control Total</h4>
            <p className="text-gray-800 leading-relaxed">
              Panel administrativo intuitivo para supervisar pacientes, citas y especialistas.
            </p>
          </div>
          <div className="p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-tr from-purple-100 to-purple-50">
            <h4 className="text-2xl font-semibold mb-4 text-purple-700">Privacidad Garantizada</h4>
            <p className="text-gray-800 leading-relaxed">
              Encriptación avanzada y cumplimiento de normas de protección de datos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-24 py-16 bg-blue-700 text-white text-center rounded-t-3xl shadow-lg">
        <h3 className="text-4xl font-extrabold mb-5 tracking-wide">¿Listo para transformar tu clínica?</h3>
        <p className="max-w-xl mx-auto mb-8 text-lg font-medium leading-relaxed">
          Comienza hoy mismo con una solución confiable y segura.
        </p>
        <Link
          to="/login"
          className="inline-block bg-white text-blue-700 px-10 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:bg-gray-100 transition"
        >
          Acceder al sistema
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 text-center py-6 mt-auto border-t border-gray-300">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <span className="text-sm select-none">© {new Date().getFullYear()} ViorClinic — Todos los derechos reservados.</span>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/andrezoficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-700 hover:text-blue-700 transition"
            >
              <FaGithub size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/andres-suarez-653a44142/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-700 hover:text-blue-700 transition"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href="mailto:andres.suarez@example.com"
              aria-label="Email"
              className="text-gray-700 hover:text-blue-700 transition"
            >
              <FaEnvelope size={22} />
            </a>
            <span className="ml-2 text-sm font-semibold select-none">Andrés Suárez</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
