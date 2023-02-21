import React, { useContext, useEffect } from 'react';
import { SocketEvent, User } from '../api/apiTypes';
import LoadingScreen from '../pages/LoadingScreen';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect, emit } from '../api/websocket';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';


interface AuthContextProps {
  user: User | null;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);
export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loggingIn, setLoggingIn] = React.useState(true);
  const [firstLoad, setFirstLoad] = React.useState(true);

  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (!firstLoad) return;
    setFirstLoad(false);

    connectToSocket();
  }, [firstLoad]); // eslint-disable-line react-hooks/exhaustive-deps


  // Update last screen
  useEffect(() => {
    if (!user) return;
    if (location.pathname === '' || location.pathname === '/') return;
    if (location.pathname === user.lastScreen) return;

    emit(SocketEvent.SET_LAST_SCREEN, { screen: location.pathname });
    user.lastScreen = location.pathname;
  }, [location.pathname, user]);

  const connectToSocket = async () => {
    setLoggingIn(true);

    await connect().then(user => {
      if (user) setUser(user);
      navigate(user.lastScreen || '/chats');
    }).catch(console.error);

    setLoggingIn(false);
  }

  const logout = async () => {
    localStorage.removeItem('zxtoken');
    await GoogleAuth.signOut();
    setUser(null);
    navigate('/');
  };

  const getLoadingScreenStatus = () => {
    if (loggingIn) return 'Logging in...';
    return 'Loading...';
  }

  const getContent = () => {
    if (loggingIn)
      return (<LoadingScreen status={getLoadingScreenStatus()} />);

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
