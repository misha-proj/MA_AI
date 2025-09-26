import React, { useState, useEffect, useRef } from 'react';
import { Menu, Plus } from 'lucide-react';
import { Message, Chat, Language, AppState } from './types';
import { ArmenianLogo, ArmenianFlag } from './components/ArmenianFlag';
import { TypewriterText } from './components/TypewriterText';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { Settings } from './components/Settings';
import { AdminPanel } from './components/AdminPanel';
import { streamChatCompletion } from './utils/openai';
import { getFlagColors } from './utils/flagColors';
import { getTranslation } from './utils/translations';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentChat: null,
    chats: [],
    sidebarOpen: false,
    settingsOpen: false,
    adminOpen: false,
    language: 'ru',
    selectedModel: 'AM Base',
    apiKey: localStorage.getItem('openai_api_key') || '',
    isTyping: false,
    typingText: ''
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('ma_ai_chats');
    const savedLanguage = localStorage.getItem('ma_ai_language') as Language;
    
    if (savedChats) {
      const chats = JSON.parse(savedChats);
      setAppState(prev => ({ ...prev, chats }));
    }
    
    if (savedLanguage) {
      setAppState(prev => ({ ...prev, language: savedLanguage }));
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    localStorage.setItem('ma_ai_chats', JSON.stringify(appState.chats));
  }, [appState.chats]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem('ma_ai_language', appState.language);
  }, [appState.language]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [appState.currentChat?.messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: getTranslation(appState.language, 'newChat'),
      messages: [],
      createdAt: new Date()
    };
    
    setAppState(prev => ({
      ...prev,
      currentChat: newChat,
      chats: [newChat, ...prev.chats],
      sidebarOpen: false
    }));
  };

  const generateChatTitle = (message: string): string => {
    const words = message.trim().split(' ').slice(0, 4);
    let title = words.join(' ');
    if (message.length > 40) {
      title = title.substring(0, 40) + '...';
    }
    return title || getTranslation(appState.language, 'newChat');
  };

  const updateChatTitle = (chat: Chat, firstMessage: string) => {
    const title = generateChatTitle(firstMessage);
    const updatedChat = { ...chat, title };
    
    setAppState(prev => ({
      ...prev,
      currentChat: updatedChat,
      chats: prev.chats.map(c => c.id === chat.id ? updatedChat : c)
    }));
    
    return updatedChat;
  };

  const sendMessage = async (messageText: string, files?: File[]) => {
    if (!appState.apiKey) {
      alert('Пожалуйста, настройте API ключ в админ панели');
      return;
    }

    let currentChat = appState.currentChat;
    
    // Create new chat if none exists
    if (!currentChat) {
      currentChat = {
        id: Date.now().toString(),
        title: generateChatTitle(messageText),
        messages: [],
        createdAt: new Date()
      };
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      files
    };

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage]
    };

    // Update chat title if this is the first message
    let finalChat = updatedChat;
    if (currentChat.messages.length === 0) {
      finalChat = updateChatTitle(updatedChat, messageText);
    }

    setAppState(prev => ({
      ...prev,
      currentChat: finalChat,
      chats: prev.currentChat ? prev.chats.map(c => c.id === finalChat.id ? finalChat : c) : [finalChat, ...prev.chats],
      isTyping: true,
      typingText: ''
    }));

    try {
      // Prepare messages for OpenAI
      const messages = finalChat.messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // Create AI message with buffering
      let aiMessage: Message | null = null;
      let fullResponseBuffer = '';
      let isFirstChunk = true;

      await streamChatCompletion(
        messages,
        appState.selectedModel,
        appState.apiKey,
        (chunk) => {
          // Buffer the full response
          fullResponseBuffer += chunk;
          
          if (isFirstChunk) {
            aiMessage = {
              id: (Date.now() + 1).toString(),
              text: '',
              sender: 'ai',
              timestamp: new Date(),
              model: appState.selectedModel
            };
            isFirstChunk = false;
            
            // Add the message to state immediately but with empty text
            setAppState(prev => {
              const chatWithAI = {
                ...prev.currentChat!,
                messages: [...prev.currentChat!.messages, aiMessage!]
              };
              return {
                ...prev,
                currentChat: chatWithAI,
                chats: prev.chats.map(c => c.id === chatWithAI.id ? chatWithAI : c)
              };
            });
          }
        },
        () => {
          // When streaming is complete, start the typing animation
          if (aiMessage && fullResponseBuffer) {
            aiMessage.text = fullResponseBuffer;
            
            setAppState(prev => {
              const chatWithAI = {
                ...prev.currentChat!,
                messages: prev.currentChat!.messages.map(m => 
                  m.id === aiMessage!.id ? aiMessage! : m
                )
              };
              return {
                ...prev,
                currentChat: chatWithAI,
                chats: prev.chats.map(c => c.id === chatWithAI.id ? chatWithAI : c),
                isTyping: false
              };
            });
          }
        }
      );

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибка при обработке запроса. Пожалуйста, проверьте API ключ и попробуйте снова.',
        sender: 'ai',
        timestamp: new Date(),
        model: appState.selectedModel
      };
      
      const errorChat = {
        ...finalChat,
        messages: [...finalChat.messages, errorMessage]
      };

      setAppState(prev => ({
        ...prev,
        currentChat: errorChat,
        chats: prev.chats.map(c => c.id === errorChat.id ? errorChat : c),
        isTyping: false
      }));
    }
  };

  const regenerateLastMessage = () => {
    if (!appState.currentChat?.messages.length) return;
    
    const messages = appState.currentChat.messages;
    const lastAiMessageIndex = messages.map((msg, index) => ({ msg, index }))
      .reverse()
      .find(({ msg }) => msg.sender === 'ai')?.index;
    
    if (lastAiMessageIndex !== undefined) {
      // Remove the last AI message and regenerate
      const filteredMessages = messages.slice(0, lastAiMessageIndex);
      
      const updatedChat = {
        ...appState.currentChat,
        messages: filteredMessages
      };
      
      setAppState(prev => ({
        ...prev,
        currentChat: updatedChat,
        chats: prev.chats.map(c => c.id === updatedChat.id ? updatedChat : c)
      }));
      
      // Regenerate AI response
      regenerateAiResponse(updatedChat);
    }
  };

  const regenerateAiResponse = async (chat: Chat) => {
    if (!appState.apiKey) return;

    setAppState(prev => ({ ...prev, isTyping: true, typingText: '' }));

    try {
      const messages = chat.messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      let aiMessage: Message | null = null;
      let fullResponseBuffer = '';
      let isFirstChunk = true;

      await streamChatCompletion(
        messages,
        appState.selectedModel,
        appState.apiKey,
        (chunk) => {
          fullResponseBuffer += chunk;
          
          if (isFirstChunk) {
            aiMessage = {
              id: Date.now().toString(),
              text: '',
              sender: 'ai',
              timestamp: new Date(),
              model: appState.selectedModel
            };
            isFirstChunk = false;
            
            setAppState(prev => {
              const chatWithAI = {
                ...prev.currentChat!,
                messages: [...prev.currentChat!.messages, aiMessage!]
              };
              return {
                ...prev,
                currentChat: chatWithAI,
                chats: prev.chats.map(c => c.id === chatWithAI.id ? chatWithAI : c)
              };
            });
          }
        },
        () => {
          if (aiMessage && fullResponseBuffer) {
            aiMessage.text = fullResponseBuffer;
            
            setAppState(prev => {
              const chatWithAI = {
                ...prev.currentChat!,
                messages: prev.currentChat!.messages.map(m => 
                  m.id === aiMessage!.id ? aiMessage! : m
                )
              };
              return {
                ...prev,
                currentChat: chatWithAI,
                chats: prev.chats.map(c => c.id === chatWithAI.id ? chatWithAI : c),
                isTyping: false
              };
            });
          }
        }
      );
    } catch (error) {
      console.error('Error regenerating message:', error);
      setAppState(prev => ({ ...prev, isTyping: false }));
    }
  };

  const handleApiKeyChange = (newApiKey: string) => {
    localStorage.setItem('openai_api_key', newApiKey);
    setAppState(prev => ({ ...prev, apiKey: newApiKey }));
  };

  const deleteAllChats = () => {
    setAppState(prev => ({
      ...prev,
      chats: [],
      currentChat: null
    }));
  };

  const toggleLanguage = () => {
    const languages: Language[] = ['ru', 'hy', 'en'];
    const currentIndex = languages.indexOf(appState.language);
    const nextLanguage = languages[(currentIndex + 1) % languages.length];
    setAppState(prev => ({ ...prev, language: nextLanguage }));
  };

  const flagColors = getFlagColors(appState.language);

  return (
    <div className={`min-h-screen text-white transition-all duration-700 ease-in-out ${
      appState.language === 'hy' 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden' 
        : 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
    }`}>
      
      {/* Armenian flag background when Armenian language is selected */}
      {appState.language === 'hy' && (
        <div className="absolute inset-0 opacity-3 pointer-events-none blur-sm">
          <div className="absolute inset-0 bg-gradient-to-b from-[#D90429]/3 via-[#003F91]/3 to-[#FF8F00]/3" />
        </div>
      )}

      {/* Main Layout */}
      <div className={`flex h-screen transition-all duration-700 ease-in-out ${
        appState.sidebarOpen ? 'lg:ml-80' : ''
      }`}>
        {/* Main Content */}
        <div className="flex flex-col w-full">
          {/* Header */}
          <header className="flex items-center justify-between p-6 border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/80 shadow-lg">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAppState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))}
                className="p-3 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-800/50 hover:scale-110"
              >
                <Menu className="w-5 h-5" />
              </button>
              <ArmenianFlag size="sm" language={appState.language} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#D90429] via-[#003F91] to-[#FF8F00] bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
                MA AI
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={createNewChat}
                className="p-3 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-800/30 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={toggleLanguage}
                className="transition-all duration-300 hover:scale-105 rounded-xl"
              >
                <ArmenianFlag size="sm" language={appState.language} />
              </button>
            </div>
          </header>

          {/* Chat Area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 py-8">
            {!appState.currentChat?.messages.length ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="mb-12 flex justify-center">
                    <ArmenianLogo size="lg" className={appState.isTyping ? 'animate-pulse' : ''} language={appState.language} />
                  </div>
                  <TypewriterText language={appState.language} />
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {appState.currentChat.messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isLast={index === appState.currentChat!.messages.length - 1}
                    onRegenerate={regenerateLastMessage}
                    language={appState.language}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Chat Input */}
          <ChatInput
            onSendMessage={sendMessage}
            disabled={appState.isTyping}
            language={appState.language}
            selectedModel={appState.selectedModel}
            onModelChange={(model) => setAppState(prev => ({ ...prev, selectedModel: model }))}
            flagColors={flagColors}
          />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        chats={appState.chats}
        currentChat={appState.currentChat}
        onSelectChat={(chat) => setAppState(prev => ({ ...prev, currentChat: chat, sidebarOpen: false }))}
        onNewChat={createNewChat}
        onDeleteChats={deleteAllChats}
        isOpen={appState.sidebarOpen}
        onToggle={() => setAppState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))}
        onOpenSettings={() => setAppState(prev => ({ ...prev, settingsOpen: true }))}
        language={appState.language}
      />

      {/* Settings Modal */}
      <Settings
        isOpen={appState.settingsOpen}
        onClose={() => setAppState(prev => ({ ...prev, settingsOpen: false }))}
        language={appState.language}
        onLanguageChange={(language) => setAppState(prev => ({ ...prev, language }))}
        onOpenAdmin={() => setAppState(prev => ({ ...prev, adminOpen: true }))}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={appState.adminOpen}
        onClose={() => setAppState(prev => ({ ...prev, adminOpen: false }))}
        language={appState.language}
        apiKey={appState.apiKey}
        onApiKeyChange={handleApiKeyChange}
      />
    </div>
  );
}

export default App;