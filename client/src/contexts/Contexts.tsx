import React from 'react';
import { AuthContextProvider } from './AuthContext';
import { DataCacheContextProvider } from './DataCacheContext';
import { NavigationContextProvider } from './NavigationContext';


const Contexts = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationContextProvider>
      <AuthContextProvider>
        <DataCacheContextProvider>
          {children}
        </DataCacheContextProvider>
      </AuthContextProvider>
    </NavigationContextProvider>
  );
}

export default Contexts;
