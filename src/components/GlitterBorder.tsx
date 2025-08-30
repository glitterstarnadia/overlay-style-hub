import React from 'react';

interface GlitterBorderProps {
  children: React.ReactNode;
  className?: string;
}

const GlitterBorder: React.FC<GlitterBorderProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Main content */}
      {children}
      
      {/* Animated glitter border */}
      <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
        <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-spin-slow" 
             style={{ 
               background: 'linear-gradient(45deg, #ff69b4, #da70d6, #9370db, #00bfff, #ff69b4)',
               backgroundSize: '400% 400%',
               animation: 'glitter-border 3s linear infinite, gradient-cycle 8s ease infinite',
               mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
               maskComposite: 'xor',
               WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
               WebkitMaskComposite: 'xor',
               padding: '2px'
             }}>
        </div>
        
        {/* Sparkle particles around border */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-80"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `sparkle-dance 2s ease-in-out infinite ${i * 0.25}s`,
              filter: 'drop-shadow(0 0 2px #ff69b4)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GlitterBorder;