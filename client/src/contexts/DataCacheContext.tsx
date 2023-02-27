import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Chat, CacheUpdate, SocketEvent, User, Message, ChatMessages, MessageType } from '../api/apiTypes';
import { emit, isConnected, subscribe } from '../api/websocket';
import useAuth from './AuthContext';
import { SafeArea, SafeAreaInsets } from 'capacitor-plugin-safe-area';
import { Capacitor } from '@capacitor/core';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';


interface DataCacheContextProps {
  chats: Chat[];
  users: User[];
  messages: ChatMessages[];
  addMessage: (message: Message) => void;
  removeMessage: (message: Message) => void;
  foundFirstMessage: (chat: Chat) => void;
  usingOfflineData: boolean;
  safeArea: SafeAreaInsets | null;
  editingMessage: string | null;
  setEditingMessage: (message: string | null) => void;
}

export const CACHE_KEY = 'zcache.';
const CACHE_MAX_ITEMS = 100;
const CACHE_MAX_MESSAGES_PER_CHAT = 200;

export const DataCacheContext = React.createContext<DataCacheContextProps | undefined>(undefined);
export const DataCacheContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [init, setInit] = useState<boolean>(false);
  const [populated, setPopulated] = useState<boolean>(false);

  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessages[]>([]);
  const [safeArea, setSafeArea] = useState<SafeAreaInsets | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);

  const { user } = useAuth();


  const loadOfflineData = async () => {
    if (!chats.length) setChats(loadCacheFromDisk('chats'));
    if (!users.length) setUsers(loadCacheFromDisk('users'));
    if (!messages.length) setMessages(loadCacheFromDisk('messages'));
  }

  const loadCacheFromDisk = (key: string): any[] => {
    const data = localStorage.getItem(CACHE_KEY + key);
    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  const saveCacheToDisk = (key: string, data: any[]) => {
    if (!data || !data.length) return;
    if (data.length > CACHE_MAX_ITEMS) data = data.slice(data.length - CACHE_MAX_ITEMS);

    localStorage.setItem(CACHE_KEY + key, JSON.stringify(data));
  }

  // Cache update listeners
  useEffect(() => {
    localStorage.setItem(CACHE_KEY + 'user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    saveCacheToDisk('users', users);
  }, [users]);

  useEffect(() => {
    saveCacheToDisk('chats', chats);
  }, [chats]);

  useEffect(() => {
    const savedMessages = [...messages];
    savedMessages.forEach(chat => {
      if (chat.messages.length > CACHE_MAX_MESSAGES_PER_CHAT)
        chat.messages = chat.messages.slice(chat.messages.length - CACHE_MAX_MESSAGES_PER_CHAT);
    });

    saveCacheToDisk('messages', savedMessages);
  }, [messages]);

  useEffect(() => {
    if (init) return;

    loadOfflineData();

    try {
      SafeArea.getSafeAreaInsets().then(area => setSafeArea(area));
    } catch (e) {}

    if (Capacitor.getPlatform() === 'ios') Keyboard.setAccessoryBarVisible({ isVisible: false });
    if (Capacitor.isNativePlatform()) Keyboard.setResizeMode({ mode: KeyboardResize.None });

    setInit(true);
  }, [init]); // eslint-disable-line react-hooks/exhaustive-deps

  // Should only run once, rest is handled through cache update
  const populateCache = async () => {
    const res = await emit(SocketEvent.CACHE_POPULATE, {}).catch(e => {
      console.error('Error populating cache', e);
    });
    if (!res || res.error) return;

    if (res.chats) setChats(res.chats);
    if (res.users) setUsers(res.users);
    setMessages([]);
  }

  useEffect(() => {
    if (populated) return;

    const interval = setInterval(async () => {
      if (!isConnected() || !user) return;

      clearInterval(interval);
      await populateCache();
      setPopulated(true);
    }, 10);

    return () => clearInterval(interval);
  }, [populated, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const onCacheUpdate = useCallback((data: CacheUpdate) => {
    if (data.chats && data.chats.length > 0) {
      data.chats.forEach(chat => {
        setChats(chats => {
          const index = chats.findIndex(c => c._id === chat._id);
          const removeFromCache = chat.members.length === 0 || !chat.members.includes(user?._id || ''); // User shouldnt be null
  
          if (removeFromCache && index !== -1) {
            const newChats = [...chats];
            newChats.splice(index, 1);

            setMessages(messages => {
              const chatIndex = messages.findIndex(m => m.chat === chat._id);

              if (chatIndex !== -1) {
                const newMessages = [...messages];
                newMessages.splice(chatIndex, 1);
                return newMessages;
              } else {
                return messages;
              }
            });

            return newChats;
          } else if (index === -1) {
            return [...chats, chat];
          } else {
            const newChats = [...chats];
            newChats[index] = chat;
            return newChats;
          }
        });
      });
    }

    if (data.users && data.users.length > 0) {
      data.users.forEach(user => {
        setUsers(users => {
          const index = users.findIndex(u => u._id === user._id);
  
          if (index === -1) {
            return [...users, user];
          } else {
            const newUsers = [...users];
            newUsers[index] = user;
            return newUsers;
          }
        });
      });
    }

    if (data.messages && data.messages.length > 0) data.messages.forEach(addMessage);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const unsubscribe = subscribe(SocketEvent.CACHE_UPDATE, (d) => onCacheUpdate(d));
    return () => unsubscribe();
  }, [onCacheUpdate]);

  const addMessage = (message: Message) => {
    if (message.deleted) {
      removeMessage(message);
      return;
    }

    setMessages(messages => {
      const chatStore = messages.find(m => m.chat === message.chat);

      if (chatStore) {
        if (chatStore.messages.some(m => m._id === message._id || m._id === message.clientSideId)) {
          chatStore.messages = chatStore.messages.map(m => m._id === message._id|| m._id === message.clientSideId ? message : m);
        } else {
          chatStore.messages.push(message);
        }
      } else {
        messages.push({ chat: message.chat, messages: [message] });
      }

      messages.forEach(m => m.messages.sort((a, b) => a.createdAt - b.createdAt));
      return [...messages];
    });

    if (message.type !== MessageType.USER) return;
    setChats(chats => {
      const chat = chats.find(c => c._id === message.chat);
      if (chat && (!chat.lastMessage || chat.lastMessage.createdAt < message.createdAt))
        chat.lastMessage = message;

      return [...chats];
    });
  }

  const removeMessage = (message: Message) => {
    setMessages(messages => {
      const chatStore = messages.find(m => m.chat === message.chat);
      if (chatStore)
        chatStore.messages = chatStore.messages.filter(m => m._id !== message._id);

      return [...messages];
    });

    // Remove chat's last message if it was the deleted message
    setChats(chats => {
      const chat = chats.find(c => c._id === message.chat);
      if (chat && chat.lastMessage && chat.lastMessage._id === message._id)
        chat.lastMessage = null;

      return [...chats];
    });
  }

  const foundFirstMessage = (chat: Chat) => {
    setMessages(messages => {
      const chatStore = messages.find(m => m.chat === chat._id);
      if (chatStore) chatStore.hasFirstMessage = true;
      else messages.push({ chat: chat._id, messages: [], hasFirstMessage: true });

      return [...messages];
    });
  }

  return (
    <DataCacheContext.Provider value={{ chats, users, messages, addMessage, removeMessage, foundFirstMessage, usingOfflineData: !populated, safeArea, editingMessage, setEditingMessage }}>
      {children}
    </DataCacheContext.Provider>
  );
}

const useDataCache = () => {
  const context = useContext(DataCacheContext);
  if (context === undefined)
    throw new Error('You are not using the correct provider.');
  return context;
}

export default useDataCache;
