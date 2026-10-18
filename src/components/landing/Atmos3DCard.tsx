// ATMOS 3D Perspective Tilt Card with Mouse-Following Spotlight & Cybernetic Corner Brackets
// Replicates the interactive cards from atmos-bits.com with authentic 3D spatial depth

'use client';

import React, { useRef, useState, useCallback } from 'react';

interface Atmos3DCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  onClick?: () => void;
}

export const Atmos3DCard: React.FC<Atmos3DCardProps> = ({
  children,
  className = '',
  accentColor = '#00F2A6',
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: -100, y: -100, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate 3D tilt angles (max +/- 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setRotate({ x: rotateX, y: rotateY });
    setSpotlight({ x, y, opacity: 1 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      style={{ perspective: '1000px' }}
      className="w-full"
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'}`,
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.08s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        }}
        className={`atmos-tilt-card relative group rounded-3xl bg-[#080B10]/80 border border-white/10 hover:border-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden cursor-pointer ${className}`}
      >
        {/* Dynamic Interactive Spotlight Sheen */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(550px circle at ${spotlight.x}px ${spotlight.y}px, ${accentColor}18, transparent 65%)`,
          }}
        />

        {/* 4 Cybernetic Corner Crosshairs [+] */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-white/20 group-hover:text-[#00F2A6] transition-colors select-none pointer-events-none">
          +
        </div>
        <div className="absolute top-3 right-3 text-[10px] font-mono text-white/20 group-hover:text-[#00F2A6] transition-colors select-none pointer-events-none">
          +
        </div>
        <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white/20 group-hover:text-[#00F2A6] transition-colors select-none pointer-events-none">
          +
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/20 group-hover:text-[#00F2A6] transition-colors select-none pointer-events-none">
          +
        </div>

        {/* Internal 3D Floating Child Content */}
        <div
          style={{
            transform: isHovered ? 'translateZ(26px)' : 'translateZ(0px)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative z-10 h-full flex flex-col justify-between"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Atmos3DCard;
