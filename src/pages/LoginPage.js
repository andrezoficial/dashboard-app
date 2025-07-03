import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // importa tu contexto de auth
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado para modo "Olvidé mi contraseña"
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const { login } = useAuth(); // obtenemos la función login del contexto
  const navigate = useNavigate();

  // Función para login normal
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

  // Función para enviar solicitud de restablecer contraseña
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
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow bg-white dark:bg-gray-800">
      {!forgotPasswordMode ? (
        <>
          <h2 className="text-2xl mb-4 text-center font-semibold text-gray-900 dark:text-gray-100">Iniciar Sesión</h2>

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
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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
          <h2 className="text-2xl mb-4 text-center font-semibold text-gray-900 dark:text-gray-100">
            Restablecer contraseña
          </h2>

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
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
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
  );
}
