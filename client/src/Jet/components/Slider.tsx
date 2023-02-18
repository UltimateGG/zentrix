import React, { useCallback, useEffect } from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import Box from './Box';


export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  color?: 'primary' | 'danger' | 'success' | 'warning';
  backgroundColor?: string;
  onValueChange?: (value: number) => void;
  showMinMax?: boolean;
  showValue?: 'always' | 'hover' | 'never';
  disabled?: boolean;
}

const SliderContainerStyle = styled.div`
  margin: 0.6rem 0;
`;

const SliderStyle = styled.input.attrs((props: SliderProps) => props)`
  -webkit-appearance: none;
  -moz-appearance: none;
  -o-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.4rem;
  border-radius: ${theme.rounded};
  border: none;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : theme.colors.background[3]};
  background-size: 0 100%;
  background-repeat: no-repeat;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  margin: 0.4rem 0;
  transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out;
  opacity: ${props => (props.disabled ? 0.5 : 1)};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
    background-color: ${props => theme.colors[props.color || 'primary'][0]};
    border: 2px solid ${props => theme.colors[props.color || 'primary'][0]};
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    transition: all 0.2s ease-in-out;

    ${props => !props.disabled && `
      &:hover {
        background-color: ${theme.colors[props.color || 'primary'][1]};
        border: 2px solid ${theme.colors[props.color || 'primary'][1]};
      }

      &:active {
        background-color: ${theme.colors[props.color || 'primary'][2]};
        border: 2px solid ${theme.colors.background[1]};
      }
    `}
  }
`;

const MinMaxStyle = styled.span.attrs((props: SliderProps) => props)`
  margin-bottom: 0;
  color: ${props => props.disabled ? theme.colors.background[5] : theme.colors.text[0]};
`;

const ValueStyle = styled.div.attrs((props: SliderProps) => props)`
  position: absolute;
  bottom: 1.8rem;
  left: 50%;
  transform: translateX(-50%) Scale(0);
  z-index: 2;
  margin: 0;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  border-radius: ${theme.rounded};
  background-color: ${theme.colors.background[3]};
  border: 2px solid ${theme.colors.background[5]};
  transition: transform 0.2s ease-in-out;
  pointer-events: none;

  &.show {
    transform: translateX(-50%) Scale(1);
  }

  &::after {
    content: '';
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 3px solid ${theme.colors.background[5]};
    position: absolute;
    top: calc(100% + 2px);
    left: calc(50% - 3px); 
    right: 0;
    width: 0;
  }
`;

/**
 * @param props Use onValueChange for onChange event
 */
const Slider = (props: SliderProps) => {
  const { min = 0, max = 100, step = 1, value = 50, color = 'primary', backgroundColor, onValueChange, showMinMax, showValue = 'hover', disabled, ...rest } = props;
  const [elemRef, setElemRef] = React.useState<HTMLInputElement | null>(null);
  const [valueRef, setValueRef] = React.useState<HTMLDivElement | null>(null);
  const [hovering, setHovering] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const update = useCallback(() => {
    if (!elemRef) return;
    const min: number = +elemRef.min || 0;
    const max: number = +elemRef.max || 100;
    const val: number = +elemRef.value;
    const newVal: number = (val - min) * 100 / (max - min);

    elemRef.style.backgroundSize = newVal + '% 100%';
    elemRef.style.backgroundImage = `linear-gradient(${theme.colors[color || 'primary'][0]}, ${theme.colors[color || 'primary'][0]})`;
    if (valueRef)
      valueRef.style.left = `calc(${newVal}% + (0.7rem - ${newVal * 0.225}px))`;
    onValueChange && onValueChange(Number(elemRef.value));
  }, [onValueChange, elemRef, valueRef, color]);

  useEffect(() => {
    update();
  }, [update]);

  return (
    <SliderContainerStyle {...rest}>
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
        {showMinMax && <MinMaxStyle disabled={disabled} theme={theme} style={{ marginRight: '0.4rem' }}>{min}</MinMaxStyle>}
        <Box style={{ position: 'relative', width: '100%' }}>
          <SliderStyle
            type="range"
            theme={theme}
            min={min}
            max={max}
            step={step}
            value={value}
            color={color}
            backgroundColor={backgroundColor}
            onChange={update}
            disabled={disabled}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onTouchStart={() => setDragging(true)}
            onTouchEnd={() => setDragging(false)}
            ref={setElemRef}
          />
          <ValueStyle theme={theme} ref={setValueRef} className={(showValue !== 'never' && ((showValue === 'hover' && (hovering || dragging)) || showValue === 'always')) ? 'show' : ''}>{value}</ValueStyle>
        </Box>
        
        {showMinMax && <MinMaxStyle disabled={disabled} theme={theme} style={{ marginLeft: '0.4rem' }}>{max}</MinMaxStyle>}
      </Box>
    </SliderContainerStyle>
  );
}

export default Slider;
