import React from 'react';

interface GlitterBorderProps {
  children: React.ReactNode;
  className?: string;
}

const GlitterBorder: React.FC<GlitterBorderProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
};

export default GlitterBorder;