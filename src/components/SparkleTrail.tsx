import React, { useEffect, useState, useCallback } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

const SparkleTrail: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const colors = ['#ff69b4', '#ffc0cb', '#da70d6', '#ba55d3', '#9370db', '#ffffff', '#ffb3d6', '#f8bbd9'];

  const createSparkle = useCallback((x: number, y: number, isClick = false): Sparkle => {
    const velocity = isClick 
      ? { 
          x: (Math.random() - 0.5) * 6, 
          y: (Math.random() - 0.5) * 6 
        }
      : { 
          x: (Math.random() - 0.5) * 2, 
          y: (Math.random() - 0.5) * 2 + 1 
        };

    return {
      id: Math.random(),
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * (isClick ? 8 : 4) + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      velocity,
      life: isClick ? 60 : 30,
      maxLife: isClick ? 60 : 30,
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (Math.random() < 0.3) { // 30% chance to create sparkle on mouse move
      const newSparkle = createSparkle(e.clientX, e.clientY);
      setSparkles(prev => [...prev, newSparkle]);
    }
  }, [createSparkle]);

  const handleClick = useCallback((e: MouseEvent) => {
    // Create burst of sparkles on click
    const newSparkles = Array.from({ length: 8 }, () => 
      createSparkle(e.clientX, e.clientY, true)
    );
    setSparkles(prev => [...prev, ...newSparkles]);
  }, [createSparkle]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleClick]);

  useEffect(() => {
    const animationFrame = () => {
      setSparkles(prev => 
        prev
          .map(sparkle => ({
            ...sparkle,
            x: sparkle.x + sparkle.velocity.x,
            y: sparkle.y + sparkle.velocity.y,
            life: sparkle.life - 1,
            opacity: Math.max(0, sparkle.life / sparkle.maxLife),
            velocity: {
              x: sparkle.velocity.x * 0.98,
              y: sparkle.velocity.y * 0.98 + 0.1, // gravity
            },
          }))
          .filter(sparkle => sparkle.life > 0)
      );
    };

    const interval = setInterval(animationFrame, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute animate-pulse"
          style={{
            left: sparkle.x - sparkle.size / 2,
            top: sparkle.y - sparkle.size / 2,
            width: sparkle.size,
            height: sparkle.size,
            opacity: sparkle.opacity,
            transform: `rotate(${sparkle.life * 10}deg)`,
            transition: 'opacity 0.1s ease-out',
          }}
        >
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle, ${sparkle.color} 0%, transparent 70%)`,
              borderRadius: '50%',
              boxShadow: `0 0 ${sparkle.size}px ${sparkle.color}`,
            }}
          />
          {/* Star shape for some sparkles */}
          {Math.random() < 0.3 && (
            <div
              className="absolute inset-0 flex items-center justify-center text-white font-bold"
              style={{
                fontSize: sparkle.size / 2,
                color: sparkle.color,
                textShadow: `0 0 ${sparkle.size}px ${sparkle.color}`,
              }}
            >
              ✨
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SparkleTrail;