import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';
import { Box } from '../Jet';


const LoginPage = () => {
  const { signInWithGoogle, user } = useAuthContext();
  const navigate = useNavigate();


  useEffect(() => {
    if (user) navigate('/chats');
  }, [user, navigate]);

  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
      <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="Zentrix" style={{ width: '6rem', height: '6rem' }} />
      <p style={{ margin: '1rem 0' }}>Sign in to Zentrix</p>

      <img src={`https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_STORAGE_BUCKET}/o/static%2Fsignin_btn.png?alt=media`} alt="Sign in with Google" onClick={signInWithGoogle} style={{ cursor: 'pointer', width: '200px' }} />
    </Box>
  );
}

export default LoginPage;
