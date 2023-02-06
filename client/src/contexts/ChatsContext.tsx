import { onValue, ref } from 'firebase/database';
import React, { useContext, useEffect } from 'react';
import { db } from '../api/firebase';
import ZentrixChat from '../api/ZentrixChat';
import useAuthContext from './AuthContext';


interface IChatsContext {
  chats: ZentrixChat[];
  loadingChats: boolean;
}

export const ChatsContext = React.createContext<IChatsContext | undefined>(undefined);
export const ChatsContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [chats, setChats] = React.useState<ZentrixChat[]>([]);
  const [lastUserChats, setLastUserChats] = React.useState<string[] | null>(null);
  const [loadingChats, setLoadingChats] = React.useState(true);

  const { user } = useAuthContext();


  useEffect(() => {
    if (!user) return;

    let didPopulateChats = false;
    if (lastUserChats === null || user.chats.length !== lastUserChats.length || user.chats.some((chat, i) => chat !== lastUserChats[i])) {
      setLastUserChats(user.chats);
      populateChats();
      didPopulateChats = true;
    }

    return () => {
      if (!didPopulateChats) return;
      chats.forEach(chat => {
        if (chat.unsubscribe) chat.unsubscribe();
        chat.unsubscribe = undefined;
      });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const populateChats = async () => {
    if (!user) return;
    setLoadingChats(true);

    chats.forEach(chat => {
      if (chat.unsubscribe) chat.unsubscribe();
      chat.unsubscribe = undefined;
    });

    const newChats: ZentrixChat[] = [];

    for (const chatId of user.chats) {
      const chat = await ZentrixChat.getChat(chatId);
      if (chat.participants.includes(user.id) && user.chats.includes(chat.id)) // both ways
        newChats.push(chat);
    }

    setChats(newChats);

    // Update listener
    newChats.forEach(chat => {
      const unsubscribe = onValue(ref(db, `chats/${chat.id}`), snapshot => {
        if (!snapshot.exists()) {
          setChats(prev => prev.filter(c => c.id !== chat.id));
          unsubscribe();
          return;
        }

        chat.update(snapshot.val());

        // Remove chat
        if (!chat.participants || !chat.participants.includes(user.id) || !user.chats.includes(chat.id)) {
          setChats(prev => prev.filter(c => c.id !== chat.id));
          unsubscribe();
          return;
        }

        setChats(prev => [...prev]);
      });

      chat.unsubscribe = unsubscribe;
    });

    setLoadingChats(false);
  }


  return (
    <ChatsContext.Provider value={{ chats, loadingChats }}>
      {children}
    </ChatsContext.Provider>
  );
};

const useChatsContext = () => {
  const context = useContext(ChatsContext);
  if (context === undefined)
    throw new Error('You are not using the correct provider.');
  return context;
};

export default useChatsContext;
