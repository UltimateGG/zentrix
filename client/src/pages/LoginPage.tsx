import React, { useEffect } from 'react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../api/api';
import useAuth from '../contexts/AuthContext';
import useNotifications from '../contexts/NotificationContext';
import { Box } from '../Jet';


const LoginPage = () => {
  const { user, connectToSocket } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();


  useEffect(() => {
    if (user) navigate(user.lastScreen || '/chats');
  }, [user, navigate]);

  const onSuccess = async (res: CredentialResponse) => {
    if (!res.credential) return;

    const data = await getAuthToken(res.credential);

    if (data.error) return addNotification({ text: data.message || 'An unknown error occurred', variant: 'danger', dismissable: true });
    connectToSocket();
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
