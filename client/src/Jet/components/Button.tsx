import React from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import { contrast, hexToRgb, invertColor } from '../theme';
import Box from './Box';


export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  rounded?: boolean;
  disabled?: boolean;
  glowing?: boolean;
  glowAmount?: string;
  glowOnHover?: boolean;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  variant?: 'filled' | 'outlined';
  large?: boolean; 
  block?: boolean;
}

const ButtonStyle = styled.button.attrs((props: ButtonProps) => props)`
    display: ${props => props.block ? 'block' : 'inline-block'};
    margin: 0.6rem 0;
    width: ${props => props.block ? '100%' : 'auto'};
    padding: ${props => props.large ? '1rem 2.6rem' : '0.6rem 1.2em'};
    border: ${props => props.variant === 'outlined' ? `2px solid ${props.color === 'secondary' ? theme.colors.background[3] : theme.colors[props.color || 'primary'][0]}` : '2px solid transparent'};
    border-radius: ${props => props.rounded ? theme.roundedFull : theme.rounded};
    cursor: pointer;
	font-weight: inherit;
    background-color: ${props => {
      const col = props.color === 'secondary' ? theme.colors.background[props.variant === 'outlined' ? 2 : 3] : theme.colors[props.color || 'primary'][0];
      if (props.variant === 'outlined') {
        const rgb = hexToRgb(col);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
      }

      return col;
    }};
    box-shadow: ${props => props.glowing && !props.glowOnHover && !props.disabled ? `-1px -1px ${props.glowAmount || '16px'} ${props.color === 'secondary' ? theme.colors.background[3] : theme.colors[props.color || 'primary'][0]}` : 'none'};
    transition: background-color 0.2s ease-in-out${props => props.glowOnHover ? ', box-shadow 0.4s ease-in-out' : ''};
    
    &:not([disabled]):active {
      background-color: ${props => {
        const col = props.color === 'secondary' ?  theme.colors.background[2] : theme.colors[props.color || 'primary'][3];
        if (props.variant === 'outlined') {
          const rgb = hexToRgb(col);
          return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
        }
  
        return col;
      }} !important;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &:not([disabled]):hover {
      background-color: ${props => {
        const col = props.color === 'secondary' ? theme.colors.background[props.variant === 'outlined' ? 1 : 2] : theme.colors[props.color || 'primary'][2];
        if (props.variant === 'outlined') {
          const rgb = hexToRgb(col);
          return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`;
        }
  
        return col;
      }};
      box-shadow: ${props => props.glowing || props.glowOnHover ? `-1px -1px ${props.glowAmount || '16px'} ${props.color === 'secondary' ? theme.colors.background[3] : theme.colors[props.color || 'primary'][0]}` : 'none'};
    }
`;

const Button = (props: ButtonProps) => {
  const { onClick, color, ...rest } = props;
  const textContrast = contrast(color === 'secondary' ? theme.colors.background[3] : theme.colors[color || 'primary'][0], theme.colors['text'][0]);

  let textStyle: { color?: string } = {};
  if (textContrast < 2.5 && props.variant !== 'outlined')
    textStyle = { color: invertColor(color === 'secondary' ? theme.colors.background[3] : theme.colors[color || 'primary'][0]) };

  return (
    <ButtonStyle
      theme={theme}
      {...rest}
      onClick={onClick}
      color={color}
    >
      <Box justifyContent="center" alignItems="center" spacing="0.6rem" style={textStyle}>
        {props.children}
      </Box>
    </ButtonStyle>
  );
}

export default Button;
