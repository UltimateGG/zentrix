import React, { useCallback, useContext, useEffect } from 'react';
import { Chat, CacheUpdate, SocketEvent } from '../api/apiTypes';
import { connect, emitWithRes, isConnected, isConnecting, subscribe } from '../api/websocket';


interface DataCacheContextProps {
  chats: Chat[];
  loading: boolean;
}

export const DataCacheContext = React.createContext<DataCacheContextProps | undefined>(undefined);
export const DataCacheContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [populated, setPopulated] = React.useState<boolean>(false);


  // Should only run once, rest is handled through cache update
  const populateCache = async () => {
    const res = await emitWithRes(SocketEvent.CACHE_POPULATE, {}).catch(() => {});
    if (!res) return;

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
        const index = chats.findIndex(c => c._id === chat._id);

        if (index === -1) {
          setChats(chats => [...chats, chat]);
        } else {
          setChats(chats => {
            const newChats = [...chats];
            newChats[index] = chat;
            return newChats;
          });
        }
      });
    }
  }, [chats]);

  useEffect(() => {
    const unsubscribe = subscribe(SocketEvent.CACHE_UPDATE, (d) => onCacheUpdate(d));
    return () => unsubscribe();
  }, [onCacheUpdate]);

  return (
    <DataCacheContext.Provider value={{ chats, loading: !populated }}>
      {children}
    </DataCacheContext.Provider>
  );
};

const useDataCache = () => {
  const context = useContext(DataCacheContext);
  if (context === undefined)
    throw new Error('You are not using the correct provider.');
  return context;
};

export default useDataCache;
