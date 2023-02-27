import React from 'react';
import { theme } from '../theme';
import styled from 'styled-components';


export interface TextFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'search';
  value?: string;
  placeholder?: string;
  onChanged?: (value: string) => void;
  onBlur?: () => void;
  variant?: 'filled' | 'outlined';
  disabled?: boolean;
  fullWidth?: boolean;
  roomForError?: boolean;
  error?: string;
  name?: string;
  autoFocus?: boolean;
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  maxLength?: number;
}

const TextFieldContainerStyle = styled.div.attrs((props: TextFieldProps) => props)`
  display: inline-block;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin: 0.4rem 0;
`;

const TextFieldStyle = styled.input.attrs((props: TextFieldProps) => props)`
  display: block;
  color: ${theme.colors.text[0]};
  background-color: ${props => props.variant === 'outlined' ? 'transparent' : theme.colors.background[1]};
  border: none;
  border${props => props.variant === 'outlined' ? '-bottom' : ''}: ${props => props.variant === 'outlined' ? 2 : 1}px solid ${props => props.error ? theme.colors.danger[0] : theme.colors.background[5]};
  border-radius: ${props => props.variant === 'outlined' ? 0 : theme.rounded};
  ${props => props.error || props.roomForError ? 'margin-bottom: 0;' : ''}
  padding: ${props => props.variant === 'outlined' ? '0.2rem' : '0.8rem'};
  ${props => props.variant === 'outlined' && 'min-height: 2.4rem;'}
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out;
  text-overflow: ellipsis;
  -moz-appearance: none;
  -webkit-appearance: none;
  -o-appearance: none;

  &:not([disabled]):focus {
    border${props => props.variant === 'outlined' ? '-bottom' : ''}: ${props => props.variant === 'outlined' ? 2 : 1}px solid ${theme.colors.primary[0]};
  }

  &:disabled {
    background-color: ${props => props.variant === 'outlined' ? 'transparent' : theme.colors.background[2]};
    border${props => props.variant === 'outlined' ? '-bottom' : ''}: ${props => props.variant === 'outlined' ? 2 : 1}px solid ${props => theme.colors.background[props.variant === 'outlined' ? 3 : 2]};
    color: ${theme.colors.background[8]};
    -webkit-text-fill-color: ${theme.colors.background[8]};
    cursor: not-allowed;
    opacity: 0.5;
  }

  ::placeholder {
    color: ${theme.colors.background[6]};
    opacity: 1;
  }

  :-ms-input-placeholder {
    color: ${theme.colors.background[6]};
  }

  ::-ms-input-placeholder {
    color: ${theme.colors.background[6]};
  }
`;

const ErrorTextStyle = styled.small`
  display: inline-block;
  color: ${theme.colors.danger[0]};
  margin-top: 0.2rem;
  margin-bottom: 0.4rem;
  overflow-wrap: break-word;
  word-break: break-all;
  word-wrap: break-word;
`;

/**
 * @param props Use onChanged for onChange event
 */
const TextField = (props: TextFieldProps) => {
  let { type = 'text', value, placeholder, onChanged, onBlur, variant = 'filled', disabled, fullWidth, roomForError, error, autoFocus, ...rest } = props;


  if (error === '' || (error && error.trim() === ''))
    error = undefined;

  return (
    <TextFieldContainerStyle fullWidth={fullWidth} {...rest}>
      <TextFieldStyle
        type={type}
        theme={theme}
        value={value}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChanged && onChanged(e.target.value)}
        onBlur={onBlur}
        variant={variant}
        disabled={disabled}
        fullWidth={fullWidth}
        roomForError={roomForError}
        error={error}
        autoFocus={autoFocus}
        id={props.name}
        enterKeyHint={props.enterKeyHint}
        maxLength={props.maxLength}
      />
      
      {(error || roomForError) && <ErrorTextStyle style={{ visibility: roomForError && !error ? 'hidden' : 'visible' }} theme={theme}>
        {error || (roomForError ? '-' : undefined)}
      </ErrorTextStyle>}
    </TextFieldContainerStyle>
  );
}

export default TextField;
