import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle, LOGO_URL } from '../api/api';
import useAuth from '../contexts/AuthContext';
import useNotifications from '../Jet/NotificationContext';
import { Box } from '../Jet';
import styled from 'styled-components';
import Image from '../components/Image';


const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();


  useEffect(() => {
    if (user) navigate(user.lastScreen || '/chats');
  }, [user, navigate]);

  const onSuccess = async (res: CredentialResponse) => {
    if (!res.credential) return;

    const data = await loginWithGoogle(res.credential);

    if (data.error) return addNotification({ text: data.message || 'An unknown error occurred', variant: 'danger', dismissable: true });
    window.location.reload();
  }

  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
      <Image src={LOGO_URL} referrerPolicy="no-referrer" alt="Zentrix" style={{ width: '6rem', height: '6rem', borderRadius: '50%' }} />
      <h4 style={{ margin: '1rem 0' }}>Sign in to Zentrix</h4>
      
      <GoogleLogin onSuccess={onSuccess} />
    </Box>
  );
}

export default LoginPage;
