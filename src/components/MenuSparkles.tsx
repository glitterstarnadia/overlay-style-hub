import React, { useEffect, useState } from 'react';

interface MenuSparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  delay: number;
}

const MenuSparkles: React.FC = () => {
  const [sparkles, setSparkles] = useState<MenuSparkle[]>([]);

  const colors = ['#ffffff', '#ffb3d6', '#ffe6f2', '#f8bbd9', '#fce7f3'];

  useEffect(() => {
    // Create initial sparkles - increased quantity to 35
    const initialSparkles: MenuSparkle[] = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.9 + 0.1,
      life: Math.random() * 120 + 60,
      maxLife: Math.random() * 120 + 60,
      delay: Math.random() * 3000,
    }));

    setSparkles(initialSparkles);

    const animationInterval = setInterval(() => {
      setSparkles(prev => {
        return prev.map(sparkle => {
          if (sparkle.delay > 0) {
            return { ...sparkle, delay: sparkle.delay - 16 };
          }

          const newLife = sparkle.life - 1;
          if (newLife <= 0) {
            // Respawn sparkle
            return {
              ...sparkle,
              x: Math.random() * 100,
              y: Math.random() * 100,
              size: Math.random() * 4 + 1,
              color: colors[Math.floor(Math.random() * colors.length)],
              life: Math.random() * 120 + 60,
              maxLife: Math.random() * 120 + 60,
              opacity: Math.random() * 0.9 + 0.1,
              delay: Math.random() * 2000,
            };
          }

          return {
            ...sparkle,
            life: newLife,
            opacity: Math.sin((sparkle.life / sparkle.maxLife) * Math.PI) * 0.7 + 0.2,
          };
        });
      });
    }, 16); // ~60fps

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map(sparkle => (
        sparkle.delay <= 0 && (
          <div
            key={sparkle.id}
            className="absolute animate-pulse"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
              opacity: sparkle.opacity,
              transform: `rotate(${sparkle.life * 2}deg)`,
              transition: 'opacity 0.3s ease-out',
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, ${sparkle.color} 0%, transparent 70%)`,
                boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
                filter: 'brightness(1.5)',
              }}
            />
            {/* Random star shapes */}
            {Math.random() < 0.3 && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  fontSize: sparkle.size * 0.8,
                  color: sparkle.color,
                  textShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
                }}
              >
                ✨
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default MenuSparkles;