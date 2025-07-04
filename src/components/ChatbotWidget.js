import React, { useState } from "react";
import { FiMessageCircle, FiX } from "react-icons/fi";

export default function ChatbotWidget() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {visible ? (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden w-80 h-96 flex flex-col">
          <div className="flex justify-between items-center p-3 bg-blue-600 text-white">
            <h2 className="text-sm font-semibold">Asistente Virtual</h2>
            <button onClick={() => setVisible(false)}>
              <FiX size={20} />
            </button>
          </div>
          <div className="flex-1 p-4 text-sm overflow-y-auto">
            <p className="text-gray-700 dark:text-gray-200">Hola, ¿en qué puedo ayudarte?</p>
            {/* Aquí podrías integrar tu sistema de chat real */}
          </div>
        </div>
      ) : null}

      {!visible && (
        <button
          onClick={() => setVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition"
          aria-label="Abrir chatbot"
        >
          <FiMessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
