import axios from 'axios';

// Backend en Render
const API_URL = 'https://backend-dashboard-v2.onrender.com/api';

export const getUsuarios = async () => {
  const res = await axios.get(`${API_URL}/usuarios`);
  return res.data;
};

export const crearUsuario = async (data) => {
  const res = await axios.post(`${API_URL}/usuarios`, data);
  return res.data;
};

export const actualizarUsuario = async (id, data) => {
  const res = await axios.put(`${API_URL}/usuarios/${id}`, data);
  return res.data;
};

export const eliminarUsuario = async (id) => {
  const res = await axios.delete(`${API_URL}/usuarios/${id}`);
  return res.data;
};
// Citas
export const getCitas = async () => {
  const res = await axios.get(`${API_URL}/citas`);
  return res.data;
};

export const crearCita = async (data) => {
  const res = await axios.post(`${API_URL}/citas`, data);
  return res.data;
};

export const actualizarCita = async (id, data) => {
  const res = await axios.put(`${API_URL}/citas/${id}`, data);
  return res.data;
};

export const eliminarCita = async (id) => {
  const res = await axios.delete(`${API_URL}/citas/${id}`);
  return res.data;
};

// Pacientes
export const getPacientes = async () => {
  const res = await axios.get(`${API_URL}/pacientes`);
  return res.data;
};
export const enviarCodigoVerificacion = async (correo) => {
  const res = await axios.post(`${API_URL}/citas/enviar-codigo`, { correo });
  return res.data;
};

export const verificarCodigo = async (correo, codigo) => {
  const res = await axios.post(`${API_URL}/citas/verificar-codigo`, { correo, codigo });
  return res.data; // { ok: true } o { ok: false }
};

export const crearCitaDesdeBot = async ({ correo, fecha, motivo }) => {
  const res = await axios.post(`${API_URL}/citas/crear-desde-bot`, {
    correo,
    fecha,
    motivo,
  });
  return res.data;
};
