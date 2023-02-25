import React, { useEffect, useState } from 'react';
import useDataCache from '../../contexts/DataCacheContext';
import { Box, Icon, IconEnum, TextArea, theme } from '../../Jet';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';


interface MessageBoxProps {
  onSend: (value: string) => Promise<any>;
  onResize?: (height: number) => any;
}

const MessageBox = ({ onSend, onResize }: MessageBoxProps) => {
  const [message, setMessage] = useState('');
  const [canSend, setCanSend] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const [rows, setRows] = useState(1);
  const { safeArea } = useDataCache();


  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const target = e.target as HTMLTextAreaElement;
        if (!target) return;

        if (e.shiftKey) {
          // Shift + Tab => Unindent selected lines
          const start = target.selectionStart;
          const end = target.selectionEnd;

          if (start === end) {
            const lineStart = target.value.lastIndexOf('\n', start - 1) + 1;
            if (target.value.substring(lineStart, start).startsWith('\t')) {
              target.value = target.value.substring(0, lineStart) + target.value.substring(lineStart + 1);
              target.setSelectionRange(start - 1, end - 1);
            }

            return;
          }

          const lines = target.value.substring(start, end).split('\n');
          const newLines = lines.map(line => {
            if (line.startsWith('\t')) {
              return line.substring(1);
            }
            return line;
          });
          target.value = target.value.substring(0, start) + newLines.join('\n') + target.value.substring(end);
          target.setSelectionRange(start, end - (lines.length - newLines.length));
        } else {
          // Tab => Indent selected lines
          const start = target.selectionStart;
          const end = target.selectionEnd;
          const lines = target.value.substring(start, end).split('\n');
          const newLines = lines.map(line => '\t' + line);
          target.value = target.value.substring(0, start) + newLines.join('\n') + target.value.substring(end);
          target.setSelectionRange(start, end + (newLines.length - 1));

          // Update selection
          if (start === end) target.setSelectionRange(start + 1, end + 1);
          else target.setSelectionRange(start, end + newLines.length);
        }
      }
    }

    const messageBox = document.getElementById('message-box') as HTMLTextAreaElement;
    if (!messageBox) return;

    messageBox.addEventListener('keydown', onKeyDown);
    return () => messageBox.removeEventListener('keydown', onKeyDown);
  });

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!focused) return;
      const target = e.target as HTMLElement;
      if (!target) return;

      if (!target.closest('#message-box') && Capacitor.isNativePlatform())
        Keyboard.hide();
    }

    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, [focused]);

  const onType = (string: string) => {
    setMessage(string);

    const maxMessageLength = 4096;
    setCanSend(string.trim().length > 0 && string.length <= maxMessageLength);

    if (string.length > maxMessageLength) setError(`${string.length} / ${maxMessageLength}`);
    else setError('');
  }

  const send = async () => {
    if (!canSend) return;

    setCanSend(false);
    setMessage('');

    await onSend(message);
  }

  const safeAreaBottom = safeArea?.insets.bottom || 0;

  return (
    <Box
      alignItems="center"
      spacing="1rem"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        overflowY: 'auto',
        height: `calc(${4 + (rows - 2) * 1.2 + 'rem'} + ${focused ? 0 : safeAreaBottom}px)`,
        padding: '0 1rem',
        paddingBottom: safeAreaBottom,
        backgroundColor: theme.colors.background[1]
      }}
    >
      <TextArea
        placeholder="Enter message..."
        name="message-box" // sets id on inner textbox
        fullWidth
        value={message}
        onChanged={onType}
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          backgroundColor: theme.colors.background[1],
          color: theme.colors.text[0]
        }}
        minRows={1}
        maxRows={5}
        onHeightChange={(height: number) => {
          const rows = Math.round(height / 20);
          setRows(rows);
          onResize && onResize(4 + (rows - 2) * 1.2);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        error={error}
      />

      <Icon
        icon={IconEnum.send}
        style={{ cursor: canSend ? 'pointer' : 'not-allowed' }}
        color={canSend ? theme.colors.primary[0] : theme.colors.background[4]} size={32}
        onClick={send} 
      />
    </Box>
  );
}

export default MessageBox;
