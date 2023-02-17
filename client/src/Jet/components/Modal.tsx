import React, { useEffect } from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import Divider from './Divider';
import { Icon } from '../icons';
import { IconEnum } from '../icons/Icons';


export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  closeOnOutsideClick?: boolean;
  showCloseIcon?: boolean;
  onClose?: () => void;
  title?: string;
}

const BackdropStyle = styled.div.attrs((props: ModalProps) => props)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 10;
  transition: opacity 0.3s ease-in-out;
`;

const ModalStyle = styled.div.attrs((props: ModalProps) => props)`
  background-color: ${theme.colors.background[2]};
  box-shadow: 0px 0px 1rem 8px rgba(0, 0, 0, 0.3);
  border-radius: ${theme.rounded};
  min-width: 20vw;
  min-height: 20vh;
  max-width: 80vw;
  max-height: 80vh;
  padding: 1rem;
  word-wrap: break-word;
  overflow: auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    min-width: 90vw;
    max-width: 90vw;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    min-width: 90vw;
  }
`;

const CloseIconStyle = styled(Icon).attrs((props: ModalProps) => props)`
  position: absolute;
  top: -0.6rem;
  right: -0.6rem;
  cursor: pointer;
  font-size: 1.5rem;
  
  & path {
    fill: ${theme.colors.text[0]};
    transition: fill 0.2s ease-in-out;
  }

  &:hover path {
    fill: ${theme.colors.text[4]};
  }
`;

const Modal = (props: ModalProps) => {
  const { open, closeOnOutsideClick, showCloseIcon = true, onClose, title, ...rest } = props;
  const [elemRef, setElemRef] = React.useState<HTMLDivElement | null>(null);


  useEffect(() => {
    const handleTransitionEnd = () => {
      if (elemRef) elemRef.style.display = open ? 'flex' : 'none';
      document.body.style.overflow = open ? 'hidden' : 'auto';
    }

    if (elemRef) {
      if (open) {
        elemRef.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
      let a = document.body.offsetHeight; // eslint-disable-line
      elemRef.addEventListener('transitionend', handleTransitionEnd);
      elemRef.style.opacity = `${open ? 1 : 0}`; 
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (closeOnOutsideClick && e.key === 'Escape')
        onClose && onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (elemRef) elemRef.removeEventListener('transitionend', handleTransitionEnd);
    }
  }, [open, closeOnOutsideClick, onClose, elemRef]);

  return (
    <BackdropStyle
      open={open}
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (closeOnOutsideClick && e.target === e.currentTarget)
          onClose && onClose();
      }}
      ref={setElemRef}
    >
      <ModalStyle
        theme={theme}
        {...rest}
        title={undefined}
      >
        {title && (
          <div style={{ position: 'relative', marginBottom: '0.8rem' }}>
            <h2 style={{ marginRight: '1.4rem' }}>{title}</h2>
            {showCloseIcon && <CloseIconStyle icon={IconEnum.x} size={24} theme={theme} onClick={onClose} />}
            <Divider />
          </div>
        )}

        {props.children}
      </ModalStyle>
    </BackdropStyle>
  );
}

export default Modal;
