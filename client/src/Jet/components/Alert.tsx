import React, { useEffect } from 'react';
import { theme } from '../theme';
import styled, { keyframes } from 'styled-components';
import { hexToRgb } from '../theme';
import { Icon } from '../icons';
import { IconEnum } from '../icons/Icons';
import { IconProps } from '../icons/Icon';


export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  showIcon?: boolean;
  customIcon?: IconProps;
  dismissable?: boolean;
  /** Clicking anywhere on the element fires onDismiss */
  dismissAnywhere?: boolean;
  onDismiss?: () => void;
}

const AnimationKeyframes = keyframes`
  0% {
    transform: scale(1) translateY(0);
  }
  30% {
    transform: scale(1.05) translateY(0);
  }
  100% {
    transform: scale(0);
  }
`;

const AnimationKeyframesEntry = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

const AlertStyle = styled.div.attrs((props: AlertProps) => props)`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  background-color: ${props => {
    if (props.variant) {
      const col = hexToRgb(theme.colors[props.variant === 'secondary' ? 'background' : props.variant][0]);
      return `rgba(${col.r}, ${col.g}, ${col.b}, 0.1)`;
    }

    return theme.colors.background[2];
  }};
  color: ${theme.colors.text[0]};
  padding: 1rem;
  border-radius: ${theme.rounded};
  border: 2px solid ${props => theme.colors[(props.variant === 'secondary' ? 'background' : props.variant) || 'primary'][3]};
  cursor: ${props => props.dismissable && props.dismissAnywhere ? 'pointer' : 'default'};
  animation: ${props => !props.show && props.dismissable ? AnimationKeyframes : AnimationKeyframesEntry};
  animation-duration: 0.4s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
`;

const Alert = (props: AlertProps) => {
  const { variant = 'secondary', showIcon = true, customIcon, dismissable, dismissAnywhere, onDismiss, ...rest } = props;
  const [elemRef, setElemRef] = React.useState<HTMLDivElement | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!props.show) {
      timeout = setTimeout(() => {
        if (elemRef) elemRef.style.display = 'none';
      }, 400);
    } else {
      if (elemRef) elemRef.style.display = 'flex';
    }

    return () => {
      clearTimeout(timeout);
    }
  }, [props.show, elemRef]);

  return (
    <AlertStyle
      theme={theme}
      {...rest}
      variant={variant}
      showIcon={showIcon}
      customIcon={customIcon}
      dismissable={dismissable}
      dismissAnywhere={dismissAnywhere}
      onClick={dismissable && dismissAnywhere ? onDismiss : undefined}
      ref={setElemRef}
    >
      {showIcon && (
        <Icon
          icon={variant === 'danger' ? IconEnum.error : variant === 'warning' ? IconEnum.warning : variant === 'success' ? IconEnum.checkmark_circle : IconEnum.info}
          size={24}
          style={{ marginRight: '1rem' }}
          color={variant === 'secondary' ? theme.colors.background[5] : theme.colors[variant || 'primary'][0]}
          {...customIcon}
        />
      )}
      {props.children}
      {dismissable && !dismissAnywhere && (
        <Icon
          icon={IconEnum.x}
          size={24}
          onClick={onDismiss}
          style={{ marginLeft: 'auto', cursor: 'pointer' }}
          color={theme.colors.text[9]}
        />
      )}
    </AlertStyle>
  );
}

export default Alert;
