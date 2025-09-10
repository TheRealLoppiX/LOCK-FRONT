import React, { useState, useEffect } from 'react';
import './hexagonobg.css'; // O CSS que vamos alterar a seguir

// Interface para definir as propriedades de cada hexágono
interface Hexagon {
  id: number;
  left: string;
  size: number;
  animationDuration: string;
  animationDelay: string;
}

const HexagonBackground: React.FC = () => {
  const [hexagons, setHexagons] = useState<Hexagon[]>([]);

  useEffect(() => {
    // Cria um novo hexágono a cada 500ms (meio segundo)
    const interval = setInterval(() => {
      createHexagon();
    }, 500);

    // Limpa o intervalo quando o componente é desmontado para evitar vazamento de memória
    return () => clearInterval(interval);
  }, []);

  const createHexagon = () => {
    const id = Date.now() + Math.random();
    const size = Math.random() * (120 - 30) + 30; // Tamanho entre 30px e 120px
    const duration = Math.random() * (18 - 8) + 8; // Duração da animação entre 8s e 18s
    
    const newHexagon: Hexagon = {
      id,
      left: `${Math.random() * 95}%`, // Posição horizontal aleatória
      size,
      animationDuration: `${duration}s`,
      animationDelay: `${Math.random() * 2}s`, // Atraso aleatório para não começarem juntos
    };

    // Adiciona o novo hexágono à lista
    setHexagons(currentHexagons => [...currentHexagons, newHexagon]);

    // Remove o hexágono da lista depois que sua animação terminar
    setTimeout(() => {
      setHexagons(currentHexagons => currentHexagons.filter(hex => hex.id !== id));
    }, duration * 1000 + 2000); // Adiciona um buffer de 2s
  };

  return (
    <div className="hexagon-background">
      {hexagons.map(hex => (
        <div
          key={hex.id}
          className="rising-hexagon"
          style={{
            left: hex.left,
            width: `${hex.size}px`,
            height: `${hex.size * 0.866}px`, // Mantém a proporção do hexágono
            animationDuration: hex.animationDuration,
            animationDelay: hex.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default HexagonBackground;