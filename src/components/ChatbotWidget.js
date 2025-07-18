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
  const [visible, setVisible] = useState(true);
  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState([
    {
      id: 0,
      texto:
        "Hola, soy el chatbot de Vior Clinic. ¿Quieres agendar una cita? Por favor escribe tu correo electrónico o numero de documento.",
    },
  ]);

  // Flujo
  const [paso, setPaso] = useState("esperandoCorreo");

  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [pacienteValidado, setPacienteValidado] = useState(null);

  // Nuevos estados
  const [motivos, setMotivos] = useState([]);
  const [motivoSeleccionado, setMotivoSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  const agregarMensaje = (texto, usuario = false) => {
    setMensajes((prev) => [
      ...prev,
      { id: prev.length + 1, texto, usuario },
    ]);
  };

  // Cargar motivos desde backend
  const cargarMotivos = async () => {
    try {
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
    }
  };

  // Cargar horarios según fecha
  const cargarHorarios = async (fecha) => {
    try {
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
    }
  };

  const enviarMensaje = async () => {
    if (!input.trim()) return;
    const textoUsuario = input.trim();
    agregarMensaje(textoUsuario, true);
    setInput("");

    const texto = textoUsuario.toLowerCase();

    // Detectar saludos para interacción más amigable
    const saludos = [
      {
        palabras: ["hola", "hi"],
        respuesta:
          "¡Hola! ¿Cómo estás? Por favor, dime tu correo para continuar con la cita.",
      },
      {
        palabras: ["buenos días", "buen dia"],
        respuesta:
          "¡Buenos días! ¿Deseas agendar una cita? Por favor, escribe tu correo electrónico.",
      },
      {
        palabras: ["buenas tardes"],
        respuesta:
          "¡Buenas tardes! Estoy aquí para ayudarte a agendar tu cita. Escribe tu correo, por favor.",
      },
      {
        palabras: ["buenas noches"],
        respuesta:
          "¡Buenas noches! ¿Te gustaría agendar una cita? Por favor, dime tu correo.",
      },
      {
        palabras: ["como estas", "cómo estás"],
        respuesta:
          "Excelente y tú ¿Cómo estás? Por favor, dime tu correo para continuar con la cita.",
      },
    ];

    const saludoDetectado = saludos.find(({ palabras }) =>
      palabras.some((palabra) => texto.includes(palabra))
    );

    if (saludoDetectado) {
      agregarMensaje(saludoDetectado.respuesta);
      return;
    }

    try {
      if (paso === "esperandoCorreo") {
        setCorreo(textoUsuario);
        agregarMensaje("Enviando código de verificación a tu correo...");
        await enviarCodigoVerificacion(textoUsuario);
        agregarMensaje(
          "Código enviado. Por favor, ingresa el código que recibiste en tu correo."
        );
        setPaso("esperandoCodigo");
      } else if (paso === "esperandoCodigo") {
        setCodigo(textoUsuario);
        agregarMensaje("Validando código...");
        const respuesta = await validarCodigoVerificacion(correo, textoUsuario);
        setPacienteValidado(respuesta.paciente);
        agregarMensaje("¡Código validado!");
        await cargarMotivos();
      } else if (paso === "mostrarMotivos") {
        const index = parseInt(textoUsuario, 10);
        if (!index || index < 1 || index > motivos.length) {
          agregarMensaje(
            "Por favor escribe un número válido del 1 al " + motivos.length
          );
          return;
        }
        const motivo = motivos[index - 1];
        setMotivoSeleccionado(motivo);
        agregarMensaje(
          `Has seleccionado: ${motivo.label}. Ahora elige la fecha para tu cita usando el calendario debajo.`
        );
        setPaso("seleccionarFecha");
      } else if (paso === "seleccionarFecha") {
        agregarMensaje(
          "Por favor usa el calendario para elegir una fecha, no escribas texto."
        );
      } else if (paso === "seleccionarHorario") {
        const index = parseInt(textoUsuario, 10);
        if (!index || index < 1 || index > horariosDisponibles.length) {
          agregarMensaje("Por favor escribe un número válido para elegir un horario.");
          return;
        }
        const horario = horariosDisponibles[index - 1];
        setHorarioSeleccionado(horario);
        agregarMensaje(
          `Has seleccionado el horario ${horario}. Confirmo que agendamos tu cita para el ${format(
            fechaSeleccionada,
            "yyyy-MM-dd"
          )} a las ${horario}. Escribe "sí" para confirmar o "no" para cancelar.`
        );
        setPaso("confirmacion");
      } else if (paso === "confirmacion") {
        if (texto === "sí" || texto === "si") {
          const fechaHoraISO = new Date(
            `${format(fechaSeleccionada, "yyyy-MM-dd")}T${horarioSeleccionado}:00`
          ).toISOString();

          const citaData = {
            paciente: pacienteValidado._id, // ojo que el backend espera 'paciente', no 'pacienteId'
            fecha: fechaHoraISO,
            motivo: motivoSeleccionado.value,
          };

          agregarMensaje("Agendando tu cita...");
          await crearCita(citaData);
          agregarMensaje("¡Cita agendada con éxito! Gracias por usar Vior Clinic.");
          setPaso("finalizado");
        } else if (texto === "no") {
          agregarMensaje(
            "Cita cancelada. Si quieres agendar otra cita, escribe tu correo electrónico."
          );
          resetearEstado();
        } else {
          agregarMensaje('Por favor responde "sí" para confirmar o "no" para cancelar.');
        }
      } else if (paso === "finalizado") {
        agregarMensaje(
          "Si quieres agendar otra cita, escribe tu correo electrónico."
        );
        resetearEstado();
      } else {
        agregarMensaje(
          "Lo siento, no entendí eso. Por favor sigue el flujo para agendar una cita."
        );
      }
    } catch (error) {
      console.error(error);
      if (paso === "esperandoCorreo") {
        agregarMensaje(
          "No encontramos ese correo en nuestros registros. Verifica e intenta de nuevo."
        );
      } else if (paso === "esperandoCodigo") {
        agregarMensaje(
          "Código incorrecto o expirado. Por favor, intenta nuevamente o escribe tu correo para reenviar código."
        );
        setPaso("esperandoCorreo");
      } else {
        agregarMensaje("Ocurrió un error. Intenta nuevamente más tarde.");
      }
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

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      enviarMensaje();
    }
  };

  // Scroll automático
  const divMensajesRef = useRef(null);
  useEffect(() => {
    if (divMensajesRef.current) {
      divMensajesRef.current.scrollTop = divMensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  return (
    <>
      {visible ? (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 360,
            height: 500,
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
            ref={divMensajesRef}
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

          {paso === "seleccionarFecha" && (
            <div
              style={{
                padding: 10,
                borderTop: "1px solid #ddd",
                backgroundColor: "#f9f9f9",
              }}
            >
              <DatePicker
                selected={fechaSeleccionada}
                onChange={(date) => {
                  setFechaSeleccionada(date);
                  cargarHorarios(date);
                }}
                minDate={new Date()}
                placeholderText="Selecciona una fecha"
                inline
              />
            </div>
          )}

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
              disabled={paso === "seleccionarFecha"} // mientras usa calendario
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
              disabled={paso === "seleccionarFecha"} // mientras usa calendario
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
      )}
    </>
  );
}
