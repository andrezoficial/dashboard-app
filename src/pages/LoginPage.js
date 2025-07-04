import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logoVior from "../assets/logo-viorclinic.png";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo.trim() || !password.trim()) {
      toast.error("Correo y contraseña son obligatorios");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(correo)) {
      toast.error("Correo no es válido");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://backend-dashboard-v2.onrender.com/api/auth/login", {
        email: correo,
        password,
      });
      const { usuario, token } = res.data;
      login(usuario, token);
      toast.success("Login exitoso");
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!correo.trim()) {
      toast.error("Por favor ingresa tu correo");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(correo)) {
      toast.error("Correo no es válido");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://backend-dashboard-v2.onrender.com/api/auth/forgot-password", {
        email: correo,
      });
      toast.success("Revisa tu correo para restablecer tu contraseña");
      setForgotPasswordMode(false);
      setCorreo("");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Error enviando correo de recuperación"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-2xl w-full grid md:grid-cols-2">
        {/* Left info panel */}
        <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center text-center">
          <img src={logoVior} alt="ViorClinic Logo" className="h-20 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Bienvenido a ViorClinic</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Tu puerta digital a citas médicas rápidas, seguras y sin complicaciones.
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 mt-4 space-y-1">
            <li>📍 Reserva en minutos con especialistas certificados.</li>
            <li>🔒 Datos 100% protegidos con encriptación avanzada.</li>
            <li>⏱️ Olvida las esperas: agenda, gestiona y recibe recordatorios.</li>
          </ul>
          <p className="mt-4 italic text-blue-600 dark:text-blue-400">
            «Salud rápida, atención segura»
          </p>
        </div>

        {/* Right form panel */}
        <div className="p-6">
          {!forgotPasswordMode ? (
            <>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                Iniciar Sesión
              </h3>

              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full mb-3 p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                  disabled={loading}
                  required
                />

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                  disabled={loading}
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {loading ? "Cargando..." : "Ingresar"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordMode(true);
                    setPassword("");
                  }}
                  className="underline hover:text-blue-600"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                Restablecer contraseña
              </h3>

              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                  disabled={loading}
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {loading ? "Enviando..." : "Enviar enlace de restablecimiento"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(false)}
                  className="underline hover:text-blue-600"
                >
                  Volver al login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
