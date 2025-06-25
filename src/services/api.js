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
