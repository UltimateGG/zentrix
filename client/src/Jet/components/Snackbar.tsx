import React, { useEffect } from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import Box from './Box';


export interface SnackbarProps extends React.HTMLAttributes<HTMLDivElement> {
  shown?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  position?: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';
  text: string;
  dismissable?: boolean;
  onDismiss?: () => void;
  seconds?: number;
  index?: number;
}

const SnackbarStyle = styled.div.attrs((props: SnackbarProps) => props)`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  position: fixed;
  ${props => {
    if (props.position === 'top') {
      return `
        top: ${(props.index || 0) * 4}rem;
        left: 50%;
        transform: translateX(-50%);
      `;
    } else if (props.position === 'top-left' || props.position === 'top-right' || props.position === 'bottom-left' || props.position === 'bottom-right') {
      return `
        ${props.position.includes('top') ? 'top' : 'bottom'}: ${(props.index || 0) * 4}rem;
        ${props.position.includes('left') ? 'left' : 'right'}: 1rem;
      `;
    } else { // Bottom
      return `
        bottom: ${(props.index || 0) * 4}rem;
        left: 50%;
        transform: translateX(-50%);
      `;
    }
  }}
  cursor: ${props => props.dismissable ? 'pointer' : 'default'};
  background-color: ${theme.colors.background[2]};
  border-radius: ${theme.rounded};
  border-left: 0.6rem solid ${props => props.variant === 'secondary' ? theme.colors.background[4] : theme.colors[props.variant || 'primary'][0]};
  box-shadow: 0px 0px 0.6rem 0.6rem rgba(0, 0, 0, 0.25);
  color: ${theme.colors.text[0]};
  padding: 0.6rem;
  min-width: 20rem;
  z-index: 150;

  pointer-events: ${props => props.shown ? 'all' : 'none'};
  opacity: ${props => props.shown ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
`;

const Snackbar = (props: SnackbarProps) => {
  const { shown, variant = 'primary', position = 'bottom', text, dismissable, onDismiss, seconds = 5, index = 0, ...rest } = props;


  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (shown) {
      timeout = setTimeout(() => {
        if (onDismiss)
          onDismiss();
      }, seconds * 1000);
    }

    return () => {
      clearTimeout(timeout);
    }
  }, [shown, onDismiss, seconds]);

  return (
    <SnackbarStyle
      theme={theme}
      {...rest}
      className={'j-snackbar-content ' + props.className}
      shown={shown}
      variant={variant}
      position={position}
      dismissable={dismissable}
      seconds={seconds}
      index={index}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (dismissable && (e.target as HTMLElement).classList.contains('j-snackbar-content'))
          onDismiss && onDismiss();
      }}
    >
      <Box style={{ width: '100%' }} justifyContent="space-between" alignItems="center" className="j-snackbar-content">
        <div className="j-snackbar-content">{text}</div>
        {props.children}
      </Box>
    </SnackbarStyle>
  );
}

export default Snackbar;
