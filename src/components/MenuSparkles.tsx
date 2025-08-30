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
    // Create initial sparkles - increased quantity to 60 for more scattered effect
    const initialSparkles: MenuSparkle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 0.5, // More size variation
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.8 + 0.2,
      life: Math.random() * 180 + 40, // More varied lifespans
      maxLife: Math.random() * 180 + 40,
      delay: Math.random() * 4000, // Longer staggered delays
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
            // Respawn sparkle with more scattered positioning
            return {
              ...sparkle,
              x: Math.random() * 100,
              y: Math.random() * 100,
              size: Math.random() * 6 + 0.5, // More size variation
              color: colors[Math.floor(Math.random() * colors.length)],
              life: Math.random() * 180 + 40, // More varied lifespans
              maxLife: Math.random() * 180 + 40,
              opacity: Math.random() * 0.8 + 0.2,
              delay: Math.random() * 3000, // More staggered timing
            };
          }

          return {
            ...sparkle,
            life: newLife,
            opacity: Math.sin((sparkle.life / sparkle.maxLife) * Math.PI) * 0.6 + 0.3,
            // Add slight movement for more dynamic scattering
            x: sparkle.x + (Math.sin(sparkle.life * 0.02) * 0.1),
            y: sparkle.y + (Math.cos(sparkle.life * 0.015) * 0.05),
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
            {/* More frequent star shapes for scattered effect */}
            {Math.random() < 0.4 && (
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