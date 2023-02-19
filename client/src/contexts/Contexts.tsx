import React from 'react';
import { AuthContextProvider } from './AuthContext';
import { DataCacheContextProvider } from './DataCacheContext';


const Contexts = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContextProvider>
      <DataCacheContextProvider>
        {children}
      </DataCacheContextProvider>
    </AuthContextProvider>
  );
}

export default Contexts;
