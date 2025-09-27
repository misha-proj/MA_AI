import React, { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import { Language } from '../types';

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  disabled: boolean;
  language: Language;
  selectedModel: 'AM Base' | 'AM Start' | 'AM Pro';
  onModelChange: (model: 'AM Base' | 'AM Start' | 'AM Pro') => void;
  flagColors: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    background: string;
  };
}

const models = [
  { name: 'AM Base' as const },
  { name: 'AM Start' as const },
  { name: 'AM Pro' as const }
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
  language,
  selectedModel,
  onModelChange,
  flagColors
}) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [filesLoading, setFilesLoading] = useState<boolean[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || files.length > 0) && !disabled && filesLoading.every(loading => !loading)) {
      onSendMessage(message, files);
      setMessage('');
      setFiles([]);
      setFilesLoading([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const newLoadingStates = selectedFiles.map(() => true);
      setFilesLoading(prev => [...prev, ...newLoadingStates]);
      
      selectedFiles.forEach((file, index) => {
        setTimeout(() => {
          setFiles(prev => [...prev, file]);
          setFilesLoading(prev => {
            const newStates = [...prev];
            newStates[prev.length - selectedFiles.length + index] = false;
            return newStates;
          });
        }, 1000 + index * 200);
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setFilesLoading(filesLoading.filter((_, i) => i !== index));
  };

  const canSend = (message.trim() || files.length > 0) && !disabled && filesLoading.every(loading => !loading);

  return (
    <div className="border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto p-6">
        {/* Model Selection */}
        <div className={`mb-4 transition-all duration-500 ${files.length > 0 || filesLoading.some(Boolean) ? 'transform -translate-y-2' : ''}`}>
          <div className="flex gap-3 justify-center">
            {models.map((model) => (
              <button
                key={model.name}
                onClick={() => onModelChange(model.name)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10 ${
                  selectedModel === model.name
                    ? 'bg-white/10 text-white shadow-lg transform scale-105 border-white/20'
                    : 'bg-gray-800/40 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <div className="font-medium">{model.name}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* File Previews */}
        {(files.length > 0 || filesLoading.some(Boolean)) && (
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex-shrink-0 relative bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 border border-gray-700/50 transform transition-all duration-700 ease-out animate-slideUp shadow-lg"
              >
                {file.type.startsWith('image/') ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-700 relative">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <X className="w-3 h-3 mx-auto" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 min-w-24">
                    <Paperclip className="w-4 h-4" style={{ color: flagColors.primary }} />
                    <span className="text-sm text-gray-300 truncate max-w-20">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 ml-1 transition-all duration-200 hover:scale-110"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filesLoading.map((loading, index) => loading && (
              <div key={`loading-${index}`} className="flex-shrink-0 w-20 h-20 bg-gray-800/60 rounded-2xl border border-gray-700/30 animate-pulse relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: flagColors.primary, borderTopColor: 'transparent' }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div 
            className="relative flex items-end bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-500 focus-within:shadow-2xl focus-within:border-white/20 shadow-xl"
            style={{ 
              '--focus-border-color': flagColors.primary,
              '--focus-shadow-color': flagColors.primary + '20'
            } as React.CSSProperties}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Сообщение..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 border-none outline-none resize-none px-6 py-4 max-h-32 min-h-[60px] transition-all duration-300 rounded-xl"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              style={{
                height: 'auto',
                minHeight: '60px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            
            <div className="flex items-center gap-3 px-4 pb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-400 transition-all duration-300 hover:scale-110 rounded-xl hover:bg-white/10 hover:text-white"
                disabled={disabled}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <button
                type="submit"
                disabled={!canSend}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
                  canSend
                    ? `bg-gradient-to-r ${flagColors.gradient} text-white hover:shadow-xl hover:scale-110 active:scale-95 shadow-lg`
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};