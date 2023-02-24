import React, { useContext, useEffect, useState } from 'react';
import SwiperClass from 'swiper/types/swiper-class';


export enum Page {
  CHAT_LIST,
  SETTINGS,
}

interface NavigationContextProps {
  currentPage: Page | null;
  navigate: (page: Page) => void;
  currentChat: string | null;
  setCurrentChat: (chat: string | null) => void;
  init: (swiper: SwiperClass | null) => void;
  initialized: boolean;
}

export const NavigationContext = React.createContext<NavigationContextProps | undefined>(undefined);
export const NavigationContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [synced, setSynced] = useState(true);


  useEffect(() => {
    if (synced) return;

    const interval = setInterval(() => {
      if (swiper && swiper.activeIndex === currentPage) {
        setSynced(true);
        clearInterval(interval);
        return;
      }

      if (currentPage !== null) swiper?.slideTo(currentPage, -1);
    }, 100);

    return () => clearInterval(interval);
  }, [synced, swiper, currentPage]);

  const navigate = (page: Page) => {
    setCurrentPage(page);

    if (swiper) swiper.slideTo(page);
    else setSynced(false);
  }

  const init = (swiper: SwiperClass | null) => {
    setSwiper(swiper);
    // if (currentPage !== null) swiper?.slideTo(currentPage, -1);
  }

  return (
    <NavigationContext.Provider value={{ currentPage, navigate, currentChat, setCurrentChat, init, initialized: swiper != null && synced }}>
      {children}
    </NavigationContext.Provider>
  );
}

const useNav = () => {
  const context = useContext(NavigationContext);
  if (context === undefined)
    throw new Error('You are not using the correct provider.');
  return context;
}

export default useNav;
