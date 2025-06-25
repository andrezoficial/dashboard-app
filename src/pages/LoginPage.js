import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // importa tu contexto de auth
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // obtenemos la función login del contexto
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
      const res = axios.post("https://backend-dashboard-v2.onrender.com/api/auth/login", {
        email: correo,
        password,
      });

      // El backend responde con { user, token }
      const { usuario, token } = res.data;

      // Guardamos en contexto
     login(usuario, token);

      toast.success("Login exitoso");

      // Redirigir a dashboard
      navigate("/dashboard");
    } catch (error) {
      toast.error("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 border rounded shadow"
    >
      <h2 className="text-2xl mb-4 text-center font-semibold">Iniciar Sesión</h2>

      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Cargando..." : "Ingresar"}
      </button>
    </form>
  );
}
