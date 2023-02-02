import React, { useContext, useEffect } from 'react';
import { auth } from '../firebase';
import Firebase from 'firebase/app';


interface IAuthContext {
  user: firebase.default.User | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<IAuthContext | undefined>(undefined);
export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = React.useState<firebase.default.User | null>(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user != null && (user.displayName == null || user.displayName === ''))
        await user.updateProfile({ displayName: user.email?.split('@')[0] }); // ensure user always has a display name

      if (user != null && user.displayName != null && user.displayName.length > 20)
        await user.updateProfile({ displayName: user.displayName.substring(0, 20) });

      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new Firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout }}>
      {children}
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
