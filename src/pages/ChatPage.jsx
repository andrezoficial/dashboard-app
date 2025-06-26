import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://backend-dashboard-v2.onrender.com/api/chatbot";

  // Obtener mensajes al cargar
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error al cargar mensajes:", err));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newMessage = {
      user: "Usuario",
      text,
    };

    try {
      setLoading(true);
      await axios.post(API_URL, newMessage);
      const res = await axios.get(API_URL);
      setMessages(res.data);
      setText("");
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">ChatBot</h2>

      <div className="flex-1 overflow-y-auto border p-4 mb-4 rounded bg-gray-50 max-h-[400px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.user === "Usuario" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-3 py-2 rounded ${
                msg.user === "Usuario"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Escribe tu mensaje..."
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
