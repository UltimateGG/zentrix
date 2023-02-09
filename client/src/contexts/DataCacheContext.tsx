import React, { useCallback, useContext, useEffect } from 'react';
import { Chat, CacheUpdate, SocketEvent, User } from '../api/apiTypes';
import { connect, emitWithRes, isConnected, isConnecting, subscribe } from '../api/websocket';
import useAuth from './AuthContext';


interface DataCacheContextProps {
  chats: Chat[];
  users: User[];
  getUsers: (ids: string[]) => User[];
  loading: boolean;
}

export const DataCacheContext = React.createContext<DataCacheContextProps | undefined>(undefined);
export const DataCacheContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [populated, setPopulated] = React.useState<boolean>(false);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);

  const { user } = useAuth();


  // Should only run once, rest is handled through cache update
  const populateCache = async () => {
    const res = await emitWithRes(SocketEvent.CACHE_POPULATE, {}).catch(e => {
      console.error('Error populating cache', e);
    });
    if (!res || res.error) return;

    setChats(res.chats);
  }

  useEffect(() => {
    if (populated) return;

    const interval = setInterval(async () => {
      if (!isConnected()) {
        if (!isConnecting()) await connect().catch(() => {});
        return;
      }

      clearInterval(interval);
      await populateCache();
      setPopulated(true);
    }, 100);

    return () => clearInterval(interval);
  }, [populated]);

  const onCacheUpdate = useCallback((data: CacheUpdate) => {
    if (data.chats && data.chats.length > 0) {
      data.chats.forEach(chat => {
        setChats(chats => {
          const index = chats.findIndex(c => c._id === chat._id);
  
          if (index === -1) {
            return [...chats, chat];
          } else {
            const newChats = [...chats];
            newChats[index] = chat;
            return newChats;
          }
        });
      });
    }

    if (data.deletedChats && data.deletedChats.length > 0) {
      data.deletedChats.forEach(chatId => {
          setChats(chats => {
            const newChats = [...chats];
            const index = newChats.findIndex(c => c._id === chatId);
            if (index !== -1) newChats.splice(index, 1);
            return newChats;
          });
      });

      if (user && user.lastChat && data.deletedChats.includes(user.lastChat)) {
        emitWithRes(SocketEvent.SET_LAST_CHAT, { chatId: null }).catch(e => {});
        user.lastChat = null;
      }
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
  }, [user]);

  useEffect(() => {
    const unsubscribe = subscribe(SocketEvent.CACHE_UPDATE, (d) => onCacheUpdate(d));
    return () => unsubscribe();
  }, [onCacheUpdate]);

  const getUsers = (ids: string[]) => {
    const usersToFetch = ids.filter(id => !users.find(u => u._id === id));
    if (usersToFetch.length === 0) return users;
    
    emitWithRes(SocketEvent.CACHE_GET_USERS, { ids: usersToFetch }).catch(e => {
      console.error('Error getting users from cache', e);
    });

    const addedUsers = usersToFetch.map(id => ({ _id: id, loading: true } as User));
    setUsers(users => [...users, ...addedUsers]);
    return addedUsers;
  }

  return (
    <DataCacheContext.Provider value={{ chats, users, getUsers, loading: !populated }}>
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
