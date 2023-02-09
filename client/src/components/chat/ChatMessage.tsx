import React, { useContext } from 'react';
import { Message, MessageType } from '../../api/apiTypes';
import { Box, ThemeContext } from '../../Jet';


interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { theme } = useContext(ThemeContext);


  return (
    <>
      {message.type === MessageType.ERROR && (
        <Box style={{ padding: '0.4rem 0.8rem', backgroundColor: theme.colors.background[1], color: theme.colors.danger[1] }}>
          {message.content}
        </Box>
      )}

      {message.type === MessageType.PENDING && (
        <Box style={{ padding: '0.4rem 0.8rem', backgroundColor: theme.colors.background[1], color: theme.colors.warning[1] }}>
          {message.content}
        </Box>
      )}

      {message.type === MessageType.USER && (
        <Box style={{ padding: '0.4rem 0.8rem', backgroundColor: theme.colors.background[1], color: theme.colors.success[1] }}>
          {message.content}
        </Box>
      )}
    </>
  );
}

export default ChatMessage;
