import React, { useContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import Firebase from 'firebase/app';


interface IAuthContext {
  user: firebase.default.User | null;
  allowedUsers: string[];
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<IAuthContext | undefined>(undefined);
export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = React.useState<firebase.default.User | null>(null);
  const [allowedUsers, setAllowedUsers] = React.useState<string[]>([]);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user != null && (user.displayName == null || user.displayName === ''))
        await user.updateProfile({ displayName: user.email?.split('@')[0] }); // ensure user always has a display name

      if (user != null && user.displayName != null && user.displayName.length > 20)
        await user.updateProfile({ displayName: user.displayName.substring(0, 20) });

      setUser(user);
    });

    populateAllowedUsers();
    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const populateAllowedUsers = async () => {
    if (allowedUsers.length !== 0) return;
    const temp = [];

    try {
      const snapshot = await db.ref('allowedUsers').get();
      if (snapshot.exists()) {
        const val = snapshot.val();
        Object.keys(val).forEach((key: string) => {
          if (val[key] === true) temp.push(key);
        });
      }
    } catch (err) {
      console.error(err);
    }

    if (temp.length === 0) temp.push('_'); // to prevent infinite loop
    setAllowedUsers(temp);
  }

  const signInWithGoogle = async () => {
    const provider = new Firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  };

  const logout = async () => {
    await auth.signOut();
  };

  const getContent = () => {
    if (user == null || allowedUsers.length === 0 || allowedUsers.includes(user.uid))
      return children;

    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Access Denied</h1>
        <p>You are not allowed to use this app,</p>
        <p>only whitelisted UIDs can access this application!</p>

        <p style={{ marginTop: '1rem' }}>
          {user.email}
          <br />
          <small>Not you? <a onClick={logout} href="#">Sign in with a different account</a></small> {/* eslint-disable-line jsx-a11y/anchor-is-valid */}
        </p>
      </div>
    );
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
