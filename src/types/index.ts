export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  model?: string;
  files?: File[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface AppState {
  currentChat: Chat | null;
  chats: Chat[];
  sidebarOpen: boolean;
  settingsOpen: boolean;
  adminOpen: boolean;
  language: 'ru' | 'hy' | 'en';
  selectedModel: 'AM Base' | 'AM Start' | 'AM Pro';
  apiKey: string;
  isTyping: boolean;
  typingText: string;
}

export type Language = 'ru' | 'hy' | 'en';