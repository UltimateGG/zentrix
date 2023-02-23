import React from 'react';
import ChatListPage from '../pages/ChatListPage';
import SettingsPage from '../pages/SettingsPage';
import { Swiper, SwiperSlide } from 'swiper/react';
import useNav, { Page } from '../contexts/NavigationContext';
import 'swiper/css';
import Navbar from './Navbar';


const SwipableNav = () => {
  const { currentPage, navigate, init, initilized } = useNav();


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

      <Navbar />
    </>
  );
}

export default SwipableNav;
