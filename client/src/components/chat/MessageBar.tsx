import React, { useContext, useEffect, useState } from 'react';
import { Box, Icon, IconEnum, TextArea, ThemeContext } from '../../Jet';


interface MessageBoxProps {
  onSend: (value: string) => Promise<any>;
}

const MessageBox = ({ onSend }: MessageBoxProps) => {
  const [message, setMessage] = useState('');
  const [canSend, setCanSend] = useState(false);
  const [error, setError] = useState('');
  const [rows, setRows] = useState(1);

  const { theme } = useContext(ThemeContext);


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

    setTimeout(() => {
      const messageBox = document.getElementById('message-box') as HTMLTextAreaElement;
      if (messageBox) messageBox.focus();
    }, 1);
  }

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
        height: 4 + (rows - 2) * 1.2 + 'rem',
        padding: '0 1rem',
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
        onHeightChange={(height) => setRows(Math.round(height / 20))}
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
