import React, { useContext, useEffect } from 'react';
import User from '../api/User';
import LoadingScreen from '../pages/LoadingScreen';
import { useLocation, useNavigate } from 'react-router-dom';


interface AuthContextProps {
  user: User | null;
  connectToSocket: () => void;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);
export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);

  const [loggingIn, setLoggingIn] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => connectToSocket());

  // Update last screen
  useEffect(() => {
    if (!user) return;
    if (location.pathname === '' || location.pathname === '/') return;
    if (location.pathname === user.lastScreen) return;

    user.setLastScreen(location.pathname);
  }, [location.pathname, user]);

  const connectToSocket = () => {
    setLoggingIn(true);

    // Try to connect to socket. This runs on initial load or when manually signed in from google button
    // If failed, set logging in to false. This is what will show the loading screen normall when a user opens the app
  }

  const logout = async () => {
    await logout();
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
    <AuthContext.Provider value={{ user, connectToSocket, logout }}>
      {getContent()}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('You are not using the correct provider.');
  return context;
};

export default useAuth;
