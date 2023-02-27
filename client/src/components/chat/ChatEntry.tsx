import React from 'react';
import styled from 'styled-components';
import { Chat } from '../../api/apiTypes';
import useNav from '../../contexts/NavigationContext';
import { Box, Icon, IconEnum, theme } from '../../Jet';
import Avatar from '../Avatar';


const BoxStyle = styled(Box).attrs((props: any) => props)`
  border-bottom: 1px solid ${theme.colors.background[2]};
  padding: 0.6rem 1rem;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease-in-out;

  &:active {
    background-color: ${theme.colors.background[3]};
  }
`;

const TruncatedTextStyle = styled.div`
  > * {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

interface ChatEntryProps {
  chat: Chat;
}

const ChatEntry = ({ chat }: ChatEntryProps) => {
  const { setCurrentChat } = useNav();
  

  const openChat = () => {
    setCurrentChat(chat._id);
  }

  return (
    <BoxStyle theme={theme} onClick={openChat}>
      <Avatar src={chat.iconURL} size={3.6} mr={0.8} />
      <Box style={{ maxWidth: 'calc(100% - 4rem)' }}>
        {chat.encrypted && (
          <Icon icon={IconEnum.lock} style={{
            position: 'absolute',
            left: '3.4rem',
            top: '0.6rem',
            zIndex: 1,
          }} size={24} />
        )}
        
        <Box flexDirection="column" justifyContent="center" style={{ maxWidth: '100%' }}>
          <TruncatedTextStyle>
            <h4>{chat.title}</h4>
            {chat.topic && <p style={{ color: theme.colors.text[5] }}>{chat.topic}</p>}
          </TruncatedTextStyle>
        </Box>
      </Box>
    </BoxStyle>
  );
}

export default ChatEntry;
