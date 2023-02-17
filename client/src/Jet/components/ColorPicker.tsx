import React from 'react';
import { theme } from '../theme';
import styled from 'styled-components';


export interface ColorPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  onChanged?: (color: string) => void;
  label?: string;
  name?: string;
}

const ColorPickerContainerStyle = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 0.4rem 0;
`;

const ColorPickerStyle = styled.input.attrs((props: ColorPickerProps) => props)`
  display: inline-block;  
  border: 2px solid ${theme.colors.background[5]};
  background-color: ${theme.colors.background[3]};
  border-radius: ${theme.rounded};
  padding: 0.4rem;
  width: auto;
  min-width: 2.6rem;
  min-height: 2.6rem;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0; 
  }
  
  &::-moz-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: ${theme.rounded};
  }

  &::-moz-color-swatch {
    border: none;
    border-radius: ${theme.rounded};
  }
`;

/**
 * Use onChanged for onChange event/color change
 */
const ColorPicker = (props: ColorPickerProps) => {
  const { color, onChanged, label, name, ...rest } = props;


  return (
    <ColorPickerContainerStyle {...rest}>
      <ColorPickerStyle
        theme={theme}
        type="color"
        value={color}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChanged && onChanged(e.target.value)}
        id={name}
      />
      {label && <label style={{ marginLeft: '0.6rem' }} htmlFor={name}>{label}</label>}
    </ColorPickerContainerStyle>
  );
}

export default ColorPicker;
