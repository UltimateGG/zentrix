import React, { useContext } from 'react';
import styled from 'styled-components';
import { Message, MessageType } from '../../api/apiTypes';
import { Box, ThemeContext } from '../../Jet';


const ChatMessageStyle = styled.div`
  padding: 0.4rem 0.8rem;
  margin: 0.4rem 0;
  border-radius: 1.4rem;
  width: 100%;
  word-break: break-word;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { theme } = useContext(ThemeContext);


  return (
    <ChatMessageStyle>
      {message.content}
    </ChatMessageStyle>
  );
}

export default ChatMessage;
