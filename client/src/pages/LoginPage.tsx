import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import useAuth from '../contexts/AuthContext';
import { Box } from '../Jet';


const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (user) navigate(user.lastScreen || '/chats');
  }, [user, navigate]);

  const onSuccess = async (res: CredentialResponse) => {
    if (!res.credential) return;

    const data = await login(res.credential);
    console.log(data)
  }

  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
      <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="Zentrix" style={{ width: '6rem', height: '6rem' }} />
      <p style={{ margin: '1rem 0' }}>Sign in to Zentrix</p>

      <GoogleLogin onSuccess={onSuccess} />
    </Box>
  );
}

export default LoginPage;
