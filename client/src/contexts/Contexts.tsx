import React from 'react';
import { AuthContextProvider } from './AuthContext';
import { ChatsContextProvider } from './ChatsContext';
import { NotificationProvider } from './NotificationContext';


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
