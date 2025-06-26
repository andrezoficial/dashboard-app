import React, { useState } from "react";
import axios from "axios";

export default function ChatBot() {
  // Estado para los mensajes (array de objetos con { sender, text })
  const [messages, setMessages] = useState([]);

  // Estado para el texto que escribe el usuario
  const [input, setInput] = useState("");

  // Función para enviar mensaje
  const handleSend = async () => {
    if (!input.trim()) return;

    // Agregamos el mensaje del usuario a la conversación
    const newUserMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Hacemos la petición al backend para obtener respuesta
      const response = await axios.post("/api/chat/message", { message: input });

      // Agregamos la respuesta del bot a la conversación
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Si hay error, mostrar mensaje de error del bot
      const errorMessage = { sender: "bot", text: "Error al comunicarse con el servidor." };
      setMessages((prev) => [...prev, errorMessage]);
    }

    // Limpiar input
    setInput("");
  };

  return (
    <div className="chat-container" style={{ maxWidth: 400, margin: "auto" }}>
      <div
        className="messages"
        style={{
          height: 300,
          border: "1px solid #ccc",
          padding: 10,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <span
              style={{
                backgroundColor: msg.sender === "user" ? "#007bff" : "#e5e5ea",
                color: msg.sender === "user" ? "white" : "black",
                padding: "8px 12px",
                borderRadius: 15,
                display: "inline-block",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
        placeholder="Escribe tu mensaje..."
        style={{ width: "calc(100% - 90px)", padding: "8px" }}
      />
      <button onClick={handleSend} style={{ width: 80, padding: "8px" }}>
        Enviar
      </button>
    </div>
  );
}
