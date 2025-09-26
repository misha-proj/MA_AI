import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onOpenAdmin: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  onOpenAdmin
}) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminError, setAdminError] = useState('');

  const handleAdminAccess = () => {
    if (adminPassword === '3005') {
      onOpenAdmin();
      setAdminPassword('');
      setShowAdminInput(false);
      setAdminError('');
      onClose();
    } else {
      setAdminError('Неверный пароль');
      setTimeout(() => setAdminError(''), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
          <h2 className="text-xl font-bold text-white">
            {getTranslation(language, 'settings')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-800/50 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Language Selection */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">
              {getTranslation(language, 'language')}
            </h3>
            <div className="space-y-3">
              {[
                { code: 'ru' as const, name: 'Русский' },
                { code: 'hy' as const, name: 'Հայերեն' },
                { code: 'en' as const, name: 'English' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    language === lang.code
                      ? 'bg-gradient-to-r from-[#D90429] to-[#FF8F00] text-white shadow-xl'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 backdrop-blur-sm'
                  }`}
                >
                  <span className="font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Admin Panel Access */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">
              {getTranslation(language, 'adminPanel')}
            </h3>
            {!showAdminInput ? (
              <button
                onClick={() => setShowAdminInput(true)}
                className="w-full flex items-center gap-3 px-6 py-4 bg-gray-800/80 hover:bg-gray-700/80 rounded-2xl transition-all duration-300 text-white hover:scale-105 backdrop-blur-sm"
              >
                <Lock className="w-5 h-5" />
                <span className="font-medium">Доступ к админ панели</span>
              </button>
            ) : (
              <div className="space-y-4">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder={getTranslation(language, 'password')}
                  className="w-full px-6 py-4 bg-gray-800/80 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:border-[#D90429] outline-none backdrop-blur-sm transition-all duration-300"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminAccess()}
                />
                {adminError && (
                  <p className="text-red-400 text-sm px-2">{adminError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleAdminAccess}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D90429] to-[#FF8F00] text-white rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
                  >
                    {getTranslation(language, 'login')}
                  </button>
                  <button
                    onClick={() => {
                      setShowAdminInput(false);
                      setAdminPassword('');
                      setAdminError('');
                    }}
                    className="px-6 py-3 bg-gray-700/80 text-white rounded-2xl hover:bg-gray-600/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Telegram Contact */}
          <div>
            <a
              href="https://t.me/mi_vs"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-blue-600/20 to-blue-500/20 hover:from-blue-600/30 hover:to-blue-500/30 rounded-2xl transition-all duration-300 text-white hover:scale-105 backdrop-blur-sm border border-blue-500/20 relative overflow-hidden"
            >
              {/* Animated waves */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-transparent to-blue-500/30 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-ping"></div>
              </div>
              
              {/* Telegram icon with pulsing effect */}
              <div className="relative">
                <svg className="w-6 h-6 text-blue-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.12.54-.44.67-.89.42l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.43 4.47-4.03c.19-.17-.04-.27-.3-.1L9.28 13.47l-2.38-.75c-.52-.16-.53-.52.11-.77l9.3-3.58c.43-.16.81.1.67.73z"/>
                </svg>
                <div className="absolute inset-0 bg-blue-400/30 rounded-full animate-ping"></div>
              </div>
              
              <span className="font-medium relative z-10">Связаться</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};