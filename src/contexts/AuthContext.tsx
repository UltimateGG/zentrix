import React, { useContext, useEffect } from 'react';
import { auth, db } from '../api/firebase';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { get, onValue, ref } from 'firebase/database';
import ZentrixUser from '../api/ZentrixUser';
import LoadingScreen from '../pages/LoadingScreen';
import UnauthorizedPage from '../pages/UnauthorizedPage';


interface IAuthContext {
  user: ZentrixUser | null;
  allowedUsers: string[];
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<IAuthContext | undefined>(undefined);
export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = React.useState<ZentrixUser | null>(null);
  const [allowedUsers, setAllowedUsers] = React.useState<string[]>([]);

  const [loggingIn, setLoggingIn] = React.useState(true);
  const [authenticating, setAuthenticating] = React.useState(true);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (!user) {
        setUser(null);
        setLoggingIn(false);
        return;
      }

      const newUser = await ZentrixUser.getUser(user as User);
      setUser(newUser);
      setLoggingIn(false);
    });

    if (allowedUsers.length === 0) populateAllowedUsers();
    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // User update listener
  useEffect(() => {
    if (!user) return;

    let initial = true;
    const unsubscribe = onValue(user.dbRef, snapshot => {
      if (initial) {
        initial = false;
        return;
      }
      if (!snapshot.exists()) return;

      user.update(snapshot.val());
      setUser(user.clone()); // Or else React won't update the component
    });

    return () => unsubscribe();
  }, [user]);

  const populateAllowedUsers = async () => {
    const temp = [];

    try {
      const snapshot = await get(ref(db, 'allowedUsers'));
      if (snapshot.exists()) {
        const val = snapshot.val();
        Object.keys(val).forEach((key: string) => {
          if (val[key] === true) temp.push(key);
        });
      }
    } catch (err) {
      console.error('Error loading user whitelist', err);
    }

    if (temp.length === 0) temp.push('_'); // to prevent infinite loop
    setAllowedUsers(temp);
    setAuthenticating(false);
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await auth.signOut();
  };

  const getLoadingScreenStatus = () => {
    if (loggingIn) return 'Logging in...';
    if (authenticating) return 'Authenticating...';
    return 'Loading...';
  }

  const getContent = () => {
    if (loggingIn || authenticating)
      return (<LoadingScreen status={getLoadingScreenStatus()} />);
    
    if (user != null && !allowedUsers.includes(user.id))
      return (<UnauthorizedPage />);

    return children;
  }

  return (
    <AuthContext.Provider value={{ user, allowedUsers, signInWithGoogle, logout }}>
      {getContent()}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('You are not using the correct provider.');
  return context;
};

export default useAuthContext;
