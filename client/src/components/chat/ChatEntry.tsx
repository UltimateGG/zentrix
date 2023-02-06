import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Chat from '../../api/Chat';
import useAuth from '../../contexts/AuthContext';
import { Box, Icon, IconEnum, ThemeContext } from '../../Jet';


const BoxStyle = styled(Box).attrs((props: any) => props)`
  border-bottom: 1px solid ${props => props.theme.colors.background[2]};
  padding: 1rem;
  cursor: pointer;
  position: relative;
`;

const TitleStyle = styled.h4`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const IconStyle = styled.img`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  margin-right: 1rem;
`;

interface ChatEntryProps {
  chat: Chat;
}

const ChatEntry = ({ chat }: ChatEntryProps) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  

  const openChat = () => {
    navigate(`/chats/${chat.id}`);
    // user?.setLastChat(chat.id);
  }

  return (
    <BoxStyle theme={theme} onClick={openChat}>
      <IconStyle src={chat.iconURL} alt="icon" />
      <Box style={{ maxWidth: 'calc(100% - 4rem)' }}>
        {chat.encrypted && (
          <Icon icon={IconEnum.lock} style={{
            position: 'absolute',
            left: '3.4rem',
            top: '1rem',
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
