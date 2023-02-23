import React, { useContext, useState } from 'react';
import SwiperClass from 'swiper/types/swiper-class';


export enum Page {
  CHAT_LIST,
  SETTINGS,
}

interface NavigationContextProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  currentChat: string | null;
  setCurrentChat: (chat: string | null) => void;
  init: (swiper: SwiperClass | null) => void;
  initilized: boolean;
}

export const NavigationContext = React.createContext<NavigationContextProps | undefined>(undefined);
export const NavigationContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.CHAT_LIST);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  

  const navigate = (page: Page) => {
    setCurrentPage(page);
    swiper?.slideTo(page);
  }

  const init = (swiper: SwiperClass | null) => {
    setSwiper(swiper);
    swiper?.slideTo(currentPage, -1);
  }

  return (
    <NavigationContext.Provider value={{ currentPage, navigate, currentChat, setCurrentChat, init, initilized: swiper != null }}>
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
