import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ChatSettingsDrawer from '../components/chat/ChatSettingsDrawer';
import Image from '../components/Image';
import useAuth from '../contexts/AuthContext';
import useDataCache from '../contexts/DataCacheContext';
import { Box, Icon, IconEnum, Progress, ThemeContext } from '../Jet';


const TitleStyle = styled.h4`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 7.6rem);
`;

const ChatPage = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const { chats, loading } = useDataCache();
  const [index, setIndex] = React.useState<number>(chats.findIndex(chat => chat._id === chatId));
  const [settingsDrawerOpen, setSettingsDrawerOpen] = React.useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!user || loading) return;

    const index = chats.findIndex(chat => chat._id === chatId);
    setIndex(index);

    if (index !== -1) return;
    navigate('/chats');
  }, [user, loading, chatId, chats, navigate]);

  const chat = chats[index];
  if (!user || !chat || loading)
    return (
      <Box justifyContent="center" alignItems="center" style={{ marginTop: '4rem' }}>
        <Progress circular indeterminate />
      </Box>
    );

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
        <Icon icon={IconEnum.left} style={{ cursor: 'pointer', marginRight: '0.2rem' }} size={32} onClick={() => navigate('/chats')} />
        <Image src={chat.iconURL} alt="chat" style={{ width: '2.2rem', height: '2.2rem', borderRadius: '50%', marginRight: '0.8rem' }} />
        <TitleStyle style={{ margin: 0 }}>{chat.title}</TitleStyle>
        
        <Icon icon={IconEnum.menu} style={{ cursor: 'pointer', marginLeft: 'auto', marginRight: '0.4rem' }} size={32} onClick={() => setSettingsDrawerOpen(true)} />
      </Box>
      <div style={{ height: '3.6rem' }} />

      <ChatSettingsDrawer open={settingsDrawerOpen} onClose={() => setSettingsDrawerOpen(false)} chat={chat} />      
    </>
  );
}

export default ChatPage;
