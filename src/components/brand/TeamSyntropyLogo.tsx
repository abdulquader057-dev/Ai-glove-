import React from 'react';

interface TeamSyntropyLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const TeamSyntropyLogo: React.FC<TeamSyntropyLogoProps> = ({
  className = '',
  width = 220,
  height = 50,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        <linearGradient id="syntropyTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F2A6" />
          <stop offset="100%" stopColor="#00D2FF" />
        </linearGradient>
        <filter id="cyberGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g transform="translate(10, 10)">
        <path
          d="M 20 70 C 20 40, 45 20, 60 50 C 75 80, 100 60, 100 30"
          stroke="url(#syntropyTeal)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          filter="url(#cyberGlow)"
        />
        <path
          d="M 35 85 C 35 60, 55 40, 70 65 C 85 90, 110 70, 110 45"
          stroke="#00D2FF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="0.7"
          fill="none"
        />
        <path
          d="M 10 55 C 20 30, 40 15, 55 35 C 70 55, 90 40, 95 20"
          stroke="#00F2A6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          fill="none"
        />
        <circle cx="60" cy="50" r="5" fill="#00F2A6" filter="url(#cyberGlow)" />
        <circle cx="70" cy="65" r="4" fill="#00D2FF" />
        <circle cx="100" cy="30" r="4.5" fill="#00F2A6" />
      </g>
      <text
        x="135"
        y="58"
        fontFamily="'Space Grotesk', 'Inter', sans-serif"
        fontWeight="800"
        fontSize="34"
        letterSpacing="6"
        fill="#FFFFFF"
      >
        SYNTROPY
      </text>
      <text
        x="137"
        y="82"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="500"
        fontSize="11"
        letterSpacing="4"
        fill="#00F2A6"
      >
        ASSISTIVE KINEMATICS LAB
      </text>
    </svg>
  );
};

export default TeamSyntropyLogo;
