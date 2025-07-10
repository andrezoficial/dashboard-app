import React, { useState } from "react";
import {
  enviarCodigoVerificacion,
  verificarCodigo,
  crearCitaDesdeBot,
} from "../services/api";

export default function ChatbotWidget() {
  const [visible, setVisible] = useState(true);
  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState([
    { id: 0, texto: "Hola, soy el chatbot de Vior Clinic. ¿En qué puedo ayudarte?" },
  ]);

  // Flujo para agendar cita
  const [estado, setEstado] = useState("inicio");
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");

  const enviarMensaje = async () => {
    if (!input.trim()) return;
    const textoUsuario = input.trim();
    setMensajes((prev) => [...prev, { id: prev.length + 1, texto: textoUsuario, usuario: true }]);

    setInput("");

    switch (estado) {
      case "inicio":
        if (textoUsuario.toLowerCase().includes("agendar")) {
          setEstado("esperando_correo");
          agregarRespuesta("Claro, para agendar una cita necesito tu correo electrónico registrado.");
        } else {
          agregarRespuesta("Disculpa, no entendí eso. Puedes decir 'Quiero agendar una cita'.");
        }
        break;

      case "esperando_correo":
        try {
          await enviarCodigoVerificacion(textoUsuario);
          setCorreo(textoUsuario);
          setEstado("esperando_codigo");
          agregarRespuesta("Te envié un código a tu correo. Escríbelo aquí para continuar.");
        } catch (err) {
          agregarRespuesta("No encontramos ese correo en nuestros registros. Verifica e intenta de nuevo.");
        }
        break;

      case "esperando_codigo":
        try {
          const res = await verificarCodigo(correo, textoUsuario);
          if (res.ok) {
            setEstado("esperando_fecha");
            agregarRespuesta("Código verificado. ¿Para qué fecha deseas la cita? (Formato: AAAA-MM-DD)");
          } else {
            agregarRespuesta("El código es incorrecto. Inténtalo de nuevo.");
          }
        } catch {
          agregarRespuesta("Hubo un error verificando el código. Intenta de nuevo más tarde.");
        }
        break;

      case "esperando_fecha":
        // Validar fecha mínima hoy
        const fechaIngresada = new Date(textoUsuario);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (isNaN(fechaIngresada) || fechaIngresada < hoy) {
          agregarRespuesta("Por favor, ingresa una fecha válida a partir de hoy (AAAA-MM-DD).");
        } else {
          setFecha(textoUsuario);
          setEstado("esperando_motivo");
          agregarRespuesta("Perfecto. ¿Cuál es el motivo de la cita?");
        }
        break;

      case "esperando_motivo":
        setMotivo(textoUsuario);
        try {
          await crearCitaDesdeBot({ correo, fecha, motivo: textoUsuario });
          agregarRespuesta("¡Tu cita ha sido agendada exitosamente! 🎉 Te llegará un correo de confirmación.");
          reiniciar();
        } catch (err) {
          agregarRespuesta("No se pudo crear la cita. Intenta más tarde.");
          reiniciar();
        }
        break;

      default:
        agregarRespuesta("Disculpa, no entendí eso. ¿Podrías repetirlo?");
    }
  };

  const agregarRespuesta = (texto) => {
    setTimeout(() => {
      setMensajes((prev) => [...prev, { id: prev.length + 1, texto }]);
    }, 800);
  };

  const reiniciar = () => {
    setEstado("inicio");
    setCorreo("");
    setCodigo("");
    setFecha("");
    setMotivo("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") enviarMensaje();
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
