import React, { useState, useEffect } from 'react';
import './hexagonobg.css';

// Define a aparência de cada hexágono
interface Hexagon {
  id: number;
  style: React.CSSProperties;
}

const HexagonBackground: React.FC = () => {
  const [hexagons, setHexagons] = useState<Hexagon[]>([]);

  // ALTERADO: Aumente este número para gerar mais hexágonos!
  const numHexagons = 40; 

  useEffect(() => {
    const generateHexagons = () => {
      const newHexagons: Hexagon[] = [];
      for (let i = 0; i < numHexagons; i++) {
        const size = 50 + Math.random() * 100; // Tamanho entre 50px e 150px
        const duration = 10 + Math.random() * 15; // Duração entre 10s e 25s
        const delay = Math.random() * 10; // Atraso de até 10s

        newHexagons.push({
          id: i,
          style: {
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          },
        });
      }
      setHexagons(newHexagons);
    };

    generateHexagons();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  return (
    <div className="hexagon-background">
      {hexagons.map(hex => (
        <div 
          key={hex.id} 
          className="rising-hexagon" 
          style={hex.style} 
        />
      ))}
    </div>
  );
};

export default HexagonBackground;