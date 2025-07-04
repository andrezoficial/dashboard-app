import React, { useState } from "react";

export default function chatbotwidget() {
  

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
    >
      Chatbot Widget Visible
    </div>
  );
}
