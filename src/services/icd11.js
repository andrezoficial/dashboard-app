import axios from 'axios';

const API_URL = 'http://localhost:3001/api/icd11'; // Ajusta el puerto si es diferente

export const buscarICD11 = async (termino) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { q: termino }
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar en ICD-11:', error);
    throw error;
  }
};
