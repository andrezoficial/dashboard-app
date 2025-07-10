import React, { useState } from "react";
import { enviarCodigoVerificacion, validarCodigoVerificacion, crearCita } from "../services/api";

export default function ChatbotWidget() {
  const [visible, setVisible] = useState(true);
  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState([{ id: 0, texto: "Hola, soy el chatbot de Vior Clinic. ¿Quieres agendar una cita? Por favor escribe tu correo electrónico." }]);

  // Estados para flujo
  const [paso, setPaso] = useState("esperandoCorreo"); // "esperandoCodigo", "validado"
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [pacienteValidado, setPacienteValidado] = useState(null);

  const agregarMensaje = (texto, usuario = false) => {
    setMensajes((prev) => [...prev, { id: prev.length + 1, texto, usuario }]);
  };

  const enviarMensaje = async () => {
    if (!input.trim()) return;
    const textoUsuario = input.trim();
    agregarMensaje(textoUsuario, true);
    setInput("");

    try {
      if (paso === "esperandoCorreo") {
        // Guardar correo e intentar enviar código
        setCorreo(textoUsuario);
        agregarMensaje("Enviando código de verificación a tu correo...");
        await enviarCodigoVerificacion(textoUsuario);
        agregarMensaje("Código enviado. Por favor, ingresa el código que recibiste en tu correo.");
        setPaso("esperandoCodigo");
      } else if (paso === "esperandoCodigo") {
        setCodigo(textoUsuario);
        agregarMensaje("Validando código...");
        const respuesta = await validarCodigoVerificacion(correo, textoUsuario);
        setPacienteValidado(respuesta.paciente);
        agregarMensaje("¡Código validado! Ahora dime la fecha y hora para agendar tu cita en formato YYYY-MM-DD HH:mm");
        setPaso("validado");
      } else if (paso === "validado") {
        // Aquí asumes que el textoUsuario es la fecha y hora
        const fechaHora = textoUsuario;

        // Lógica para crear cita
        const citaData = {
          pacienteId: pacienteValidado._id,
          fechaHora, // idealmente formateado en backend
          estado: "pendiente",
          // otros campos que requieras
        };

        agregarMensaje("Agendando tu cita...");
        await crearCita(citaData);
        agregarMensaje("¡Cita agendada con éxito! Gracias por usar Vior Clinic.");
        setPaso("finalizado");
      } else {
        agregarMensaje("Lo siento, no entendí eso. Por favor sigue el flujo para agendar una cita.");
      }
    } catch (error) {
      console.error(error);
      if (paso === "esperandoCorreo") {
        agregarMensaje("No encontramos ese correo en nuestros registros. Verifica e intenta de nuevo.");
      } else if (paso === "esperandoCodigo") {
        agregarMensaje("Código incorrecto o expirado. Por favor, intenta nuevamente o escribe tu correo para reenviar código.");
        setPaso("esperandoCorreo");
      } else {
        agregarMensaje("Ocurrió un error. Intenta nuevamente más tarde.");
      }
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      enviarMensaje();
    }
  };

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: 12,
          borderRadius: "50%",
          backgroundColor: "#2563EB",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 0 8px rgba(0,0,0,0.3)",
          zIndex: 9999,
        }}
        aria-label="Abrir Chatbot"
      >
        💬
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 360,
        height: 420,
        boxShadow: "0 0 12px rgba(0,0,0,0.3)",
        borderRadius: 10,
        backgroundColor: "white",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
      aria-live="polite"
    >
      <div
        style={{
          backgroundColor: "#2563EB",
          color: "white",
          padding: "10px 15px",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Chatbot Vior Clinic</strong>
        <button
          onClick={() => setVisible(false)}
          aria-label="Cerrar Chatbot"
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          flexGrow: 1,
          padding: 10,
          overflowY: "auto",
          fontSize: 14,
        }}
      >
        {mensajes.map(({ id, texto, usuario }) => (
          <div
            key={id}
            style={{
              marginBottom: 8,
              textAlign: usuario ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 16,
                backgroundColor: usuario ? "#2563EB" : "#E5E7EB",
                color: usuario ? "white" : "black",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {texto}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 10,
          borderTop: "1px solid #ddd",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          type="text"
          aria-label="Escribe tu mensaje"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          style={{
            flexGrow: 1,
            padding: 8,
            borderRadius: 20,
            border: "1px solid #ccc",
            outline: "none",
          }}
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={enviarMensaje}
          style={{
            backgroundColor: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: 20,
            padding: "8px 16px",
            cursor: "pointer",
          }}
          aria-label="Enviar mensaje"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
