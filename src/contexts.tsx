import React from 'react';
import { AuthContextProvider } from './contexts/AuthContext';
import { ChatsContextProvider } from './contexts/ChatsContext';
import { NotificationProvider } from './contexts/NotificationContext';


const Contexts = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContextProvider>
      <ChatsContextProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ChatsContextProvider>
    </AuthContextProvider>
  );
}

export default Contexts;
