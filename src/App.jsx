import { useState, useEffect } from 'react';
import { API_URL } from './config';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/status`)
      .then((res) => res.json())
      .then((info) => setData(info))
      .catch((err) => console.error("Error conectando con EC2:", err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Frontend (S3) + Backend (EC2) 🚀</h1>
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', color: '#333' }}>
        <h3>Estado del Servidor</h3>
        {data ? (
          <div>
            <p><strong>Estado:</strong> {data.status} ✅</p>
            <p><strong>Sistema:</strong> {data.os}</p>
            <p><strong>Hora actual:</strong> {data.timestamp}</p>
          </div>
        ) : (
          <p>Cargando datos desde el servidor en EC2...</p>
        )}
      </div>
    </div>
  );
}

export default App;