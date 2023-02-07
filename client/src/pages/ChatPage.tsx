import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Chat from '../api/apiTypes';
import useAuth from '../contexts/AuthContext';
import useDataCache from '../contexts/DataCacheContext';
import useNotifications from '../contexts/NotificationContext';
import { Box, Icon, IconEnum, ThemeContext } from '../Jet';


const TitleStyle = styled.h4`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 7.6rem);
`;

const IconStyle = styled.img`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  margin-right: 0.8rem;
`;

const ChatPage = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { theme } = useContext(ThemeContext);
  const { chats } = useDataCache();
  const [chat, setChat] = React.useState<Chat | null>(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!user) return;

    const chat = chats.find(chat => chat._id === chatId);
    setChat(chat || null);

    if (chat) return;

    addNotification({
      variant: 'danger',
      text: 'You do not have access to this chat',
      dismissable: true
    });
    navigate(-1);
  }, [user, chatId]);

  if (!user || !chat) return null;
  return (
    <>
      <Box alignItems="center" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: '3.6rem',
        padding: '1rem 0.2rem',
        backgroundColor: theme.colors.background[1]
      }}>
        <Icon icon={IconEnum.left} style={{ cursor: 'pointer', marginRight: '0.2rem' }} size={32} onClick={() => navigate(-1)} />
        <IconStyle src={chat.iconURL} alt="pfp" />
        <TitleStyle style={{ margin: 0 }}>{chat.title}</TitleStyle>
        
        <Icon icon={IconEnum.menu} style={{ cursor: 'pointer', marginLeft: 'auto', marginRight: '0.4rem' }} size={32} />
      </Box>
      <div style={{ height: '3.6rem' }} />

      
    </>
  );
}

export default ChatPage;
