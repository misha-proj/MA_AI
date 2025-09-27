import React, { useState } from 'react';
import { Plus, Settings, X, Trash2 } from 'lucide-react';
import { Chat, Language } from '../types';
import { ArmenianLogo, ArmenianFlag } from './ArmenianFlag';
import { getTranslation } from '../utils/translations';

interface SidebarProps {
  chats: Chat[];
  currentChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
  onDeleteChats: () => void;
  onDeleteChat: (chatId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onOpenSettings: () => void;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  currentChat,
  onSelectChat,
  onNewChat,
  onDeleteChats,
  onDeleteChat,
  isOpen,
  onToggle,
  onOpenSettings,
  language
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const groupChatsByDate = (chats: Chat[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const groups = {
      today: [] as Chat[],
      sevenDays: [] as Chat[],
      thirtyDays: [] as Chat[],
      older: [] as Chat[]
    };

    chats.forEach(chat => {
      const chatDate = new Date(chat.createdAt);
      if (chatDate >= today) {
        groups.today.push(chat);
      } else if (chatDate >= sevenDaysAgo) {
        groups.sevenDays.push(chat);
      } else if (chatDate >= thirtyDaysAgo) {
        groups.thirtyDays.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  };

  const chatGroups = groupChatsByDate(chats);

  const handleDeleteChats = () => {
    if (showDeleteConfirm) {
      onDeleteChats();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 z-50
        transform transition-all duration-500 ease-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 overflow-hidden
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ArmenianFlag size="sm" language={language} />
            <span className="font-bold text-xl bg-gradient-to-r from-[#D90429] to-[#FF8F00] bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
              MA AI
            </span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-6">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-xl transition-all duration-300 text-white hover:scale-105 hover:shadow-xl shadow-lg border border-white/10"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">{getTranslation(language, 'newChat')}</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {Object.entries(chatGroups).map(([groupKey, groupChats]) => {
            if (groupChats.length === 0) return null;
            
            const groupTitle = getTranslation(language, groupKey === 'today' ? 'today' : groupKey === 'sevenDays' ? 'days7' : groupKey === 'thirtyDays' ? 'days30' : 'older');
            
            return (
              <div key={groupKey} className="mb-8">
                <h3 className="text-sm text-gray-400 mb-3 px-3 font-medium">{groupTitle}</h3>
                {groupChats.map((chat) => (
                  <div key={chat.id} className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => onSelectChat(chat)}
                      className={`flex-1 text-left px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                        currentChat?.id === chat.id
                          ? 'bg-gradient-to-r from-[#D90429]/20 to-[#FF8F00]/20 text-white shadow-xl transform scale-105 border border-white/20'
                          : 'text-gray-300 hover:bg-white/10 backdrop-blur-sm hover:text-white border border-white/5'
                      }`}
                    >
                      <div className="truncate text-sm font-medium">{chat.title}</div>
                    </button>
                    <button
                      onClick={() => onDeleteChat(chat.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Bottom Menu */}
        <div className="border-t border-white/10 p-6">
          <button
            onClick={handleDeleteChats}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-3 hover:scale-105 ${
              showDeleteConfirm
                ? 'bg-red-600 text-white shadow-xl'
                : 'text-gray-300 hover:bg-white/10 backdrop-blur-sm hover:text-white border border-white/10'
            }`}
          >
            <span className="text-sm font-medium">
              {showDeleteConfirm ? 'Подтвердить удаление?' : getTranslation(language, 'deleteAllChats')}
            </span>
          </button>
          
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 hover:text-white border border-white/10 mb-3"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">{getTranslation(language, 'settings')}</span>
          </button>

          {/* Telegram Contact */}
          <a
            href="https://t.me/mi_vs"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-4 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-blue-500/20 hover:from-blue-600/30 hover:to-blue-500/30 rounded-xl transition-all duration-300 text-white hover:scale-105 backdrop-blur-sm border border-blue-500/20 relative overflow-hidden mb-4"
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

          {/* Copyright */}
          <div className="text-center text-xs text-gray-500 mt-4 px-2">
            © 2025 Михаил Айвазян
          </div>
        </div>
      </div>
    </>
  );
};