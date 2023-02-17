import React, { useEffect } from 'react';
import { theme } from '../theme';
import styled from 'styled-components';
import { Icon } from '../icons';
import { IconEnum } from '../icons/Icons';


export interface NumericInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  onChanged?: (value: number) => void;
  onBlur?: () => void;
  fullWidth?: boolean;
  roomForError?: boolean;
  error?: string;
  disabled?: boolean;
  arrows?: 'always' | 'hover' | 'never';
  name?: string;
}

const NumericInputContainerStyle = styled.div.attrs((props: NumericInputProps) => props)`
  display: inline-block;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin: 0.4rem 0;
`;

const NumericInputStyle = styled.input.attrs((props: any) => props)`
  display: block;
  color: ${theme.colors.text[0]};
  background-color: ${theme.colors.background[1]};
  border: none;
  border: 1px solid ${props => props.error ? theme.colors.danger[0] : theme.colors.background[5]};
  border-radius: ${theme.rounded};
  ${props => props.error || props.roomForError ? 'margin-bottom: 0;' : ''}
  padding: ${props => props.showingArrows ? '0.8rem 1.8rem' : '0.8rem'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  min-height: 2.4rem;
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out;
  text-overflow: ellipsis;
  text-align: center;
  -moz-appearance: textfield;
  -webkit-appearance: textfield;
  -o-appearance: textfield;
  text-overflow: ellipsis;
  -moz-appearance: none;
  -webkit-appearance: none;
  -o-appearance: none;
  
  &:not([disabled]):hover {
    background-color: ${theme.colors.background[2]};
  }

  &:not([disabled]):focus {
    border: 1px solid ${theme.colors.primary[0]};
  }

  &:disabled {
    opacity: 0.5;
    -webkit-text-fill-color: ${theme.colors.background[8]};
    cursor: not-allowed;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: none;
    margin: 0;
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

const ArrowIconStyle = styled(Icon).attrs((props: NumericInputProps) => props)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.side}: 0.4rem;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  & path {
    fill: ${props => theme.colors[props.disabled ? 'background' : 'text'][props.disabled ? 7 : 0]};
    transition: fill 0.2s ease-in-out;
  }

  ${props => !props.disabled && `
    &:hover path {
      fill: ${theme.colors.text[9]};
    }
  `}
`;

/**
 * Use onChanged for onChange event
 */
const NumericInput = (props: NumericInputProps) => {
  const { fullWidth, value = 0, onChanged, onBlur, roomForError, error, disabled, arrows = 'always', ...rest } = props;
  const [mouseOver, setMouseOver] = React.useState(false);
  const [fireOnBlur, setFireOnBlur] = React.useState(false);
  const [textVal, setTextVal] = React.useState(value.toString());

  useEffect(() => {
    if (fireOnBlur) {
      onBlur && onBlur();
      setFireOnBlur(false);
    }
  }, [fireOnBlur, setFireOnBlur, onBlur]);

  const showingArrows = arrows === 'always' || (arrows === 'hover' && mouseOver && !disabled);

  return (
    <NumericInputContainerStyle {...rest} fullWidth={fullWidth} onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)}>
      <div style={{ position: 'relative' }}>
        <NumericInputStyle
          theme={theme}
          fullWidth={fullWidth}
          showingArrows={showingArrows}
          value={textVal}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setTextVal(val);
          }}
          onBlur={() => {
            const value = parseFloat(textVal) || 0;
            setFireOnBlur(true);
            setTextVal(value.toString());
            onChanged && onChanged(value);
          }}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' || e.key === 'Escape')
              (document.activeElement as HTMLElement).blur();
            else if (e.key !== 'Delete' && e.key !== 'Backspace') {
              const valid = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-'];
              if (!valid.includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();
              }
            }
          }}
          roomForError={roomForError}
          error={error}
          type="text"
          disabled={disabled}
          id={props.name}
        />

        {showingArrows && (<>
          <ArrowIconStyle theme={theme} icon={IconEnum.left} size={24} side="left" disabled={disabled} onClick={() => {
            const value = (parseFloat(textVal) || 0) - 1;
            setFireOnBlur(true);
            setTextVal(value.toString());
            onChanged && onChanged(value);
          }} />
          <ArrowIconStyle theme={theme} icon={IconEnum.right} size={24} side="right" disabled={disabled} onClick={() => {
            const value = (parseFloat(textVal) || 0) + 1;
            setFireOnBlur(true);
            setTextVal(value.toString());
            onChanged && onChanged(value);
          }} />
        </>)}
      </div>

      {(error || roomForError) && <ErrorTextStyle style={{ visibility: roomForError && !error ? 'hidden' : 'visible' }} theme={theme}>
        {error || (roomForError ? '-' : undefined)}
      </ErrorTextStyle>}
    </NumericInputContainerStyle>
  );
}

export default NumericInput;
