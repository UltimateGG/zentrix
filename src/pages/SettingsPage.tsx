import React from 'react';
import styled from 'styled-components';
import useAuthContext from '../contexts/AuthContext';
import { Box, Button, Progress, TextField, ThemeContext } from '../Jet';


const defaultProfilePicture = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

const SettingStyle = styled(Box).attrs((props: any) => props)`
  width: 100%;
  background-color: ${props => props.theme.colors.background[1]};
  justify-content: center;
  align-items: center;
  text-align: center;
  border-top: 1px solid ${props => props.theme.colors.background[3]};
  border-bottom: ${props => props.nb ? `none` : `1px solid ${props.theme.colors.background[3]}`};
  padding: 0.4rem;
  cursor: pointer;

  p {
    margin: 0;
    color: ${props => props.theme.colors.text[7]};
  }
`;

const SettingsPage = () => {
  const { user, logout } = useAuthContext();
  const { theme } = React.useContext(ThemeContext);
  const [editingDisplayName, setEditingDisplayName] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(user?.displayName || '');
  const [updatingDisplayName, setUpdatingDisplayName] = React.useState(false);
  const [error, setError] = React.useState('');


  const updateDisplayName = async () => {
    const cleanDisplayName = displayName.trim();

    if (cleanDisplayName.length < 3 || cleanDisplayName.length > 20) {
      setError('Display name must be between 3 and 20 characters');
      return;
    }

    try {
      setUpdatingDisplayName(true);
      await user?.updateProfile({ displayName: cleanDisplayName });
    } catch (err) {
      console.error(err);
    }

    setUpdatingDisplayName(false);
    setEditingDisplayName(false);
  }

  if (!user) return null;
  return (
    <div>
      <Box justifyContent="center" alignItems="center" style={{
        height: '3.6rem',
        padding: '1rem 2rem',
        textAlign: 'center',
        backgroundColor: theme.colors.background[1]
      }}>
        <h1 style={{ margin: 0 }}>Account</h1>
      </Box>

      <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ margin: '1rem 0' }}>
        <img src={user.photoURL || defaultProfilePicture} alt="profile" style={{ width: '6rem', height: '6rem', borderRadius: '50%' }} />

        {editingDisplayName ? (
          <>
            {updatingDisplayName ? (
              <Progress circular indeterminate />
            ) : (
              <TextField
                placeholder="Enter name..."
                value={displayName}
                onChanged={s => setDisplayName(s)}
                error={error}
                onBlur={updateDisplayName}
                style={{ marginTop: '1rem' }}
                autoFocus
              />
            )}
          </>
        ) : (
          <h2 style={{ textAlign: 'center', marginTop: '0.6rem', marginBottom: 0 }}>{displayName}</h2>
        )}
        <p style={{ textAlign: 'center', marginTop: '0.2rem' }}>{user.email}</p>
      </Box>

      <SettingStyle theme={theme} style={{ marginTop: '2rem' }} onClick={() => setEditingDisplayName(true)}>
        <p>Display Name</p>
      </SettingStyle>

      <SettingStyle theme={theme} onClick={logout} style={{ marginTop: '1.6rem' }}>
        <p style={{ color: theme.colors.danger[0] }}>Log Out</p>
      </SettingStyle>
    </div>
  );
}

export default SettingsPage;
