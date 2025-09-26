import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, CreditCard as Edit3 } from 'lucide-react';
import { Message } from '../types';
import { ArmenianLogo } from './ArmenianFlag';

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
  onRegenerate?: () => void;
  language: 'ru' | 'hy' | 'en';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLast,
  onRegenerate,
  language
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Animate message appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (message.sender === 'ai' && isLast && message.text) {
      // Start with thinking state
      setIsThinking(true);
      setDisplayText('');
      
      // Wait for thinking period
      setTimeout(() => {
        setIsThinking(false);
        setIsTyping(true);
        
        // Start typing animation
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
          if (currentIndex < message.text.length) {
            setDisplayText(message.text.substring(0, currentIndex + 1));
            currentIndex++;
          } else {
            clearInterval(typeInterval);
            setIsTyping(false);
          }
        }, 25); // 25ms per character for smooth typing
        
        return () => clearInterval(typeInterval);
      }, 1200); // 1.2 seconds thinking time
    } else {
      setDisplayText(message.text);
    }
  }, [message.text, message.sender, isLast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text);
  };

  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'} transform transition-all duration-700 ease-out animate-slideUp ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`}>
      {!isUser && (
        <div className={`mt-1 relative transition-all duration-300 ${isTyping || isThinking ? 'animate-pulse' : ''}`}>
          <ArmenianLogo size="sm" blur={isTyping} language={language} />
          {(isTyping || isThinking) && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-ping"></div>
          )}
        </div>
      )}
      
      <div className={`max-w-[75%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`px-6 py-4 rounded-xl transition-all duration-500 backdrop-blur-sm relative overflow-hidden ${
            isUser
              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-white/10'
              : 'bg-gray-800/60 text-white border border-gray-700/30'
          }`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {/* Flowing gradient for AI messages during typing */}
          {!isUser && (isTyping || isThinking) && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-[#D90429]/10 via-[#003F91]/10 to-[#FF8F00]/10 flowing-gradient"></div>
              <div className="absolute inset-0 rounded-xl border border-gradient-to-r from-[#D90429]/20 via-[#003F91]/20 to-[#FF8F00]/20 animate-pulse"></div>
            </>
          )}
          
          <div className={`whitespace-pre-wrap leading-relaxed relative z-10 ${
            (isTyping || isThinking) && !isUser ? 'typing-animation' : ''
          }`}>
            {isThinking ? (
              <span className="text-gray-300 animate-pulse">Думаю...</span>
            ) : (
              displayText
            )}
            {isTyping && (
              <span className="inline-block w-0.5 h-5 ml-1 bg-[#D90429] animate-pulse rounded-full"></span>
            )}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 mt-3 transition-all duration-300 ${
          showActions || isTyping || isThinking ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-xl bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/40 transition-all duration-300 hover:scale-105 border border-white/10"
            title="Копировать"
          >
            <Copy className="w-4 h-4 text-gray-400" />
          </button>
          
          {!isUser && (
            <button
              onClick={onRegenerate}
              className="p-2 rounded-xl bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/40 transition-all duration-300 hover:scale-105 border border-white/10"
              title="Сгенерировать заново"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
          )}
          
          {isUser && (
            <button
              className="p-2 rounded-xl bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/40 transition-all duration-300 hover:scale-105 border border-white/10"
              title="Редактировать"
            >
              <Edit3 className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};