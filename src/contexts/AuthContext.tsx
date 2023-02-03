import React, { useContext, useEffect } from 'react';
import { auth, db } from '../api/firebase';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { get, onValue, ref } from 'firebase/database';
import ZentrixUser from '../api/ZentrixUser';


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


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (!user) return setUser(null);

      const newUser = await ZentrixUser.getUser(user as User);
      setUser(newUser);
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
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await auth.signOut();
  };

  const getContent = () => {
    if (user == null || allowedUsers.length === 0 || allowedUsers.includes(user.id))
      return children;

    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Access Denied</h1>
        <p>You are not allowed to use this app,</p>
        <p>only whitelisted UIDs can access this application!</p>

        <p style={{ marginTop: '1rem' }}>
          {user.firebaseUser.email}
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
