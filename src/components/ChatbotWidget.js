import React, { useState } from "react";

const respuestasSimuladas = {
  "hola": "¡Hola! Bienvenido a Vior Clinic. ¿En qué puedo ayudarte hoy?",
  "horario": "Nuestro horario de atención es de lunes a viernes, 8:00 AM a 6:00 PM.",
  "dónde están": "Estamos ubicados en la Calle 123 #45-67, Bogotá, Colombia.",
  "agendar cita": "Para agendar una cita, por favor visita la sección 'Citas' en el menú lateral.",
  "qué servicios ofrecen": "Ofrecemos consultas médicas generales, especialidades, y atención de urgencias.",
  "contacto": "Puedes contactarnos al teléfono +57 123 456 7890 o al correo contacto@viorclinic.com.",
  "gracias": "¡Gracias a ti! Si necesitas algo más, aquí estaré para ayudarte.",
  "default": "Disculpa, no entendí eso. ¿Podrías reformular tu pregunta o escribir otra cosa?",
};

export default function ChatbotWidget() {
  const [visible, setVisible] = useState(true);
  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState([
    { id: 0, texto: "Hola, soy el chatbot de Vior Clinic. ¡Escríbeme algo!" },
  ]);

  const enviarMensaje = () => {
    if (!input.trim()) return;
    const textoUsuario = input.trim();
    setMensajes((prev) => [...prev, { id: prev.length + 1, texto: textoUsuario, usuario: true }]);

    // Buscar respuesta simulada
    const clave = textoUsuario.toLowerCase();
    let respuesta = respuestasSimuladas["default"];
    for (const pregunta in respuestasSimuladas) {
      if (clave.includes(pregunta)) {
        respuesta = respuestasSimuladas[pregunta];
        break;
      }
    }

    setTimeout(() => {
      setMensajes((prev) => [...prev, { id: prev.length + 1, texto: respuesta }]);
    }, 800);

    setInput("");
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
