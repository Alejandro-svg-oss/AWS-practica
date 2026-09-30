import TechCard from './components/TechCard';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Cloud Native Stack ⚡</h1>
        <p className="app-subtitle">
          App v2.0 corriendo en Amazon S3
        </p>
      </header>

      <main className="cards-grid">
        <TechCard
          icon="⚛️"
          title="React + Vite"
          description="Librería de UI para construir interfaces ultra rápidas mediante componentes."
        />

        <TechCard
          icon="☁️"
          title="Amazon S3"
          description="Almacenamiento de objetos en la nube configurado como hosting estático."
        />

        <TechCard
          icon="🚀"
          title="Próximamente: EC2"
          description="Servidor virtual donde desplegaremos nuestra API en Node.js y Express."
        />
      </main>
    </div>
  );
}