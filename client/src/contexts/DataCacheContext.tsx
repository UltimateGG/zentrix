import React, { useCallback, useContext, useEffect } from 'react';
import { Chat, CacheUpdate, SocketEvent, User, Message, ChatMessages } from '../api/apiTypes';
import { connect, emitWithRes, isConnected, isConnecting, subscribe } from '../api/websocket';
import useAuth from './AuthContext';


interface DataCacheContextProps {
  chats: Chat[];
  users: User[];
  messages: ChatMessages[];
  addMessage: (message: Message) => void;
  loading: boolean;
}

export const DataCacheContext = React.createContext<DataCacheContextProps | undefined>(undefined);
export const DataCacheContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [populated, setPopulated] = React.useState<boolean>(false);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [messages, setMessages] = React.useState<ChatMessages[]>([]);

  const { user } = useAuth();


  // Should only run once, rest is handled through cache update
  const populateCache = async () => {
    const res = await emitWithRes(SocketEvent.CACHE_POPULATE, {}).catch(e => {
      console.error('Error populating cache', e);
    });
    if (!res || res.error) return;

    if (res.chats) setChats(res.chats);
    if (res.users) setUsers(res.users);
  }

  useEffect(() => {
    if (populated) return;

    const interval = setInterval(async () => {
      if (!isConnected()) {
        if (!isConnecting()) await connect().catch(() => {});
        return;
      }
      if (!user) return;

      clearInterval(interval);
      await populateCache();
      setPopulated(true);
    }, 100);

    return () => clearInterval(interval);
  }, [populated, user]);

  const onCacheUpdate = useCallback((data: CacheUpdate) => {
    if (data.chats && data.chats.length > 0) {
      data.chats.forEach(chat => {
        setChats(chats => {
          const index = chats.findIndex(c => c._id === chat._id);
          const removeFromCache = chat.members.length === 0 || !chat.members.includes(user?._id || ''); // User shouldnt be null
  
          if (removeFromCache && index !== -1) {
            const newChats = [...chats];
            newChats.splice(index, 1);

            if (user && user.lastChat && chat._id === user.lastChat) {
              emitWithRes(SocketEvent.SET_LAST_CHAT, { id: null }).catch(e => {});
              user.lastChat = null;
            }

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

    if (data.messages && data.messages.length > 0)
      data.messages.forEach(addMessage);
  }, [user]);

  useEffect(() => {
    const unsubscribe = subscribe(SocketEvent.CACHE_UPDATE, (d) => onCacheUpdate(d));
    return () => unsubscribe();
  }, [onCacheUpdate]);

  const addMessage = (message: Message) => {
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

      return [...messages];
    });
  }

  return (
    <DataCacheContext.Provider value={{ chats, users, messages, addMessage, loading: !populated }}>
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
