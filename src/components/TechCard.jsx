import { useState } from 'react';
import './TechCard.css';

export default function TechCard({ title, icon, description }) {
  const [likes, setLikes] = useState(0);

  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>

      <button
        className="card-button"
        onClick={() => setLikes(likes + 1)}
      >
        🔥 {likes} Likes
      </button>
    </div>
  );
}