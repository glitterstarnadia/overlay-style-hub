import React from 'react';

interface GlitterBorderProps {
  children: React.ReactNode;
  className?: string;
}

const GlitterBorder: React.FC<GlitterBorderProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative group ${className}`} style={{ padding: '4px' }}>
      {/* Main content */}
      <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
        {children}
      </div>
      
      {/* Animated glitter border background */}
      <div className="absolute inset-0 rounded-lg pointer-events-none">
        <div className="absolute inset-0 rounded-lg border-4 border-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" 
             style={{ 
               background: 'linear-gradient(45deg, #ff69b4, #da70d6, #9370db, #00bfff, #ffff00, #ff69b4)',
               backgroundSize: '400% 400%',
               animation: 'glitter-border 2s linear infinite, gradient-cycle 6s ease infinite',
             }}>
        </div>
        
        {/* Multiple layers of sparkle particles */}
        {/* Layer 1 - Corner sparkles */}
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={`corner-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full opacity-90"
            style={{
              top: i < 2 ? '2px' : 'calc(100% - 10px)',
              left: i % 2 === 0 ? '2px' : 'calc(100% - 10px)',
              animation: `sparkle-dance 1.5s ease-in-out infinite ${i * 0.2}s`,
              filter: 'drop-shadow(0 0 4px #ff69b4)',
              boxShadow: '0 0 8px #ffffff, 0 0 12px #ff69b4',
            }}
          />
        ))}
        
        {/* Layer 2 - Edge sparkles */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={`edge-${i}`}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-80"
            style={{
              top: i < 3 ? '0px' : i < 6 ? '100%' : `${25 + (i - 6) * 16}%`,
              left: i < 3 ? `${25 + i * 16}%` : i < 6 ? `${25 + (i - 3) * 16}%` : i < 9 ? '0px' : '100%',
              animation: `sparkle-dance 2s ease-in-out infinite ${i * 0.15}s`,
              filter: 'drop-shadow(0 0 3px #da70d6)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        
        {/* Layer 3 - Floating sparkles */}
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={`float-${i}`}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full opacity-70"
            style={{
              top: `${10 + Math.sin(i) * 80}%`,
              left: `${10 + Math.cos(i) * 80}%`,
              animation: `sparkle-dance 2.5s ease-in-out infinite ${i * 0.1}s, float-around 4s ease-in-out infinite ${i * 0.2}s`,
              filter: 'drop-shadow(0 0 2px #ffff00)',
            }}
          />
        ))}
        
        {/* Layer 4 - Glitter dust */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`glitter-${i}`}
            className="absolute rounded-full opacity-60"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: ['#ffffff', '#ff69b4', '#da70d6', '#00bfff', '#ffff00'][Math.floor(Math.random() * 5)],
              animation: `sparkle-dance 3s ease-in-out infinite ${i * 0.05}s`,
              filter: 'drop-shadow(0 0 1px currentColor)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GlitterBorder;