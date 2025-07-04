import React, { useState } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? (
        <div>
          <button onClick={() => setOpen(false)}>Cerrar Chat</button>
          <p>Chat abierto</p>
        </div>
      ) : (
        <button onClick={() => setOpen(true)}>Abrir Chat</button>
      )}
    </>
  );
}
