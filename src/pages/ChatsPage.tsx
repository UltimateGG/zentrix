import React from 'react';
import ChatEntry from '../components/ChatEntry';
import CreateChatModal from '../components/CreateChatModal';
import useAuthContext from '../contexts/AuthContext';
import useChatsContext from '../contexts/ChatsContext';
import { Box, Icon, IconEnum, ThemeContext } from '../Jet';


const ChatsPage = () => {
  const { user } = useAuthContext();
  const { theme } = React.useContext(ThemeContext);
  const [createChatModalOpen, setCreateChatModalOpen] = React.useState(false);
  const { chats, loadingChats} = useChatsContext();


  if (loadingChats) return (<h1>Loading...</h1>); // TODO: Loading component

  if (!user) return null;
  return (
    <>
      <Box justifyContent="space-between" alignItems="center" style={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        height: '3.6rem',
        padding: '1rem 2rem',
        backgroundColor: theme.colors.background[1]
      }}>
        <h2 style={{ margin: 0 }}>Chats</h2>
        <Icon icon={IconEnum.add_chat} style={{ cursor: 'pointer' }} size={32} onClick={() => setCreateChatModalOpen(true)} />
      </Box>

      {user.chats.length === 0 && (
        <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ marginTop: '4rem' }}>
          <h3 style={{ margin: 0 }}>No chats yet</h3>
          <p style={{ margin: 0 }}>Click the + button to create a new chat</p>
        </Box>
      )}

      {user.chats.length > 0 && (
        <Box flexDirection="column" style={{ marginTop: '1rem' }}>
          {chats.map(chat => (
            <ChatEntry key={chat.id} chat={chat} />
          ))}
        </Box>
      )}

      <CreateChatModal open={createChatModalOpen} onClose={() => setCreateChatModalOpen(false)} />
    </>
  );
}

export default ChatsPage;
