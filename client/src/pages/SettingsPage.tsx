import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { uploadFile } from '../api/api';
import { SocketEvent } from '../api/apiTypes';
import { emit } from '../api/websocket';
import Avatar from '../components/Avatar';
import useAuth from '../contexts/AuthContext';
import useNotifications from '../Jet/NotificationContext';
import { Box, Progress, TextField, theme } from '../Jet';
import StatusBar from '../components/StatusBar';
import useDataCache from '../contexts/DataCacheContext';
import { Capacitor } from '@capacitor/core';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';


const SettingStyle = styled(Box).attrs((props: any) => props)`
  width: 100%;
  background-color: ${theme.colors.background[1]};
  justify-content: center;
  align-items: center;
  text-align: center;
  border-top: 1px solid ${theme.colors.background[3]};
  border-bottom: ${props => props.nb ? `none` : `1px solid ${theme.colors.background[3]}`};
  padding: 0.4rem;
  cursor: pointer;

  p {
    margin: 0;
    color: ${theme.colors.text[7]};
  }
`;

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { safeArea } = useDataCache();
  const { addNotification } = useNotifications();
  const [editingDisplayName, setEditingDisplayName] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(user?.displayName || '');
  const [uploadingIcon, setUploadingIcon] = React.useState(false);
  const [error, setError] = React.useState('');
  const ref = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    Keyboard.setResizeMode({ mode: KeyboardResize.None });

    return () => {
      Keyboard.setResizeMode({ mode: KeyboardResize.Native });
    }
  });

  const updateDisplayName = async () => {
    const cleanDisplayName = displayName.trim();

    if (cleanDisplayName.length < 3 || cleanDisplayName.length > 20) {
      setError('Must be between 3 and 20 characters');
      return;
    }

    emit(SocketEvent.SET_DISPLAY_NAME, { displayName: cleanDisplayName });
    if (user) user.displayName = cleanDisplayName;
    setEditingDisplayName(false);
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!user || !file || !file.type.startsWith('image/')) return;

    try { // Upload to storage
      setUploadingIcon(true);
      const data = await uploadFile('/media/pfp', file);

      if (data.error)
        return addNotification({ variant: 'danger', text: data.message, dismissable: true });

      user.iconURL = data.path;
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingIcon(false);
      if (ref && ref.current) ref.current.value = '';
    }
  }

  const safeAreaTop = safeArea?.insets.top || 0;

  if (!user) return null;
  return (
    <div>
      <StatusBar color={theme.colors.background[1]} />
      <Box justifyContent="center" alignItems="center" style={{
        height: `calc(3.2rem + ${safeAreaTop}px)`,
        padding: '0.2rem 1rem',
        paddingTop: safeAreaTop === 0 ? '0.2rem' : safeAreaTop,
        textAlign: 'center',
        backgroundColor: theme.colors.background[1]
      }}>
        <h1 style={{ margin: 0 }}>Account</h1>
      </Box>

      <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ margin: '1rem 0' }}>
        <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ cursor: 'pointer' }} onClick={() => ref?.current?.click()}>
          {uploadingIcon ? (
            <Progress circular indeterminate />
          ) : (
            <Avatar src={user.iconURL} size={6} />
          )}
          <small style={{ textAlign: 'center', marginTop: '0.2rem' }}>Click to change</small>

          <input type="file" style={{ display: 'none' }} ref={ref} accept="image/*" onChange={onFileChange} />
        </Box>

        {editingDisplayName ? (
          <TextField
            placeholder="Enter name..."
            value={displayName}
            onChanged={s => setDisplayName(s)}
            onKeyDown={e => e.key === 'Enter' && updateDisplayName()}
            error={error}
            onBlur={updateDisplayName}
            style={{ marginTop: '1rem' }}
            autoFocus
            enterKeyHint="done"
          />
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

      {process.env.REACT_APP_VERSION && (
        <small style={{ position: 'absolute', bottom: `calc(4.2rem + ${safeArea?.insets.bottom || 0}px)`, left: '50%', transform: 'translateX(-50%)' }}>Zentrix v{process.env.REACT_APP_VERSION}</small>
      )}
    </div>
  );
}

export default SettingsPage;
