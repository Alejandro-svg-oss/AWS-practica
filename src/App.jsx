import { useState, useEffect } from 'react';
import { API_URL } from './config';
import './App.css';

function App() {
  const [mensajes, setMensajes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [contenido, setContenido] = useState('');

  // Consultar todos los mensajes al cargar la aplicación
  const fetchMensajes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mensajes`);
      const data = await res.json();
      setMensajes(data);
    } catch (err) {
      console.error('Error al cargar mensajes desde la API:', err);
    }
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  // Enviar un nuevo mensaje al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !contenido) return;

    try {
      await fetch(`${API_URL}/api/mensajes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, contenido })
      });

      // Limpiar formulario y refrescar lista de mensajes
      setNombre('');
      setContenido('');
      fetchMensajes();
    } catch (err) {
      console.error('Error al guardar el mensaje en RDS:', err);
    }
  };

  return (
    <div className="container">
      <h1>Muro de Mensajes - AWS Cloud Architecture</h1>

      <form onSubmit={handleSubmit} className="muro-form">
        <input
          type="text"
          placeholder="Tu Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="form-input"
          required
        />
        <textarea
          placeholder="Escribe tu mensaje..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          className="form-textarea"
          required
        />
        <button type="submit" className="btn-submit">
          Guardar en RDS
        </button>
      </form>

      <h2>Registros Almacenados en Amazon RDS</h2>
      <div>
        {mensajes.length === 0 ? (
          <p>No hay mensajes registrados aún en la base de datos.</p>
        ) : (
          mensajes.map((m) => (
            <div key={m.id} className="mensaje-card">
              <strong>{m.nombre}</strong>
              <small className="mensaje-fecha">
                ({new Date(m.fecha).toLocaleString()})
              </small>
              <p className="mensaje-texto">{m.contenido}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;