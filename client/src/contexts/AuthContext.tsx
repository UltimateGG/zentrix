import React, { useContext, useEffect } from 'react';
import User from '../api/User';
import LoadingScreen from '../pages/LoadingScreen';
import { useLocation, useNavigate } from 'react-router-dom';


interface AuthContextProps {
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);
export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);

  const [loggingIn, setLoggingIn] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    setLoggingIn(false);
   /* const unsubscribe = auth.onAuthStateChanged(async user => {
      if (!user) {
        setUser(null);
        setLoggingIn(false);
        return;
      }

      const newUser = await ZentrixUser.getUser(user as User);
      setUser(newUser);
      if (newUser.lastScreen != null) navigate(newUser.lastScreen);

      setLoggingIn(false);
    });

    return () => unsubscribe();*/
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // User update listener
  useEffect(() => {
    if (!user) return;

    //...
  }, [user]);

  // Update last screen
  useEffect(() => {
    if (!user) return;
    if (location.pathname === '' || location.pathname === '/') return;
    if (location.pathname === user.lastScreen) return;

    user.setLastScreen(location.pathname);
  }, [location.pathname, user]);

  const loginWithGoogle = async () => {
    // ...
  };

  const logout = async () => {
    // ...
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
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
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
