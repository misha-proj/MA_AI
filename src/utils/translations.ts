import { Language } from '../types';

export const translations = {
  ru: {
    placeholder: 'Какой у вас вопрос?',
    messagePlaceholder: 'Введите сообщение...',
    newChat: 'Новый чат',
    settings: 'Настройки',
    language: 'Язык',
    deleteAllChats: 'Удалить все чаты',
    adminPanel: 'Админ панель',
    apiKey: 'API ключ OpenAI',
    password: 'Пароль',
    login: 'Войти',
    russian: 'Русский',
    armenian: 'Հայերեն',
    english: 'English',
    copy: 'Копировать',
    edit: 'Редактировать',
    regenerate: 'Сгенерировать заново',
    today: 'Сегодня',
    days7: '7 дней назад',
    days30: '30 дней назад'
  },
  hy: {
    placeholder: 'Ինչո՞վ կարող եմ օգնել ձեզ:',
    messagePlaceholder: 'Գրեք հաղորդագրություն...',
    newChat: 'Նոր զրույց',
    settings: 'Կարգավորումներ',
    language: 'Լեզու',
    deleteAllChats: 'Ջնջել բոլոր զրույցները',
    adminPanel: 'Ադմին վահան',
    apiKey: 'OpenAI API բանալի',
    password: 'Գաղտնաբառ',
    login: 'Մուտք',
    russian: 'Ռուսերեն',
    armenian: 'Հայերեն',
    english: 'Անգլերեն',
    copy: 'Պատճենել',
    edit: 'Խմբագրել',
    regenerate: 'Նորից ստեղծել',
    today: 'Այսօր',
    days7: '7 օր առաջ',
    days30: '30 օր առաջ'
  },
  en: {
    placeholder: 'How can I help you?',
    messagePlaceholder: 'Enter message...',
    newChat: 'New chat',
    settings: 'Settings',
    language: 'Language',
    deleteAllChats: 'Delete all chats',
    adminPanel: 'Admin Panel',
    apiKey: 'OpenAI API Key',
    password: 'Password',
    login: 'Login',
    russian: 'Русский',
    armenian: 'Հայերեն',
    english: 'English',
    copy: 'Copy',
    edit: 'Edit',
    regenerate: 'Regenerate',
    today: 'Today',
    days7: '7 days ago',
    days30: '30 days ago'
  }
};

export const getTranslation = (language: Language, key: keyof typeof translations.ru): string => {
  return translations[language][key] || translations.en[key] || key;
};