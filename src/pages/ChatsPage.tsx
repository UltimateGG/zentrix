import React from 'react';
import useAuthContext from '../contexts/AuthContext';
import { Box, Icon, IconEnum, ThemeContext } from '../Jet';


const ChatsPage = () => {
  const { user } = useAuthContext();
  const { theme } = React.useContext(ThemeContext);


  const createChat = () => {
    
  }

  return (
    <div>
      <Box justifyContent="space-between" alignItems="center" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3.6rem',
        padding: '1rem 2rem',
        backgroundColor: theme.colors.background[1]
      }}>
        <h2 style={{ margin: 0 }}>Chats</h2>
        <Icon icon={IconEnum.add_chat} style={{ cursor: 'pointer' }} size={32} onClick={createChat} />
      </Box>
      <div style={{ marginBottom: '4rem' }} />

      {/* TODO: list chats */}
    </div>
  );
}

export default ChatsPage;
