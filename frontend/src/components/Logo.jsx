import React from 'react';

const Logo = ({ className = "w-16 h-16" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="95" fill="#0EA5E9" />
      
      {/* Wheat stalks - left */}
      <g transform="translate(30, 80)">
        {/* Stem */}
        <line x1="10" y1="60" x2="10" y2="0" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
        {/* Grains */}
        <ellipse cx="10" cy="8" rx="4" ry="7" fill="#FCD34D" transform="rotate(-15 10 8)"/>
        <ellipse cx="10" cy="18" rx="4" ry="7" fill="#FCD34D" transform="rotate(15 10 18)"/>
        <ellipse cx="10" cy="28" rx="4" ry="7" fill="#FCD34D" transform="rotate(-15 10 28)"/>
        <ellipse cx="10" cy="38" rx="4" ry="7" fill="#FCD34D" transform="rotate(15 10 38)"/>
        <ellipse cx="10" cy="48" rx="4" ry="7" fill="#FCD34D" transform="rotate(-15 10 48)"/>
      </g>
      
      {/* Wheat stalks - right */}
      <g transform="translate(150, 80)">
        {/* Stem */}
        <line x1="10" y1="60" x2="10" y2="0" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
        {/* Grains */}
        <ellipse cx="10" cy="8" rx="4" ry="7" fill="#FCD34D" transform="rotate(15 10 8)"/>
        <ellipse cx="10" cy="18" rx="4" ry="7" fill="#FCD34D" transform="rotate(-15 10 18)"/>
        <ellipse cx="10" cy="28" rx="4" ry="7" fill="#FCD34D" transform="rotate(15 10 28)"/>
        <ellipse cx="10" cy="38" rx="4" ry="7" fill="#FCD34D" transform="rotate(-15 10 38)"/>
        <ellipse cx="10" cy="48" rx="4" ry="7" fill="#FCD34D" transform="rotate(15 10 48)"/>
      </g>
      
      {/* Chef character */}
      <g transform="translate(100, 100)">
        {/* Body/Apron */}
        <path 
          d="M -25 10 L -30 50 L 30 50 L 25 10 Z" 
          fill="white"
        />
        
        {/* Arms crossed */}
        <ellipse cx="-20" cy="25" rx="8" ry="18" fill="#F3F4F6" transform="rotate(-20 -20 25)"/>
        <ellipse cx="20" cy="25" rx="8" ry="18" fill="#F3F4F6" transform="rotate(20 20 25)"/>
        
        {/* Head */}
        <circle cx="0" cy="-5" r="18" fill="#FBBF24"/>
        
        {/* Chef hat */}
        <path 
          d="M -18 -8 Q -20 -25 -10 -28 Q -5 -32 0 -30 Q 5 -32 10 -28 Q 20 -25 18 -8 Z" 
          fill="white"
        />
        <rect x="-18" y="-10" width="36" height="5" fill="white" rx="1"/>
        
        {/* Face details */}
        {/* Eyes */}
        <circle cx="-6" cy="-5" r="2.5" fill="#1F2937"/>
        <circle cx="6" cy="-5" r="2.5" fill="#1F2937"/>
        {/* Eye shine */}
        <circle cx="-5" cy="-6" r="1" fill="white"/>
        <circle cx="7" cy="-6" r="1" fill="white"/>
        
        {/* Smile */}
        <path 
          d="M -8 2 Q 0 6 8 2" 
          stroke="#1F2937" 
          strokeWidth="2" 
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Rosy cheeks */}
        <circle cx="-12" cy="0" r="3" fill="#FCA5A5" opacity="0.6"/>
        <circle cx="12" cy="0" r="3" fill="#FCA5A5" opacity="0.6"/>
      </g>
      
      {/* Bread loaf - left bottom */}
      <g transform="translate(55, 155)">
        <ellipse cx="0" cy="0" rx="15" ry="10" fill="#F59E0B"/>
        <path d="M -10 -3 Q -5 -8 0 -3 Q 5 -8 10 -3" stroke="#D97706" strokeWidth="1.5" fill="none"/>
      </g>
      
      {/* Bread loaf - right bottom */}
      <g transform="translate(145, 155)">
        <ellipse cx="0" cy="0" rx="15" ry="10" fill="#F59E0B"/>
        <path d="M -10 -3 Q -5 -8 0 -3 Q 5 -8 10 -3" stroke="#D97706" strokeWidth="1.5" fill="none"/>
      </g>
      
      {/* Decorative line around */}
      <circle cx="100" cy="100" r="95" stroke="white" strokeWidth="3" fill="none" opacity="0.3"/>
    </svg>
  );
};

export default Logo;
