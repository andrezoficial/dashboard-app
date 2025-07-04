import React from "react";

export default function ChatbotWidget() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "200px",
        height: "100px",
        backgroundColor: "rgba(255, 0, 0, 0.8)",
        color: "white",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
        fontWeight: "bold",
      }}
    >
      Widget CHATBOT visible
    </div>
  );
}
