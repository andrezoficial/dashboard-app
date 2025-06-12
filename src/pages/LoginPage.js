import React, { useState } from "react";
import { toast } from "react-toastify";

export default function LoginPage({ onLoginSuccess }) {
  // Estados para almacenar valores del formulario
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Para mostrar que está cargando

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Para evitar que la página se recargue

    // Validar que los campos no estén vacíos
    if (!correo.trim() || !password.trim()) {
      toast.error("Correo y contraseña son obligatorios");
      return;
    }

    // Validar formato de correo con expresión regular simple
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(correo)) {
      toast.error("Correo no es válido");
      return;
    }

    setLoading(true); // Mostrar que está enviando

    try {
      // Aquí iría la llamada real a tu API, por ahora simulamos una espera
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulación de validación de usuario
      if (correo === "admin@admin.com" && password === "admin123") {
        toast.success("Login exitoso");
        // Este callback se ejecuta para avisar que el login fue exitoso
        onLoginSuccess();
      } else {
        toast.error("Credenciales incorrectas");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false); // Se terminó la petición
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 border rounded shadow"
    >
      <h2 className="text-2xl mb-4 text-center font-semibold">Iniciar Sesión</h2>

      {/* Campo correo */}
      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        disabled={loading} // Deshabilitar mientras carga
      />

      {/* Campo contraseña */}
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        disabled={loading} // Deshabilitar mientras carga
      />

      {/* Botón enviar */}
      <button
        type="submit"
        disabled={loading} // Deshabilitar mientras carga
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Cargando..." : "Ingresar"}
      </button>
    </form>
  );
}
