import React from 'react';
import ChatListPage from '../pages/ChatListPage';
import SettingsPage from '../pages/SettingsPage';
import { Swiper, SwiperSlide } from 'swiper/react';
import useNav, { Page } from '../contexts/NavigationContext';
import 'swiper/css';
import Navbar from './Navbar';
import ChatPage from '../pages/ChatPage';
import { theme } from '../Jet';


const SwipableNav = () => {
  const { currentPage, currentChat, navigate, init, initialized } = useNav();


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
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 12,
          backgroundColor: theme.colors.background[0]
        }}>
          <ChatPage />  
        </div>
      }

      <Navbar />
    </>
  );
}

export default SwipableNav;
