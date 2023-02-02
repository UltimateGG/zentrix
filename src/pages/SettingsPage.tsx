import React from 'react';
import useAuthContext from '../contexts/AuthContext';
import { Box, Button, ThemeContext } from '../Jet';


const defaultProfilePicture = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

const SettingsPage = () => {
  const { user, logout } = useAuthContext();
  const { theme } = React.useContext(ThemeContext);


  if (!user) return null;
  return (
    <div style={{ paddingTop: '0.4rem' }}>
      <Box justifyContent="center" alignItems="center" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3.6rem',
        padding: '1rem 2rem',
        textAlign: 'center',
        backgroundColor: theme.colors.background[1]
      }}>
        <h1 style={{ margin: 0 }}>Account</h1>
      </Box>
      <div style={{ marginBottom: '4rem' }} />

      <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ marginTop: '1rem' }}>
        <img src={user.photoURL || defaultProfilePicture} alt="profile" style={{ width: '6rem', height: '6rem', borderRadius: '50%' }} />

        {/* TODO: Changeable and get from db */}
        <h2 style={{ textAlign: 'center', marginTop: '0.6rem', marginBottom: 0 }}>{user.displayName}</h2>
        <p style={{ textAlign: 'center', marginTop: '0.2rem' }}>{user.email}</p>

        <Button style={{ marginTop: '1rem' }} variant="outlined" onClick={logout}>Logout</Button>
      </Box>
    </div>
  );
}

export default SettingsPage;
