import React from 'react';
import ChatEntry from '../components/chat/ChatEntry';
import CreateChatModal from '../components/chat/CreateChatModal';
import StatusBar from '../components/StatusBar';
import useAuth from '../contexts/AuthContext';
import useDataCache from '../contexts/DataCacheContext';
import { Box, Icon, IconEnum, theme } from '../Jet';


const ChatListPage = () => {
  const { user } = useAuth();
  const { chats, safeArea } = useDataCache();
  const [createChatModalOpen, setCreateChatModalOpen] = React.useState(false);

  const safeAreaTop = safeArea?.insets.top || 0;

  if (!user) return null;
  return (
    <>
      <StatusBar color={theme.colors.background[1]} />
      <Box justifyContent="space-between" alignItems="center" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: `calc(3.2rem + ${safeAreaTop}px)`,
        padding: '0.2rem 1rem',
        paddingTop: safeAreaTop === 0 ? '0.2rem' : safeAreaTop,
        backgroundColor: theme.colors.background[1]
      }}>
        <h2 style={{ margin: 0 }}>Chats</h2>
        <Icon icon={IconEnum.add_chat} style={{ cursor: 'pointer' }} size={32} onClick={() => setCreateChatModalOpen(true)} />
      </Box>
      <div style={{ height: `calc(3.2rem + ${safeAreaTop}px` }} />

      <>
        {chats.length === 0 && (
          <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ marginTop: '4rem' }}>
            <h3 style={{ margin: 0 }}>No chats yet</h3>
            <p style={{ margin: 0 }}>Click the + button to create a new chat</p>
          </Box>
        )}

        {chats.length > 0 && (
          <Box flexDirection="column" style={{ paddingBottom: `calc(6.6rem + ${safeArea?.insets.bottom || 0}px + ${safeArea?.insets.top || 0}px)`, height: '100%', overflowY: 'auto' }}>
            {chats.map(chat => (
              <ChatEntry key={chat._id} chat={chat} />
            ))}
          </Box>
        )}

        <CreateChatModal open={createChatModalOpen} onClose={() => setCreateChatModalOpen(false)} />
      </>
    </>
  );
}

export default ChatListPage;
