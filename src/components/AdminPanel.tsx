import React, { useState } from 'react';
import { X, Key, Save } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import { Language } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  language,
  apiKey,
  onApiKeyChange
}) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onApiKeyChange(localApiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
          <h2 className="text-xl font-bold text-white">
            {getTranslation(language, 'adminPanel')}
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
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              {getTranslation(language, 'apiKey')}
            </h3>
            <div className="space-y-4">
              <input
                type="password"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-6 py-4 bg-gray-800/80 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:border-[#D90429] outline-none font-mono backdrop-blur-sm transition-all duration-300"
              />
              <button
                onClick={handleSave}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  saved
                    ? 'bg-green-600 text-white shadow-xl'
                    : 'bg-gradient-to-r from-[#D90429] to-[#FF8F00] text-white hover:shadow-xl'
                }`}
              >
                <Save className="w-5 h-5" />
                <span className="font-medium">{saved ? 'Сохранено!' : 'Сохранить'}</span>
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-3 px-2">
              API ключ сохраняется локально и используется для подключения к OpenAI
            </p>
          </div>

          {/* API Status */}
          <div className="border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm bg-gray-800/30">
            <h4 className="text-white font-medium mb-3">Статус API</h4>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                apiKey ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-red-500 shadow-lg shadow-red-500/30'
              }`} />
              <span className="text-sm text-gray-300">
                {apiKey ? 'API ключ настроен' : 'API ключ не настроен'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};