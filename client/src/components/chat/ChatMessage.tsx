import React, { useContext } from 'react';
import styled from 'styled-components';
import { Message, MessageType } from '../../api/apiTypes';
import { formatTime } from '../../api/utils';
import useDataCache from '../../contexts/DataCacheContext';
import { Box, ThemeContext } from '../../Jet';
import Image from '../Image';
import FormattedMessageContent from './FormattedMessageContext';


const ChatMessageStyle = styled(Box)`
  padding: 0 0.8rem;
  border-radius: 1.4rem;
  width: 100%;
  word-break: break-word;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

interface ChatMessageProps {
  message: Message;
  shouldStack?: boolean;
}

const profilePicturesEnabled = true;

const ChatMessage = ({ message, shouldStack }: ChatMessageProps) => {
  const { theme } = useContext(ThemeContext);
  const { users } = useDataCache();


  const author = users.find(user => user._id === message.author);

  const getMessageColor = () => {
    if (message.type === MessageType.PENDING) return theme.colors.background[9];
    if (message.type === MessageType.ERROR) return theme.colors.danger[0];
    if (message.type === MessageType.SYSTEM) return theme.colors.text[7];
    return theme.colors.text[0];
  }

  const getDisplayName = () => {
    if (message.type === MessageType.SYSTEM) return <b style={{ color: theme.colors.text[7] }}>System</b>;
    if (message.type === MessageType.ERROR) return <b style={{ color: theme.colors.danger[0] }}>Message Send Failed</b>;

    return (<p style={{ color: theme.colors.text[7] }}>{author?.displayName}</p>);
  }

  return (
    <ChatMessageStyle spacing="1rem" style={{ marginTop: !shouldStack ? '1rem' : '0.2rem' }}>
      {!shouldStack && profilePicturesEnabled && <Image src={author?.iconURL || ''} style={{ width: '2.6rem', height: '2.6rem', borderRadius: '50%' }} />}

      <Box flexDirection="column" style={{ width: '100%' }}>
        {!shouldStack && (
          <Box justifyContent="space-between" alignItems="center">
            {getDisplayName()}
            <small>{formatTime(message.createdAt)}</small>
          </Box>
        )}
        
        {/* TODO finish formatting for system, etc. */}
        <p
          style={{
            marginLeft: shouldStack && profilePicturesEnabled ? 'calc(2.6rem + 1rem)' : '0',
            color: getMessageColor(),
          }}
        >
          <FormattedMessageContent content={message.content} />
        </p>
      </Box>
    </ChatMessageStyle>
  );
}

export default ChatMessage;
