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
    <div className={`${sizeClasses[size]} rounded-lg overflow-hidden border border-white/20 shadow-lg relative backdrop-blur-sm ${className} transition-all duration-500 hover:scale-110 animate-pulse`}>
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 opacity-80" style={{ backgroundColor: colors[0] }} />
        <div className="flex-1 opacity-80" style={{ backgroundColor: colors[1] }} />
        <div className="flex-1 opacity-80" style={{ backgroundColor: colors[2] }} />
      </div>
      {blur && (
        <div className="absolute inset-0 backdrop-blur-sm bg-white/5 rounded-lg"></div>
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
      {/* Премиум логотип с горой Арарат */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Фон с тонким градиентом */}
        <defs>
          <linearGradient id="premiumBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#374151" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#111827" stopOpacity="0.9" />
          </linearGradient>
          
          <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9CA3AF" />
            <stop offset="30%" stopColor="#6B7280" />
            <stop offset="70%" stopColor="#4B5563" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          
          <linearGradient id="armenianGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D90429" />
            <stop offset="50%" stopColor="#FF8F00" />
            <stop offset="100%" stopColor="#003F91" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Основа логотипа */}
        <rect width="100" height="100" rx="20" fill="url(#premiumBg)" stroke="url(#armenianGold)" strokeWidth="1" opacity="0.9"/>
        
        {/* Гора Арарат - стилизованная */}
        <g transform="translate(50, 50)">
          {/* Главная вершина */}
          <path 
            d="M-25 10 L-15 -15 L-5 -8 L5 -20 L15 -12 L25 10 Z" 
            fill="url(#mountainGrad)"
            filter="url(#glow)"
          />
          
          {/* Малая вершина */}
          <path 
            d="M-35 10 L-28 -5 L-20 2 L-15 10 Z" 
            fill="url(#mountainGrad)"
            opacity="0.8"
          />
          
          {/* Снежные вершины */}
          <path d="M3 -20 L7 -20 L5 -15 Z" fill="#ffffff" opacity="0.9"/>
          <path d="M-17 -15 L-13 -15 L-15 -10 Z" fill="#ffffff" opacity="0.7"/>
          
          {/* Стилизованные буквы M.A. */}
          <text x="0" y="20" className="text-[10px] font-bold" fill="url(#armenianGold)" textAnchor="middle" filter="url(#glow)">
            M.A.
          </text>
          
          {/* Армянские декоративные элементы */}
          <circle cx="-20" cy="15" r="1" fill="#D90429" opacity="0.6"/>
          <circle cx="20" cy="15" r="1" fill="#FF8F00" opacity="0.6"/>
          <circle cx="0" cy="25" r="1" fill="#003F91" opacity="0.6"/>
          
          {/* Тонкая декоративная линия */}
          <path 
            d="M-30 18 Q0 16 30 18" 
            stroke="url(#armenianGold)" 
            strokeWidth="0.5" 
            fill="none" 
            opacity="0.5"
          />
        </g>
      </svg>
      
      {blur && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20 rounded-xl"></div>
      )}
    </div>
  );
};