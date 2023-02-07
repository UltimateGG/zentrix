import React, { useContext, useEffect } from 'react';
import  Chat from '../api/apiTypes';
import { emitWithRes, isConnected, SocketEvent, subscribe } from '../api/websocket';


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
    const res = await emitWithRes(SocketEvent.POPULATE_CACHE, {}).catch(() => {});
    if (!res) return;

    setChats(res.chats);
  }

  useEffect(() => {
    if (populated) return;

    const interval = setInterval(async () => {
      if (!isConnected()) return;
      clearInterval(interval);
      await populateCache();
      setPopulated(true);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const onCacheUpdate = (data: any) => {
    if (data.chats && data.chats.length > 0) {
      data.chats.forEach((chat: Chat) => {
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
  }

  useEffect(() => {
    const unsubscribe = subscribe(SocketEvent.UPDATE_CACHE, onCacheUpdate);
    return () => unsubscribe();
  }, []);

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
