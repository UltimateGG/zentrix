import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Chat, SocketEvent } from '../../api/apiTypes';
import { emit } from '../../api/websocket';
import useAuth from '../../contexts/AuthContext';
import { Box, Icon, IconEnum, ThemeContext } from '../../Jet';
import Image from '../Image';


const BoxStyle = styled(Box).attrs((props: any) => props)`
  border-bottom: 1px solid ${props => props.theme.colors.background[2]};
  padding: 0.6rem 1rem;
  cursor: pointer;
  position: relative;
`;

const TitleStyle = styled.h4`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface ChatEntryProps {
  chat: Chat;
}

const ChatEntry = ({ chat }: ChatEntryProps) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  

  const openChat = () => {
    navigate(`/chats/${chat._id}`);
    emit(SocketEvent.SET_LAST_CHAT, { id: chat._id });
    if (user) user.lastChat = chat._id;
  }

  return (
    <BoxStyle theme={theme} onClick={openChat}>
      <Image src={chat.iconURL} alt="icon" style={{ width: '3.6rem', height: '3.6rem', borderRadius: '50%', marginRight: '0.8rem' }} />
      <Box style={{ maxWidth: 'calc(100% - 4rem)' }}>
        {chat.encrypted && (
          <Icon icon={IconEnum.lock} style={{
            position: 'absolute',
            left: '3.4rem',
            top: '0.6rem',
            zIndex: 1,
          }} size={24} />
        )}
        
        <Box flexDirection="column" style={{ maxWidth: '100%' }}>
          <TitleStyle>{chat.title}</TitleStyle>
          <p style={{ color: theme.colors.text[5] }}>{chat.lastMessage}</p>
        </Box>
      </Box>
    </BoxStyle>
  );
}

export default ChatEntry;
