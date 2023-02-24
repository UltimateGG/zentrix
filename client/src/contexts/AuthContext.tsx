import React, { useContext, useEffect, useState } from 'react';
import { User } from '../api/apiTypes';
import { connect } from '../api/websocket';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import useNav from './NavigationContext';
import LoginPage from '../pages/LoginPage';
import { CACHE_KEY } from './DataCacheContext';


interface AuthContextProps {
  user: User | null;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);
export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firstLoad, setFirstLoad] = useState(true);

  const { currentPage, navigate } = useNav();


  useEffect(() => {
    if (!firstLoad) return;
    setFirstLoad(false);

    try {
      const self = localStorage.getItem(CACHE_KEY + 'user');
      if (self) {
        const parsed = JSON.parse(self) as User;
        setUser(parsed);

        const lastScreen = localStorage.getItem('lastScreen');
        if (lastScreen) navigate(parseInt(lastScreen));
      }
    } catch (e) {}

    connectToSocket();
  }, [firstLoad]); // eslint-disable-line react-hooks/exhaustive-deps


  // Update last screen
  useEffect(() => {
    if (currentPage === null) return;
    localStorage.setItem('lastScreen', currentPage + '');
  }, [currentPage]);

  const connectToSocket = async () => {
    await connect().then(user => {
      if (!user) return;
      setUser(user);
    }).catch(console.error);
  }

  const logout = async () => {
    localStorage.removeItem('zxtoken');
    localStorage.removeItem(CACHE_KEY + 'user');
    await GoogleAuth.signOut();
    setUser(null);
  }

  const getContent = () => {
    if (!user) return (<LoginPage />);

    return children;
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {getContent()}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('You are not using the correct provider.');
  return context;
}

export default useAuth;
