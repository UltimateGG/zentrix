import React from 'react';
import ChatListPage from '../pages/ChatListPage';
import SettingsPage from '../pages/SettingsPage';
import { Swiper, SwiperSlide } from 'swiper/react';
import useNav, { Page } from '../contexts/NavigationContext';
import 'swiper/css';
import Navbar from './Navbar';
import ChatPage from '../pages/ChatPage';
import { emit } from '../api/websocket';
import { SocketEvent } from '../api/apiTypes';
import SwipableOverlay from './SwipableOverlay';


const SwipableNav = () => {
  const { currentPage, currentChat, setCurrentChat, navigate, init, initilized } = useNav();

  
  const onCloseChat = () => {
    navigate(Page.CHAT_LIST);
    setCurrentChat(null);
    emit(SocketEvent.SET_LAST_CHAT, { id: null });
  }

  return (
    <>
      <Swiper
        onInit={s => init(s)}
        onSlideChange={e => navigate(e.activeIndex)}
        allowSlidePrev={!initilized || currentPage !== Page.CHAT_LIST}
        allowSlideNext={!initilized || currentPage !== Page.SETTINGS}
        style={{ height: '100%' }}
      >
        <SwiperSlide><ChatListPage /></SwiperSlide>
        <SwiperSlide><SettingsPage /></SwiperSlide>
      </Swiper>

      {currentChat &&
       <SwipableOverlay onClose={onCloseChat}>
        <ChatPage />
       </SwipableOverlay>
      }

      <Navbar />
    </>
  );
}

export default SwipableNav;
