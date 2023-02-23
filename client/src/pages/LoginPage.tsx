import React, { useEffect } from 'react';
import { loginWithGoogle, LOGO_URL } from '../api/api';
import useAuth from '../contexts/AuthContext';
import useNotifications from '../Jet/NotificationContext';
import { Box, Button, theme } from '../Jet';
import Image from '../components/Image';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';
import StatusBar from '../components/StatusBar';
import useNav, { Page } from '../contexts/NavigationContext';


if (!Capacitor.isNativePlatform()) {
  GoogleAuth.initialize({
    clientId: '1081704696779-p54joiqdcdck56d1951q175r73ekmomm.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    grantOfflineAccess: true,
  });
}

const LoginPage = () => {
  const { user } = useAuth();
  const { navigate } = useNav();
  const { addNotification } = useNotifications();

  
  useEffect(() => {
    if (user) navigate(user.lastScreen || Page.CHAT_LIST);
  }, [user, navigate]);

  const signIn = async () => {
    const res = await GoogleAuth.signIn();
    const credential = res.authentication.idToken;

    const data = await loginWithGoogle(credential);

    if (data.error) return addNotification({ text: data.message || 'An unknown error occurred', variant: 'danger', dismissable: true });
    window.location.reload();
  }

  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
      <StatusBar color={theme.colors.background[0]} />
      <Image src={LOGO_URL} referrerPolicy="no-referrer" alt="Zentrix" style={{ width: '6rem', height: '6rem', borderRadius: '50%' }} />
      <h4 style={{ margin: '1rem 0' }}>Sign in to Zentrix</h4>
      
      <Button onClick={signIn}>
        Sign in with Google
      </Button>
    </Box>
  );
}

export default LoginPage;
