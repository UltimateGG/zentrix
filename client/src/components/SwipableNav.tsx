import React, { useState } from 'react';
import ChatListPage from '../pages/ChatListPage';
import SettingsPage from '../pages/SettingsPage';
import { Swiper, SwiperSlide } from 'swiper/react';
import useNav, { Page } from '../contexts/NavigationContext';
import 'swiper/css';
import Navbar from './Navbar';
import ChatPage from '../pages/ChatPage';
import SwipableOverlay from './SwipableOverlay';


const SwipableNav = () => {
  const { currentPage, currentChat, setCurrentChat, navigate, init, initialized } = useNav();
  const [chatSwiped, setChatSwiped] = useState(false);

  
  const onCloseChat = () => {
    navigate(Page.CHAT_LIST);
    setCurrentChat(null);
  }

  return (
    <>
      <Swiper
        onInit={s => init(s)}
        onSlideChange={e => navigate(e.activeIndex)}
        allowSlidePrev={!initialized || currentPage !== Page.CHAT_LIST}
        allowSlideNext={!initialized || currentPage !== Page.SETTINGS}
        style={{ height: '100%' }}
      >
        <SwiperSlide><ChatListPage /></SwiperSlide>
        <SwiperSlide><SettingsPage /></SwiperSlide>
      </Swiper>

      {currentChat &&
      <SwipableOverlay onClose={onCloseChat}
        onMove={(e: any) => {
          if (e.translate !== e.width) setChatSwiped(true);
        }}
        onEnd={() => {
          setChatSwiped(false);
        }}
      >
        <ChatPage swiped={chatSwiped} />
       </SwipableOverlay>
      }

      <Navbar />
    </>
  );
}

export default SwipableNav;
