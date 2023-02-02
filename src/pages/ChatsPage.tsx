import React from 'react';
import useAuthContext from '../contexts/AuthContext';
import { Button } from '../Jet';


const ChatsPage = () => {
  const { user, logout } = useAuthContext();

  return (
    <div>
      <h1>Chats</h1>
      {user?.displayName}

      <Button onClick={logout}>Sign Out</Button>
    </div>
  );
}

export default ChatsPage;
