import React, { useState } from 'react';
import { Plus, Settings, X } from 'lucide-react';
import { Chat, Language } from '../types';
import { ArmenianLogo, ArmenianFlag } from './ArmenianFlag';
import { getTranslation } from '../utils/translations';

interface SidebarProps {
  chats: Chat[];
  currentChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
  onDeleteChats: () => void;
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
        fixed top-0 left-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 z-50
        transform transition-all duration-500 ease-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <ArmenianFlag size="sm" language={language} />
            <span className="font-bold text-xl bg-gradient-to-r from-[#D90429] to-[#FF8F00] bg-clip-text text-transparent">MA AI</span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-800/50 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-6">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm hover:from-gray-700/80 hover:to-gray-600/80 rounded-2xl transition-all duration-300 text-white hover:scale-105 hover:shadow-xl shadow-lg"
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
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat)}
                    className={`w-full text-left px-4 py-3 rounded-2xl mb-2 transition-all duration-300 hover:scale-105 ${
                      currentChat?.id === chat.id
                        ? 'bg-gradient-to-r from-[#D90429] to-[#FF8F00] text-white shadow-xl transform scale-105'
                        : 'text-gray-300 hover:bg-gray-800/60 backdrop-blur-sm hover:text-white'
                    }`}
                  >
                    <div className="truncate text-sm font-medium">{chat.title}</div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Bottom Menu */}
        <div className="border-t border-gray-800/50 p-6">
          <button
            onClick={handleDeleteChats}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 mb-3 hover:scale-105 ${
              showDeleteConfirm
                ? 'bg-red-600 text-white shadow-xl'
                : 'text-gray-300 hover:bg-gray-800/60 backdrop-blur-sm hover:text-white'
            }`}
          >
            <span className="text-sm font-medium">
              {showDeleteConfirm ? 'Подтвердить удаление?' : getTranslation(language, 'deleteAllChats')}
            </span>
          </button>
          
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/60 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:scale-105 hover:text-white"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">{getTranslation(language, 'settings')}</span>
          </button>
        </div>
      </div>
    </>
  );
};