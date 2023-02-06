import React from 'react';
import ChatEntry from '../components/chat/ChatEntry';
import CreateChatModal from '../components/chat/CreateChatModal';
import PasswordModal from '../components/chat/PasswordModal';
import useAuthContext from '../contexts/AuthContext';
import useChatsContext from '../contexts/ChatsContext';
import { Box, Icon, IconEnum, Progress, ThemeContext } from '../Jet';


const ChatListPage = () => {
  const { user } = useAuthContext();
  const { theme } = React.useContext(ThemeContext);
  const [createChatModalOpen, setCreateChatModalOpen] = React.useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = React.useState(false);

  const { chats, loadingChats} = useChatsContext();


  if (!user) return null;
  return (
    <>
      <Box justifyContent="space-between" alignItems="center" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: '3.6rem',
        padding: '1rem 2rem',
        backgroundColor: theme.colors.background[1]
      }}>
        <h2 style={{ margin: 0 }}>Chats</h2>
        <Icon icon={IconEnum.add_chat} style={{ cursor: 'pointer' }} size={32} onClick={() => setCreateChatModalOpen(true)} />
      </Box>
      <div style={{ height: '3.6rem' }} />

      {loadingChats ? (
        <Box justifyContent="center" alignItems="center" style={{ marginTop: '4rem' }}>
          <Progress circular indeterminate />
        </Box>
      ) : (<>
        {user.chats.length === 0 && (
          <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ marginTop: '4rem' }}>
            <h3 style={{ margin: 0 }}>No chats yet</h3>
            <p style={{ margin: 0 }}>Click the + button to create a new chat</p>
          </Box>
        )}

        {user.chats.length > 0 && (
          <Box flexDirection="column" style={{ paddingBottom: '3.6rem' }}>
            {chats.map(chat => (
              <ChatEntry key={chat.id} chat={chat} openPasswordModal={() => setPasswordModalOpen(true)} />
            ))}
          </Box>
        )}

        <CreateChatModal open={createChatModalOpen} onClose={() => setCreateChatModalOpen(false)} />
        <PasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
      </>)}
    </>
  );
}

export default ChatListPage;
