import React, { useState } from "react";
import ChatBot from "./ChatBot"; // ajusta ruta según dónde esté

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "360px",
            height: "420px",
            boxShadow: "0 0 12px rgba(0,0,0,0.3)",
            borderRadius: "10px",
            backgroundColor: "white",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "8px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <button onClick={() => setOpen(false)} aria-label="Cerrar chat">
              ✖
            </button>
          </div>
          <ChatBot />
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "30px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            zIndex: 9999,
          }}
          aria-label="Abrir chat"
        >
          💬
        </button>
      )}
    </>
  );
}
