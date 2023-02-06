import React from 'react';
import { AuthContextProvider } from './AuthContext';
import { NotificationProvider } from './NotificationContext';


const Contexts = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContextProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthContextProvider>
  );
}

export default Contexts;
