import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';
import { Button } from '../Jet';


const AuthPage = () => {
  const { signInWithGoogle, user } = useAuthContext();
  const navigate = useNavigate();


  useEffect(() => {
    if (user) navigate('/chats');
  }, [user, navigate]);

  return (
    <div>
      <Button onClick={signInWithGoogle}>Sign In</Button>
    </div>
  );
}

export default AuthPage;
