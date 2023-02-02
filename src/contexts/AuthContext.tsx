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
    const unsubscribe = auth.onAuthStateChanged(user => {
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
