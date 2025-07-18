import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

// Sonidos (opcional - puedes eliminar si no los necesitas)
import messageSound from '../public/sounds/message.mp3';
import notificationSound from '../public/sounds/notification.mp3';
import successSound from '../public/sounds/success.mp3';

export default function ChatbotWidget() {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState([
    {
      id: 0,
      texto: "Hola, soy el chatbot de Vior Clinic. ¿Quieres agendar una cita? Por favor escribe tu correo electrónico.",
    },
  ]);
  const [isMobile, setIsMobile] = useState(false);

  // Verificar el tamaño de pantalla al montar y en cambios
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Resto de tu lógica (paso, correo, codigo, etc.) permanece igual
  const [paso, setPaso] = useState("esperandoCorreo");
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [pacienteValidado, setPacienteValidado] = useState(null);
  const [motivos, setMotivos] = useState([]);
  const [motivoSeleccionado, setMotivoSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Referencias
  const divMensajesRef = useRef(null);
  const audioRef = useRef(null);
  const notificationRef = useRef(null);
  const successRef = useRef(null);

  // Función para reproducir sonidos (opcional)
  const playSound = (type) => {
    if (!audioRef.current) return;
    try {
      if (type === 'message') {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } // ... resto de sonidos
    } catch (e) {
      console.log("Error al reproducir sonido:", e);
    }
  };

  // Resto de tus funciones (agregarMensaje, cargarMotivos, etc.) permanecen igual

  return (
    <>
      {/* Elementos de audio (opcional) */}
      <audio ref={audioRef} src={messageSound} preload="auto" />
      <audio ref={notificationRef} src={notificationSound} preload="auto" />
      <audio ref={successRef} src={successSound} preload="auto" />
      
      {visible ? (
        <div
          style={{
            position: isMobile ? "fixed" : "fixed",
            bottom: isMobile ? 0 : 20,
            right: isMobile ? 0 : 20,
            width: isMobile ? "100%" : 380,
            height: isMobile ? "100vh" : 550,
            maxHeight: isMobile ? "100vh" : "80vh",
            boxShadow: isMobile ? "none" : "0 8px 30px rgba(0, 0, 0, 0.15)",
            borderRadius: isMobile ? 0 : 16,
            background: "#ffffff",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: isMobile ? "none" : "1px solid rgba(0, 0, 0, 0.05)",
            fontFamily: "'Inter', sans-serif",
          }}
          aria-live="polite"
        >
          {/* Header del Chatbot */}
          <div
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              padding: "16px 20px",
              borderTopLeftRadius: isMobile ? 0 : 16,
              borderTopRightRadius: isMobile ? 0 : 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#4ade80',
                boxShadow: '0 0 8px rgba(74, 222, 128, 0.7)'
              }} />
              <strong style={{ fontSize: 16, fontWeight: 600 }}>Chatbot Vior Clinic</strong>
            </div>
            <button
              onClick={() => setVisible(false)}
              aria-label="Cerrar Chatbot"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Área de mensajes */}
          <div
            ref={divMensajesRef}
            style={{
              flexGrow: 1,
              padding: "16px",
              overflowY: "auto",
              fontSize: 14,
              background: "#f9fafb",
              WebkitOverflowScrolling: 'touch', // Mejor scroll en iOS
            }}
          >
            {mensajes.map(({ id, texto, usuario }) => (
              <div
                key={id}
                style={{
                  marginBottom: 12,
                  textAlign: usuario ? "right" : "left",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px 16px",
                    borderRadius: usuario ? "18px 18px 0 18px" : "18px 18px 18px 0",
                    backgroundColor: usuario ? "#3b82f6" : "#e5e7eb",
                    color: usuario ? "white" : "#111827",
                    maxWidth: "85%",
                    wordWrap: "break-word",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    lineHeight: 1.5,
                    fontSize: 14,
                  }}
                >
                  {texto.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '8px 16px',
                marginBottom: 12
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#9ca3af',
                  animation: 'bounce 1.4s infinite ease-in-out'
                }} />
                {/* Puntos de typing animation */}
              </div>
            )}
          </div>

          {/* Selector de fecha (si aplica) */}
          {paso === "seleccionarFecha" && (
            <div
              style={{
                padding: 12,
                borderTop: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                maxHeight: isMobile ? "40vh" : "auto",
                overflowY: "auto",
              }}
            >
              <DatePicker
                selected={fechaSeleccionada}
                onChange={(date) => {
                  setFechaSeleccionada(date);
                  cargarHorarios(date);
                }}
                minDate={new Date()}
                inline
                calendarClassName="custom-calendar"
                popperPlacement="top-start"
              />
            </div>
          )}

          {/* Área de entrada */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              gap: 8,
              backgroundColor: "#ffffff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setIsTyping(true);
              }}
              onKeyDown={onKeyDown}
              style={{
                flexGrow: 1,
                padding: "12px 16px",
                borderRadius: 24,
                border: "1px solid #e5e7eb",
                outline: "none",
                fontSize: 14,
                backgroundColor: "#f9fafb",
              }}
              placeholder="Escribe tu mensaje..."
              disabled={paso === "seleccionarFecha"}
            />
            <button
              onClick={enviarMensaje}
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 24,
                padding: "12px 20px",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 14,
                minWidth: 80,
              }}
              disabled={paso === "seleccionarFecha" || !input.trim()}
            >
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setVisible(true)}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            zIndex: 9998,
          }}
          aria-label="Abrir Chatbot"
        >
          💬
        </button>
      )}

      {/* Estilos globales para móviles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-6px); }
          }
          
          .custom-calendar {
            border: none !important;
            font-family: 'Inter', sans-serif !important;
            width: 100% !important;
          }
          
          .react-datepicker {
            width: 100% !important;
            font-size: ${isMobile ? '14px' : '16px'} !important;
          }
          
          .react-datepicker__month-container {
            width: 100% !important;
          }
          
          .react-datepicker__day {
            width: ${isMobile ? '2.5rem' : '2rem'} !important;
            line-height: ${isMobile ? '2.5rem' : '2rem'} !important;
            margin: ${isMobile ? '0.2rem' : '0.166rem'} !important;
          }
          
          @media (max-width: 768px) {
            .react-datepicker__day-name, 
            .react-datepicker__day {
              width: 2.8rem !important;
              line-height: 2.8rem !important;
            }
          }
        `}
      </style>
    </>
  );
}