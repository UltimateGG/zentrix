import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ZentrixChat from '../api/ZentrixChat';
import useAuthContext from '../contexts/AuthContext';
import useChatsContext from '../contexts/ChatsContext';
import { useNotifications } from '../contexts/NotificationContext';
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
  const { user } = useAuthContext();
  const { chats } = useChatsContext();
  const { addNotification } = useNotifications();
  const { theme } = useContext(ThemeContext);
  const [chat, setChat] = React.useState<ZentrixChat | null>(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!user) return;

    const chat = chats.find(chat => chat.id === chatId);
    if (!chat || !user.chats.includes(chat.id) || !chat.participants.includes(user.id)) {
      navigate('/chats');
      addNotification({ variant: 'danger', text: 'You are not a member of this chat', dismissable: true });
      return;
    }
  
    setChat(chat);
  }, [user, chats, chatId]);

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
