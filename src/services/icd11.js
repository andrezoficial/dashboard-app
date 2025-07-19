// services/icd11Service.js
const axios = require('axios');

const BASE          = 'https://icd.who.int/icdapi';
const LINEARIZATION = 'mms';
const LANGUAGE      = 'es';
const API_VERSION   = 'v2';

async function buscarICD11(termino) {
  if (!termino) return [];

  const url = `${BASE}/content/${LINEARIZATION}/search`;
  const params = { q: termino, language: LANGUAGE };
  const headers = {
    'API-Version': API_VERSION,
    Accept:        'application/json'
  };

  try {
    const { data } = await axios.get(url, { params, headers });
    return data.destinationEntities || [];
  } catch (err) {
    console.error(
      'ICD-11 API error:',
      err.response?.status,
      err.response?.data || err.message
    );
    throw err;
  }
}

module.exports = { buscarICD11 };
