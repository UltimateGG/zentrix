import React, { useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { theme } from '../Jet';


const BlankOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

interface SwipableOverlayProps {
  onClose?: () => any;
  onMove?: () => any;
  onEnd?: () => any;
  children: React.ReactNode;
}

const SwipableOverlay = ({ onClose, onMove, onEnd, children }: SwipableOverlayProps) => {
  const [firedInitial, setFiredInitial] = useState(false);


  const onChange = () => {
    if (!firedInitial) {
      setFiredInitial(true);
      return;
    }

    onClose && onClose();
  }

  return (
    <BlankOverlay style={{ zIndex: 12 }}>
      <Swiper style={{ height: '100%' }} initialSlide={1} allowSlideNext={false} onSlideChange={onChange} onSliderMove={onMove} onTouchEnd={onEnd}>
        <SwiperSlide>
          <BlankOverlay />
        </SwiperSlide>

        <SwiperSlide style={{ backgroundColor: theme.colors.background[0], boxShadow: '0 0 1.2rem rgba(0, 0, 0, 0.4)' }}>
          {children}
        </SwiperSlide>
      </Swiper>
    </BlankOverlay>
  );
}

export default SwipableOverlay;
