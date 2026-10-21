import React, { useState } from 'react';

export default function Conversor() {
  const [monto, setMonto] = useState('');
  const [data, setData] = useState(null);

  const convertir = async () => {
    const res = await fetch("https://essyr8ad37.execute-api.us-east-1.amazonaws.com/convertir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monto })
    });
    const result = await res.json();
    setData(result.conversiones);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Conversor USD</h2>
      <input 
        type="number"
        placeholder="Monto en USD"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />
      <button onClick={convertir}>Convertir</button>

      {data && (
        <ul>
          {Object.entries(data).map(([moneda, valor]) => (
            <li key={moneda}><b>{moneda}:</b> {valor}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
