import React, { useState } from 'react';
import styled from 'styled-components';
import { LOGO_URL } from '../../../api/api';
import { Message, MessageType, SocketEvent } from '../../../api/apiTypes';
import { formatTime } from '../../../api/utils';
import { emit } from '../../../api/websocket';
import useDataCache from '../../../contexts/DataCacheContext';
import { Box, TextArea, theme } from '../../../Jet';
import Avatar from '../../Avatar';
import useLongPress from '../../useLongPress';
import FormattedMessageContent from './FormattedMessageContext';


interface ChatMessageProps {
  message: Message;
  shouldStack?: boolean;
  onContextMenu?: () => any;
}

const MessageStyle = styled(Box).attrs((props: ChatMessageProps) => props)`
  width: 100%;
  word-break: break-word;
  word-wrap: break-word;
  white-space: pre-wrap;
  margin-top: ${props => !props.shouldStack ? '1rem' : props.message.type === MessageType.SYSTEM ? 0 : '0.2rem'};
  background-color: ${props => props.message.type === MessageType.SYSTEM ? theme.colors.background[2] : 'inherit'};
  padding: ${props => props.message.type === MessageType.SYSTEM ? '0.4rem 0.8rem' : '0 0.8rem'};
  transition: background-color 0.1s ease-in-out;
`;

const ContextStyle = styled.p.attrs((props: any) => props)`
  color: ${props => props.color};
  line-height: 1;

  p {
    color: ${props => props.color};
  }
`;

const profilePicturesEnabled = true;

const ChatMessage = ({ message, shouldStack, onContextMenu }: ChatMessageProps) => {
  const { users, removeMessage, editingMessage, setEditingMessage } = useDataCache();
  const [editingContent, setEditingContent] = useState(message.content);
  const [error, setError] = useState('');
  const longPress = useLongPress(onContextMenu);


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
  
  const handleEdit = () => {
    if (editingContent === message.content) return setEditingMessage(null);

    setEditingMessage(null);
    emit(SocketEvent.MESSAGE_UPDATE, { id: editingMessage, content: editingContent });
  }

  const onType = (str: string) => {
    setEditingContent(str);

    const maxMessageLength = 4096;
    if (str.length > maxMessageLength) setError(`${str.length} / ${maxMessageLength}`);
    else setError('');
  }

  return (
    <MessageStyle spacing="1rem" {...longPress} message={message} shouldStack={shouldStack}>
      {!shouldStack && profilePicturesEnabled && <Avatar src={author?.iconURL || LOGO_URL} size={2.6} />}

      <Box flexDirection="column" style={{ width: '100%' }}>
        {!shouldStack && (
          <Box justifyContent="space-between" alignItems="center">
            <Box spacing="0.6rem" alignItems="center">
              {getDisplayName()}
              {message.editedAt ? <small style={{ color: theme.colors.text[7] }}>(edited)</small> : null}
            </Box>
            <small>{formatTime(message.createdAt)}</small>
          </Box>
        )}
        
        <ContextStyle
          style={{
            marginLeft: shouldStack && profilePicturesEnabled ? 'calc(2.6rem + 1rem)' : 0,
          }}
          color={getMessageColor()}
        >
          {message.type === MessageType.SYSTEM && message.error && <b style={{ color: theme.colors.danger[0] }}>Error: </b>}
          {editingMessage === message._id ? (
            <>
              <TextArea
                fullWidth
                value={editingContent || ''}
                onChanged={onType}
                error={error}
              />
              
              <small>Escape to <a onClick={() => setEditingMessage(null)}>cancel</a> &middot; or click <a onClick={handleEdit}>save</a></small> {/* eslint-disable-line jsx-a11y/anchor-is-valid */}
            </>
          ) : <FormattedMessageContent content={message.content} />}

          {message.isClientSideOnly && <>
            <br />
            <small>
              Only you can see this message &middot;&nbsp;
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a onClick={handleDismiss} style={{ color: theme.colors.primary[0] }}>Dismiss</a>
            </small>
          </>}
        </ContextStyle>
      </Box>
    </MessageStyle>
  );
}

export default ChatMessage;
