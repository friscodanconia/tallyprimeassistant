import React from 'react';

interface TallyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function TallyLogo({ className = '', size = 'md', showText = true }: TallyLogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Tally Logo SVG */}
      <div className={`${sizeClasses[size]} flex items-center`}>
        <svg 
          viewBox="0 0 120 40" 
          className={`${sizeClasses[size]} w-auto`}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized "Tally" text */}
          <g>
            {/* T */}
            <path 
              d="M8 8 L8 12 L12 12 L12 32 L16 32 L16 12 L20 12 L20 8 Z" 
              fill="#2D2D2D" 
              stroke="#FF4444" 
              strokeWidth="0.5"
            />
            
            {/* a */}
            <path 
              d="M24 16 Q24 14 26 14 Q28 14 28 16 L28 32 L24 32 L24 30 Q24 32 22 32 Q20 32 20 30 Q20 28 22 28 L24 28 Z M24 24 L22 24 Q23 24 23 25 Q23 26 22 26 Q21 26 21 25 Q21 24 22 24 Z" 
              fill="#2D2D2D" 
              stroke="#FF4444" 
              strokeWidth="0.5"
            />
            
            {/* l */}
            <path 
              d="M32 8 L32 32 L28 32 L28 8 Z" 
              fill="#2D2D2D" 
              stroke="#FF4444" 
              strokeWidth="0.5"
            />
            
            {/* l */}
            <path 
              d="M36 8 L36 32 L32 32 L32 8 Z" 
              fill="#2D2D2D" 
              stroke="#FF4444" 
              strokeWidth="0.5"
            />
            
            {/* y */}
            <path 
              d="M40 16 L40 24 L42 32 L38 32 L37 28 L36 32 L32 32 L34 24 L34 16 L38 16 L38 22 L40 16 Z M40 32 Q40 34 38 34 Q36 34 36 32" 
              fill="#2D2D2D" 
              stroke="#FF4444" 
              strokeWidth="0.5"
            />
          </g>
          
          {/* Underline accent */}
          <line x1="8" y1="36" x2="42" y2="36" stroke="#FF4444" strokeWidth="2"/>
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-800 leading-tight">TallyPrime</span>
          <span className="text-xs text-gray-600 leading-tight">AI Assistant</span>
        </div>
      )}
    </div>
  );
}
