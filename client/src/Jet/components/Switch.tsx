import React from 'react';
import { theme } from '../theme';
import styled from 'styled-components';


export interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  onCheck?: (checked: boolean) => void;
  variant?: 'primary' | 'success' | 'danger' | 'warning';
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
  lightBg?: boolean;
}

const SwitchContainerStyle = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
`;

const SwitchStyle = styled.input.attrs((props: SwitchProps) => props)`
  display: inline-block;
  border: 2px solid ${theme.colors.background[2]};
  background-color: ${props => theme.colors.background[props.lightBg ? 3 : 2]};
  border-radius: ${theme.roundedFull};
  margin: 0.2rem 0;
  padding: 0.6rem 1.2rem;
  transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out;
  -moz-appearance: none;
  -webkit-appearance: none;
  -o-appearance: none;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: 0.2rem;
    left: 0;
    width: 1.4rem;
    height: 1.4rem;
    background-color: ${theme.colors.background[4]};
    border-radius: 50%;
    transition: background-color 0.2s ease-in-out, left 0.2s ease-in-out;

    ${props => props.checked && `
      background-color: ${theme.colors[props.variant || 'primary'][0]};
      box-shadow: 0 0 0.6rem 3px rgba(0, 0, 0, 0.4);
      left: 1.4rem;
    `}
  }

  &:not([disabled]):hover {
    &::after {
      background-color: ${theme.colors.background[5]};
      
      ${props => props.checked && `
        background-color: ${theme.colors[props.variant || 'primary'][2]};
      `}
    }
  }

  &:disabled {
    background-color: ${theme.colors.background[3]};
    border: 2px solid ${theme.colors.background[3]};
    cursor: not-allowed;
    opacity: 0.5;

    &::after {
      box-shadow: none;
    }
  }
`;

/**
 * @param props Use onCheck for onChange event
 */
const Switch = (props: SwitchProps) => {
  const { onCheck, variant, checked, disabled, label, lightBg, ...rest } = props;


  const toggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onCheck && onCheck(!checked);
  }

  return (
    <SwitchContainerStyle {...rest}>
      <SwitchStyle
        type="checkbox"
        theme={theme}
        variant={variant}
        disabled={disabled}
        checked={checked}
        onChange={toggle}
        lightBg={lightBg}
        id={props.name}
      />

      {label && <label htmlFor={props.name} style={{ marginLeft: '0.6rem' }}>{label}</label>}
    </SwitchContainerStyle>
  );
}

export default Switch;
