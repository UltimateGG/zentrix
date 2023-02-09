import React from 'react';
import { ThemeContext } from '../../theme/JetDesign';
import styled from 'styled-components';
import ReactTextareaAutosize from 'react-textarea-autosize';


export interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  placeholder?: string;
  onChanged?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  minRows?: number;
  maxRows?: number;
  roomForError?: boolean;
  error?: string;
  name?: string;
  onHeightChange?: (height: number) => void;
}

const TextAreaContainerStyle = styled.div.attrs((props: TextAreaProps) => props)`
  display: inline-block;
  position: relative;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin: 0.4rem 0;
`;

const TextAreaStyle = styled(ReactTextareaAutosize).attrs((props: TextAreaProps) => props)`
  display: block;
  color: ${props => props.theme.colors.text[0]};
  background-color: ${props => props.theme.colors.background[1]};
  border: 1px solid ${props => props.error ? props.theme.colors.danger[0] : props.theme.colors.background[5]};
  border-radius: ${props => props.theme.rounded};
  margin: 0;
  ${props => props.error || props.props.roomForError ? 'margin-bottom: 0;' : ''}
  padding: 0.8rem;
  width: ${props => props.props.fullWidth ? '100%' : 'auto'};
  min-height: 2.4rem;
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out;
  text-overflow: ellipsis;
  resize: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  -o-appearance: none;

  &:not([disabled]):focus {
    border: 1px solid ${props => props.theme.colors.primary[0]};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.background[2]};
    border: 1px solid ${props => props.theme.colors.background[2]};
    color: ${props => props.theme.colors.background[8]};
    -webkit-text-fill-color: ${props => props.theme.colors.background[8]};
    cursor: not-allowed;
    opacity: 0.5;
  }

  &::-webkit-scrollbar-track {
    border-radius: ${props => props.theme.rounded};
  }

  ::placeholder {
    color: ${props => props.theme.colors.background[6]};
    opacity: 1;
  }

  :-ms-input-placeholder {
    color: ${props => props.theme.colors.background[6]};
  }

  ::-ms-input-placeholder {
    color: ${props => props.theme.colors.background[6]};
  }
`;

const ErrorTextStyle = styled.small`
  position: absolute;
  bottom: -0.1rem;
  right: 0.4rem;
  display: inline-block;
  color: ${props => props.theme.colors.danger[0]};
  margin-top: 0.2rem;
  margin-bottom: 0.4rem;
`;

/**
 * @param props Use onChanged for onChange event
 */
const TextArea = (props: TextAreaProps) => {
  let { value, placeholder, onChanged, onBlur, disabled, fullWidth, minRows, maxRows, roomForError, error, onHeightChange, ...rest } = props;
  const { theme } = React.useContext(ThemeContext);

  if (error === '' || (error && error.trim() === ''))
    error = undefined;

  return (
    <TextAreaContainerStyle fullWidth={fullWidth} {...rest}>
      <TextAreaStyle
        theme={theme}
        props={{ fullWidth, roomForError }}
        value={value}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChanged && onChanged(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        minRows={minRows}
        maxRows={maxRows}
        error={error}
        id={props.name}
        onHeightChange={onHeightChange}
      />

      {(error || roomForError) && <ErrorTextStyle style={{ visibility: roomForError && !error ? 'hidden' : 'visible' }} theme={theme}>
        {error || (roomForError ? '-' : undefined)}
      </ErrorTextStyle>}
    </TextAreaContainerStyle>
  );
}

export default TextArea;
