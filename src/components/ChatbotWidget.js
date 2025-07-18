import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  enviarCodigoVerificacion,
  validarCodigoVerificacion,
  crearCita,
  getMotivos,
  getHorarios,
} from "../services/api";
import { format } from "date-fns";

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

  // Estados del flujo
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
  const [isSending, setIsSending] = useState(false);

  // Referencias
  const divMensajesRef = useRef(null);

  // Validación de correo
  const esCorreoValido = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Verificar el tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll automático
  useEffect(() => {
    if (divMensajesRef.current) {
      divMensajesRef.current.scrollTop = divMensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Función para agregar mensajes
  const agregarMensaje = (texto, usuario = false) => {
    setMensajes((prev) => [
      ...prev,
      { id: prev.length + 1, texto, usuario },
    ]);
  };

  // Cargar motivos desde backend
  const cargarMotivos = async () => {
    try {
      setIsTyping(true);
      const datos = await getMotivos();
      setMotivos(datos);
      agregarMensaje(
        "Por favor, elige el motivo de tu cita escribiendo el número:\n" +
          datos.map((m, i) => `${i + 1}. ${m.label}`).join("\n")
      );
      setPaso("mostrarMotivos");
    } catch (error) {
      console.error(error);
      agregarMensaje("No se pudieron cargar los motivos. Intenta más tarde.");
    } finally {
      setIsTyping(false);
    }
  };

  // Cargar horarios según fecha
  const cargarHorarios = async (fecha) => {
    try {
      setIsTyping(true);
      const fechaISO = format(fecha, "yyyy-MM-dd");
      const horarios = await getHorarios(fechaISO);
      setHorariosDisponibles(horarios);

      if (horarios.length === 0) {
        agregarMensaje(
          "No hay horarios disponibles para esa fecha. Por favor elige otra fecha."
        );
        setPaso("seleccionarFecha");
      } else {
        agregarMensaje(
          "Estos son los horarios disponibles. Escribe el número del horario que prefieres:\n" +
            horarios.map((h, i) => `${i + 1}. ${h}`).join("\n")
        );
        setPaso("seleccionarHorario");
      }
    } catch (error) {
      console.error(error);
      agregarMensaje("Error al obtener horarios. Intenta más tarde.");
      setPaso("seleccionarFecha");
    } finally {
      setIsTyping(false);
    }
  };

  // Función principal para enviar mensajes
  const enviarMensaje = async () => {
    if (!input.trim() || isSending) return;
    
    const textoUsuario = input.trim();
    agregarMensaje(textoUsuario, true);
    setInput("");
    setIsSending(true);

    const texto = textoUsuario.toLowerCase();

    // Detectar saludos
    const saludos = [
      {
        palabras: ["hola", "hi"],
        respuesta: "¡Hola! ¿Cómo estás? Por favor, dime tu correo para continuar con la cita.",
      },
      {
        palabras: ["buenos días", "buen dia"],
        respuesta: "¡Buenos días! ¿Deseas agendar una cita? Por favor, escribe tu correo electrónico.",
      },
      {
        palabras: ["buenas tardes"],
        respuesta: "¡Buenas tardes! Estoy aquí para ayudarte a agendar tu cita. Escribe tu correo, por favor.",
      },
      {
        palabras: ["buenas noches"],
        respuesta: "¡Buenas noches! ¿Te gustaría agendar una cita? Por favor, dime tu correo.",
      },
      {
        palabras: ["como estas", "cómo estás"],
        respuesta: "Excelente y tú ¿Cómo estás? Por favor, dime tu correo para continuar con la cita.",
      },
    ];

    const saludoDetectado = saludos.find(({ palabras }) =>
      palabras.some((palabra) => texto.includes(palabra))
    );

    if (saludoDetectado) {
      agregarMensaje(saludoDetectado.respuesta);
      setIsSending(false);
      return;
    }

    try {
      setIsTyping(true);
      
      if (paso === "esperandoCorreo") {
        if (!esCorreoValido(textoUsuario)) {
          agregarMensaje("Por favor ingresa un correo válido.");
          return;
        }
        
        setCorreo(textoUsuario);
        agregarMensaje("Enviando código de verificación a tu correo...");
        await enviarCodigoVerificacion(textoUsuario);
        agregarMensaje("Código enviado. Por favor, ingresa el código que recibiste en tu correo.");
        setPaso("esperandoCodigo");
      } else if (paso === "esperandoCodigo") {
        setCodigo(textoUsuario);
        agregarMensaje("Validando código...");
        const respuesta = await validarCodigoVerificacion(correo, textoUsuario);
        
        if (!respuesta?.paciente) {
          throw new Error("No se pudo validar el paciente");
        }
        
        setPacienteValidado(respuesta.paciente);
        agregarMensaje("¡Código validado!");
        await cargarMotivos();
      } else if (paso === "mostrarMotivos") {
        const index = parseInt(textoUsuario, 10);
        if (!index || index < 1 || index > motivos.length) {
          agregarMensaje(`Por favor escribe un número válido del 1 al ${motivos.length}`);
          return;
        }
        const motivo = motivos[index - 1];
        setMotivoSeleccionado({ label: motivo.label });
        agregarMensaje(`Has seleccionado: ${motivo.label}. Ahora elige la fecha para tu cita usando el calendario debajo.`);
        setPaso("seleccionarFecha");
      } else if (paso === "seleccionarFecha") {
        agregarMensaje("Por favor usa el calendario para elegir una fecha, no escribas texto.");
      } else if (paso === "seleccionarHorario") {
        const index = parseInt(textoUsuario, 10);
        if (!index || index < 1 || index > horariosDisponibles.length) {
          agregarMensaje(`Por favor escribe un número válido del 1 al ${horariosDisponibles.length}`);
          return;
        }
        const horario = horariosDisponibles[index - 1];
        setHorarioSeleccionado(horario);
        agregarMensaje(
          `Has seleccionado el horario ${horario}. Confirmo que agendamos tu cita para el ${format(
            fechaSeleccionada, "yyyy-MM-dd"
          )} a las ${horario}. Escribe "sí" para confirmar o "no" para cancelar.`
        );
        setPaso("confirmacion");
      } else if (paso === "confirmacion") {
        if (texto === "sí" || texto === "si") {
          const fechaHoraISO = new Date(
            `${format(fechaSeleccionada, "yyyy-MM-dd")}T${horarioSeleccionado}:00`
          ).toISOString();

          const citaData = {
            paciente: pacienteValidado._id,
            fecha: fechaHoraISO,
            motivo: motivoSeleccionado.label,
            estado: "pendiente",
          };

          agregarMensaje("Agendando tu cita...");
          await crearCita(citaData);
          agregarMensaje("¡Cita agendada con éxito! Gracias por usar Vior Clinic.");
          setPaso("finalizado");
        } else if (texto === "no") {
          agregarMensaje("Cita cancelada. Si quieres agendar otra cita, escribe tu correo electrónico.");
          resetearEstado();
        } else {
          agregarMensaje('Por favor responde "sí" para confirmar o "no" para cancelar.');
        }
      } else if (paso === "finalizado") {
        agregarMensaje("Si quieres agendar otra cita, escribe tu correo electrónico.");
        resetearEstado();
      } else {
        agregarMensaje("Lo siento, no entendí eso. Por favor sigue el flujo para agendar una cita.");
      }
    } catch (error) {
      console.error(error);
      if (paso === "esperandoCorreo") {
        agregarMensaje("No encontramos ese correo en nuestros registros. Verifica e intenta de nuevo.");
      } else if (paso === "esperandoCodigo") {
        agregarMensaje("Código incorrecto o expirado. Por favor, intenta nuevamente o escribe tu correo para reenviar código.");
        setPaso("esperandoCorreo");
      } else {
        agregarMensaje("Ocurrió un error. Intenta nuevamente más tarde.");
      }
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  };

  // Función para limpiar estado y reiniciar flujo
  const resetearEstado = () => {
    setPaso("esperandoCorreo");
    setMotivoSeleccionado(null);
    setFechaSeleccionada(null);
    setHorarioSeleccionado(null);
    setPacienteValidado(null);
    setCorreo("");
  };

  // Manejar tecla Enter
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !isSending) {
      enviarMensaje();
    }
  };

  return (
    <>
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
          role="dialog"
          aria-labelledby="chatbot-title"
        >
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
              <div 
                role="status"
                aria-label="Chatbot activo"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#4ade80',
                  boxShadow: '0 0 8px rgba(74, 222, 128, 0.7)'
                }} 
              />
              <strong id="chatbot-title" style={{ fontSize: 16, fontWeight: 600 }}>Chatbot Vior Clinic</strong>
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

          <div
            ref={divMensajesRef}
            style={{
              flexGrow: 1,
              padding: "16px",
              overflowY: "auto",
              fontSize: 14,
              background: "#f9fafb",
              WebkitOverflowScrolling: 'touch',
            }}
            role="log"
            aria-live="polite"
          >
            {mensajes.map(({ id, texto, usuario }) => (
              <div
                key={id}
                style={{
                  marginBottom: 12,
                  textAlign: usuario ? "right" : "left",
                  animation: "fadeIn 0.3s ease",
                }}
                role={usuario ? "status" : "article"}
                aria-atomic="true"
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
                <div 
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    marginTop: 4,
                    marginLeft: usuario ? 0 : 8,
                    marginRight: usuario ? 8 : 0,
                  }}
                  aria-hidden="true"
                >
                  {usuario ? 'Tú' : 'Asistente'}
                </div>
              </div>
            ))}
            {isTyping && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 16px',
                  marginBottom: 12
                }}
                aria-live="polite"
                aria-label="El asistente está escribiendo"
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#9ca3af',
                  animation: 'bounce 1.4s infinite ease-in-out'
                }} />
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#9ca3af',
                  animation: 'bounce 1.4s infinite ease-in-out',
                  animationDelay: '0.2s'
                }} />
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#9ca3af',
                  animation: 'bounce 1.4s infinite ease-in-out',
                  animationDelay: '0.4s'
                }} />
              </div>
            )}
          </div>

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
                aria-label="Seleccionar fecha para la cita"
              />
            </div>
          )}

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
              disabled={paso === "seleccionarFecha" || isSending}
              aria-label="Escribe tu mensaje"
              aria-disabled={paso === "seleccionarFecha" || isSending}
            />
            <button
              onClick={enviarMensaje}
              style={{
                backgroundColor: isSending ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 24,
                padding: "12px 20px",
                cursor: isSending ? "not-allowed" : "pointer",
                fontWeight: 500,
                fontSize: 14,
                minWidth: 80,
                transition: "background-color 0.2s ease",
              }}
              disabled={paso === "seleccionarFecha" || !input.trim() || isSending}
              aria-label="Enviar mensaje"
              aria-disabled={paso === "seleccionarFecha" || !input.trim() || isSending}
            >
              {isSending ? "..." : "Enviar"}
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
          aria-label="Abrir Chatbot de Vior Clinic"
        >
          💬
        </button>
      )}

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