import React, { useContext } from 'react';
import styled from 'styled-components';
import { LOGO_URL } from '../../api/api';
import { Message, MessageType } from '../../api/apiTypes';
import { formatTime } from '../../api/utils';
import useDataCache from '../../contexts/DataCacheContext';
import { Box, ThemeContext } from '../../Jet';
import Avatar from '../Avatar';
import FormattedMessageContent from './FormattedMessageContext';


const ChatMessageStyle = styled(Box)`
  padding: 0 0.8rem;
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
  const { users, removeMessage } = useDataCache();


  const author = users.find(user => user._id === message.author);

  const getMessageColor = () => {
    if (message.type === MessageType.PENDING) return theme.colors.background[9];
    if (message.type === MessageType.SYSTEM) return theme.colors.text[7];
    return theme.colors.text[0];
  }

  const getDisplayName = () => {
    if (message.type === MessageType.SYSTEM) return <b style={{ color: theme.colors.primary[0] }}>Zentrix</b>;

    return (<p style={{ color: theme.colors.text[7] }}>{author?.displayName}</p>);
  }

  const handleDismiss = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    removeMessage(message);
  }

  return (
    <ChatMessageStyle
      spacing="1rem"
      style={{
        marginTop: !shouldStack ? '1rem' : message.type === MessageType.SYSTEM ? '-1rem' : '0.2rem',
        backgroundColor: message.type === MessageType.SYSTEM ? theme.colors.background[2] : 'inherit',
        padding: message.type === MessageType.SYSTEM ? '0.8rem' : undefined,
      }}
    >
      {!shouldStack && profilePicturesEnabled && <Avatar src={author?.iconURL || LOGO_URL} size={2.6} />}

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
          {message.type === MessageType.SYSTEM && message.error && <b style={{ color: theme.colors.danger[0] }}>Error: </b>}
          <FormattedMessageContent content={message.content} />

          {message.isClientSideOnly && <>
            <br />
            <small>
              Only you can see this message &middot;&nbsp;
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a onClick={handleDismiss} style={{ color: theme.colors.primary[0] }}>Dismiss</a>
            </small>
          </>}
        </p>
      </Box>
    </ChatMessageStyle>
  );
}

export default ChatMessage;
