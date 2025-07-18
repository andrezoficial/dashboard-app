import React, { useState } from 'react';
import { buscarICD11 } from '../services/icd11';

export default function BuscadorICD11() {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleBuscar = async () => {
    setCargando(true);
    try {
      const data = await buscarICD11(termino);
      setResultados(data?.destinationEntities || []);
    } catch (err) {
      alert('Hubo un error al buscar. Revisa la consola.');
    }
    setCargando(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Buscar en ICD-11</h2>
      <input
        type="text"
        placeholder="Ej: diabetes"
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        className="border px-2 py-1 rounded mr-2"
      />
      <button
        onClick={handleBuscar}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Buscar
      </button>

      {cargando ? (
        <p className="mt-4">Cargando...</p>
      ) : (
        <ul className="mt-4">
          {resultados.map((item) => (
            <li key={item.id} className="border-b py-2">
              <strong>{item.title}</strong>
              <p className="text-sm text-gray-600">{item.theCode}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
