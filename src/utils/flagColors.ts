export const flagColors = {
  ru: {
    primary: '#0039A6',
    secondary: '#FFFFFF',
    accent: '#D52B1E',
    gradient: 'from-[#FFFFFF] via-[#0039A6] to-[#D52B1E]',
    background: 'bg-gradient-to-b from-[#FFFFFF]/5 via-[#0039A6]/5 to-[#D52B1E]/5'
  },
  hy: {
    primary: '#D90429',
    secondary: '#003F91',
    accent: '#FF8F00',
    gradient: 'from-[#D90429] via-[#003F91] to-[#FF8F00]',
    background: 'bg-gradient-to-b from-[#D90429]/5 via-[#003F91]/5 to-[#FF8F00]/5'
  },
  en: {
    primary: '#012169',
    secondary: '#FFFFFF',
    accent: '#C8102E',
    gradient: 'from-[#012169] via-[#FFFFFF] to-[#C8102E]',
    background: 'bg-gradient-to-b from-[#012169]/5 via-[#FFFFFF]/5 to-[#C8102E]/5'
  }
};

export const getFlagColors = (language: 'ru' | 'hy' | 'en') => {
  return flagColors[language];
};