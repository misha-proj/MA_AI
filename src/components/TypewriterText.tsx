import React, { useEffect, useState } from 'react';
import { getTranslation } from '../utils/translations';
import { Language } from '../types';

interface TypewriterTextProps {
  language: Language;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ language, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const text = getTranslation(language, 'placeholder');

  useEffect(() => {
    // Handle language change
    if (language !== currentLanguage) {
      setIsTransitioning(true);
      setDisplayText('');
      setCharIndex(0);
      setIsDeleting(false);
      
      setTimeout(() => {
        setCurrentLanguage(language);
        setIsTransitioning(false);
      }, 300);
      return;
    }

    if (isTransitioning) return;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (charIndex < text.length) {
          setDisplayText(text.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Wait before starting to delete
          setTimeout(() => setIsDeleting(true), 3000);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setDisplayText(text.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          // Wait before starting to type again
          setTimeout(() => {}, 1000);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, text, language, currentLanguage, isTransitioning]);

  return (
    <div className={`text-xl text-white/90 font-light transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'} ${className}`}>
      {displayText}
      <span className="animate-pulse text-[#D90429] ml-1 transition-all duration-300">|</span>
    </div>
  );
};