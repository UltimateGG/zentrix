import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import { AuthContextProvider } from './AuthContext';
import { DataCacheContextProvider } from './DataCacheContext';


const Contexts = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || ''}>
      <AuthContextProvider>
        <DataCacheContextProvider>
          {children}
        </DataCacheContextProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  );
}

export default Contexts;
