import React from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import { hexToRgb } from '../theme';


export interface RadioButtonProps extends React.HTMLAttributes<HTMLInputElement> {
  onCheck: (value: string) => void;
  value: string;
  selected: string;
  disabled?: boolean;
}

const RadioButtonStyle = styled.input.attrs((props: RadioButtonProps) => props)`
  display: inline-block;
  position: relative;
  border: 2px solid ${theme.colors.background[5]};
  background-color: ${theme.colors.background[2]};
  border-radius: 50%;
  color: ${theme.colors.background[4]};
  margin: 0.2rem 0;
  padding: 0.6rem;
  transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  -moz-appearance: none;
  -webkit-appearance: none;
  -o-appearance: none;
  cursor: pointer;

  &:checked {
    background-color: rgba(${props => {
      const col = hexToRgb(theme.colors.primary[0]);
      return `${col.r}, ${col.g}, ${col.b}`;
    }}, 0.1);
    border: 2px solid ${theme.colors.primary[0]};

    &:not([disabled]):hover {
      background-color: rgba(${props => {
        const col = hexToRgb(theme.colors.primary[0]);
        return `${col.r}, ${col.g}, ${col.b}`;
      }}, 0.25);
    }
    
    &::after {
      content: ' ';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 0.4rem;
      height: 0.4rem;
      background-color: ${theme.colors.text[7]};
      border-radius: 50%;
      transition: background-color 0.2s ease-in-out;
    }
  }

  &[disabled]:checked {
    &::after {
      background-color: ${theme.colors.background[5]};
    }
  }

  &:not([disabled]):hover {
    ${props => props.checked ? '' : `background-color: ${theme.colors.background[3]};`}
  }

  &:disabled {
    background-color: ${theme.colors.background[2]};
    border: 2px solid ${theme.colors.background[2]};
    cursor: not-allowed;
  }
`;

/**
 * @param props Use onCheck for onChange event
 */
const RadioButton = (props: RadioButtonProps) => {
  const { onCheck, value, selected, disabled, ...rest } = props;


  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onCheck(e.target.value);
  }

  return (
    <RadioButtonStyle
      type="radio"
      theme={theme}
      {...rest}
      onChange={update}
      disabled={disabled}
      checked={selected === value}
      value={value}
    />
  );
}

export default RadioButton;
