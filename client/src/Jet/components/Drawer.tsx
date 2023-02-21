import React, { useEffect } from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import { Icon } from '../icons';
import { IconEnum } from '../icons/Icons';


export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right';
  open?: boolean;
  onClose?: () => void;
  closeOnOutsideClick?: boolean;
  pt: number;
  pb: number;
}

const DrawerStyle = styled.div.attrs((props: DrawerProps) => props)`
  position: fixed;
  top: 0;
  bottom: 0;
  ${props => props.side || 'left'}: ${props => props.open ? '0' : '-105%'};
  transition: transform 0.3s ease-in-out;
  transform: ${props => props.open ? 'translateX(0)' : `translateX(${props.side === 'right' ? '' : '-'}105%)`};
  padding: 0.6rem;
  padding-top: calc(1.2rem + ${props => props.pt || 0}px);
  padding-bottom: calc(1.2rem + ${props => props.pb || 0}px);
  min-width: 8vw;
  max-width: 30vw;
  overflow: auto;
  background-color: ${theme.colors.background[2]};
  color: ${theme.colors.text[0]};
  font-size: 1.2rem;
  box-shadow: 0px 0px 0.6rem 0.4rem rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
  z-index: 6;

  @media (max-width: ${theme.breakpoints.md}) {
    max-width: 50vw;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    max-width: 90vw;
  }
`;

const OverlayStyle = styled.div.attrs((props: DrawerProps) => props)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.open ? '1' : '0'};
  transition: opacity 0.3s ease-in-out;
  pointer-events: ${props => props.open ? 'auto' : 'none'};
  visibility: ${props => props.open ? 'visible' : 'hidden'};
  z-index: 5;
`;

const Drawer = (props: DrawerProps) => {
  const { side, open, onClose, closeOnOutsideClick = true, ...rest } = props;


  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';

    const onKeyDown = (e: KeyboardEvent) => {
      if (closeOnOutsideClick && e.key === 'Escape')
        onClose && onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    }
  }, [open, onClose, closeOnOutsideClick]);

  return (<>
    <OverlayStyle theme={theme} open={open} onClick={() => {
      if (closeOnOutsideClick)
        onClose && onClose();
    }} />
    <DrawerStyle
      theme={theme}
      {...rest}
      open={open}
      side={side}
    >
      <Icon
        icon={IconEnum.x}
        size={24}
        style={{
          position: 'absolute',
          top: `calc(0.2rem + ${props.pt || 0}px)`,
          right: '0.2rem',
          cursor: 'pointer',
        }}
        onClick={onClose}
      />
      {props.children}
    </DrawerStyle>
    </>);
}

export default Drawer;
