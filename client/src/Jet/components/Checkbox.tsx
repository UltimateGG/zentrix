import React, { useCallback } from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import { hexToRgb } from '../theme';
import { Icon } from '../icons';
import { IconEnum } from '../icons/Icons';
import Box from './Box';


export interface CheckboxProps extends React.HTMLAttributes<HTMLDivElement> {
  onCheck?: (checked: boolean) => void;
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
}

const CheckboxContainerStyle = styled.div.attrs((props: CheckboxProps) => props)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0.2rem 0;
`;

const CheckboxStyle = styled.input.attrs((props: CheckboxProps) => props)`
  display: inline-block;
  border: 2px solid ${theme.colors.background[5]};
  background-color: ${theme.colors.background[2]};
  border-radius: ${theme.rounded};
  color: ${theme.colors.background[4]};
  margin: 0;
  padding: 0.6rem;
  transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out;
  -moz-appearance: none;
  -webkit-appearance: none;
  -o-appearance: none;
  cursor: pointer;

  &:not([disabled]):checked {
    background-color: rgba(${props => {
      const col = hexToRgb(theme.colors.primary[0]);
      return `${col.r}, ${col.g}, ${col.b}`;
    }}, 0.1);
    border: 2px solid ${theme.colors.primary[0]};

    &:hover {
      background-color: rgba(${props => {
        const col = hexToRgb(theme.colors.primary[0]);
        return `${col.r}, ${col.g}, ${col.b}`;
      }}, 0.25);
    }
  }

  &:not([disabled]):hover {
    background-color: ${theme.colors.background[3]};
  }

  &:disabled {
    background-color: ${theme.colors.background[2]};
    border: 2px solid ${theme.colors.background[2]};
    cursor: not-allowed;
  }
`;

const CheckIconStyle = styled(Icon)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  pointer-events: none;
`;

/**
 * @param props Use onCheck for onChange event
 */
const Checkbox = (props: CheckboxProps) => {
  const { onCheck, checked, disabled, label, ...rest } = props;


  const toggle = useCallback(() => {
    if (disabled) return;
    onCheck && onCheck(!checked);
  }, [onCheck, disabled, checked]);

  return (
    <CheckboxContainerStyle {...rest}>
      <Box justifyContent="center" style={{ position: 'relative' }}>
        <CheckboxStyle
          type="checkbox"
          theme={theme}
          disabled={disabled}
          checked={checked}
          onClick={toggle}
          onChange={toggle}
          id={props.name}
        />

        {checked && <CheckIconStyle size={18} icon={IconEnum.checkmark} color={disabled ? theme.colors.background[5] : theme.colors.text[7]} />}
      </Box>

      {label && <label htmlFor={props.name} style={{ marginLeft: '0.6rem', cursor: 'pointer' }}>{label}</label>}
    </CheckboxContainerStyle>);
}

export default Checkbox;
