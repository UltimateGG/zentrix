import React from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import { Icon } from '../icons';
import { IconEnum } from '../icons/Icons';


export interface DateTimePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'datetime-local' | 'date' | 'time';
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  showX?: boolean;
}

const DateTimePickerContainerStyle = styled.div`
  display: inline-block;
  margin: 0.6rem 0;
`;

const DateTimePickerStyle = styled.input.attrs((props: DateTimePickerProps) => props)`
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  min-height: 2.4rem;
  color: ${props => theme.colors[props.disabled ? 'background' : 'text'][props.disabled ? 8 : 0]};
  background-color: ${props => theme.colors.background[props.disabled ? 2 : 1]};
  border: 1px solid ${props => theme.colors.background[props.disabled ? 2 : 5]};
  border-radius: ${theme.rounded};
  padding: 0.5rem;
  padding-left: ${props => props.type !== 'time' ? '1.4rem' : '2rem'};
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};
  text-align: center;
  transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out;

  &:not([disabled]):hover {
    background-color: ${theme.colors.background[2]};
  }

  &:disabled {
    opacity: 0.5;
  }

  &::-webkit-calendar-picker-indicator {
    position: absolute;
    cursor: pointer;
    opacity: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    height: auto;
    color: transparent;
    background: transparent;
  }
`;

const IconStyle = styled(Icon).attrs((props: DateTimePickerProps) => props)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0.5rem;
  margin: auto;
  pointer-events: none;
  transition: color 0.2s ease-in-out;
  opacity: ${props => props.disabled ? 0.5 : 1};

  & path {
    fill: ${props => theme.colors[props.disabled ? 'background' : 'text'][props.disabled ? 8 : 0]};
  }
`;

const XStyle = styled(Icon).attrs((props: DateTimePickerProps) => props)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0.5rem;
  margin: auto;
  transition: color 0.2s ease-in-out;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${theme.colors.background[7]};

  & path {
    fill: ${theme.colors.background[7]};
  }
`;

/**
 * @param props Use onDateChange for date change event
 */
const DateTimePicker = (props: DateTimePickerProps) => {
  const { type = 'datetime-local', date, onDateChange, disabled, showX = true, ...rest } = props;


  const pad = (n: number) => n < 10 ? `0${n}` : n;

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    if (type === 'time')
      return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    if (type === 'date')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  const parseDate = (date: string) => {
    if (type === 'time')
      return new Date(`1970-01-01T${date}`);
    if (type === 'date')
      return new Date(`${date}T00:00`);
    
    return new Date(date);
  }

  return (
    <DateTimePickerContainerStyle {...rest} >
      <div style={{ position: 'relative' }}>
        <DateTimePickerStyle
          type={type}
          value={formatDate(date)}
          theme={theme}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const newDate = parseDate(e.target.value);
            onDateChange && onDateChange(newDate);
          }}
          disabled={disabled}
        />
        <IconStyle theme={theme} size={24} icon={type === 'time' ? IconEnum.clock : IconEnum.calendar} disabled={disabled} />
        {showX && !disabled && <XStyle theme={theme} size={16} icon={IconEnum.x_filled} onClick={() => onDateChange && onDateChange(undefined)} />}
      </div>
    </DateTimePickerContainerStyle>
  );
}

export default DateTimePicker;
