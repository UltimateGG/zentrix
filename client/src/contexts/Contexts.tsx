import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import { AuthContextProvider } from './AuthContext';
import { NotificationProvider } from './NotificationContext';


const Contexts = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || ''}>
      <AuthContextProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  );
}

export default Contexts;
