import React from 'react';

interface ArmenianFlagProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  blur?: boolean;
  language?: 'ru' | 'hy' | 'en';
}

export const ArmenianFlag: React.FC<ArmenianFlagProps> = ({ 
  className = '', 
  size = 'md', 
  blur = false,
  language = 'hy'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const flagColors = {
    ru: ['#FFFFFF', '#0039A6', '#D52B1E'],
    hy: ['#D90429', '#003F91', '#FF8F00'],
    en: ['#012169', '#FFFFFF', '#C8102E']
  };

  const colors = flagColors[language];

  return (
    <div className={`${sizeClasses[size]} rounded-xl overflow-hidden border border-white/10 shadow-lg relative backdrop-blur-sm ${className}`}>
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 opacity-60" style={{ backgroundColor: colors[0] }} />
        <div className="flex-1 opacity-60" style={{ backgroundColor: colors[1] }} />
        <div className="flex-1 opacity-60" style={{ backgroundColor: colors[2] }} />
      </div>
      {blur && (
        <div className="absolute inset-0 backdrop-blur-sm bg-white/5 rounded-xl"></div>
      )}
    </div>
  );
};

export const ArmenianLogo: React.FC<ArmenianFlagProps> = ({ 
  className = '', 
  size = 'md', 
  blur = false,
  language = 'hy'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      {/* Стильный логотип с горой Арарат */}
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Фон логотипа */}
        <circle cx="60" cy="60" r="58" fill="url(#logoBackground)" stroke="url(#logoBorder)" strokeWidth="2"/>
        
        {/* Гора Арарат стилизованная */}
        <g transform="translate(60, 60)">
          {/* Основная гора */}
          <path 
            d="M-35 15 L-20 -10 L-5 0 L10 -20 L25 -5 L40 15 Z" 
            fill="url(#mountainGradient)"
            opacity="0.9"
          />
          
          {/* Снежные вершины */}
          <path 
            d="M8 -20 L12 -20 L10 -12 Z" 
            fill="#ffffff"
            opacity="0.8"
          />
          <path 
            d="M-22 -10 L-18 -10 L-20 -5 Z" 
            fill="#ffffff"
            opacity="0.6"
          />
          
          {/* Стилизованные буквы M.A. */}
          <text x="-15" y="25" className="text-[12px] font-bold fill-white opacity-90" textAnchor="middle">
            M.A.
          </text>
          
          {/* Армянские мотивы - тонкие линии */}
          <path 
            d="M-30 20 Q-15 18 0 20 Q15 18 30 20" 
            stroke="url(#armenianAccent)" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.7"
          />
        </g>
        
        <defs>
          <linearGradient id="logoBackground" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="50%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
          
          <linearGradient id="logoBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D90429" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#003F91" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF8F00" stopOpacity="0.3" />
          </linearGradient>
          
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6B7280" />
            <stop offset="40%" stopColor="#4B5563" />
            <stop offset="80%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1F2937" />
          </linearGradient>
          
          <linearGradient id="armenianAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D90429" />
            <stop offset="50%" stopColor="#003F91" />
            <stop offset="100%" stopColor="#FF8F00" />
          </linearGradient>
        </defs>
      </svg>
      
      {blur && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20 rounded-full"></div>
      )}
    </div>
  );
};