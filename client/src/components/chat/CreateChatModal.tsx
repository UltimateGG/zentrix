import React from 'react';
import { SocketEvent } from '../../api/apiTypes';
import { emitWithRes } from '../../api/websocket';
import useAuth from '../../contexts/AuthContext';
import useNotifications from '../../contexts/NotificationContext';
import { Button, Modal, Progress, Switch, TextField } from '../../Jet';


interface CreateChatModalProps {
  open: boolean;
  onClose: () => void;
}

export const isAsciiPrintable = (str: string) => /^[\x20-\x7E]*$/.test(str);

const CreateChatModal = ({ open, onClose }: CreateChatModalProps) => {
  const [name, setName] = React.useState<string>('');
  const [nameError, setNameError] = React.useState<string>('');
  const [encrypted, setEncrypted] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');
  const [passwordError, setPasswordError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const { addNotification } = useNotifications();
  const { user } = useAuth();
  if (!user) return null;


  const onNameChange = (str: string) => {
    const typed = str.slice(name.length);
    if (typed.length === 0) return setName(str);
    if (typed.length === 0 || !isAsciiPrintable(typed) || str.length > 50) return;
    
    setName(str.trimStart());
    setNameError('');
  }

  const onPasswordChange = (str: string) => {
    const typed = str.slice(password.length);
    if (typed.length === 0) return setPassword(str);
    if (typed.length === 0 || !isAsciiPrintable(typed) || str.length > 50) return;

    setPassword(str.trim());
    setPasswordError('');
  }

  const validate = () => {
    if (name.length === 0) return setNameError('Chat name cannot be empty');
    if (!isAsciiPrintable(name)) return setNameError('Invalid characters in name');
    setNameError('');

    if (encrypted && password.length === 0) return setPasswordError('Password cannot be empty');
    if (encrypted && password.length < 3) return setPasswordError('Minimum password length is 3');
    if (encrypted && !isAsciiPrintable(password)) return setPasswordError('Invalid characters in password');
    setPasswordError('');

    return true;
  }

  const reset = () => {
    setName('');
    setNameError('');
    setEncrypted(false);
    setPassword('');
    setPasswordError('');
    setLoading(false);
  }

  const createChat = async () => {
    if (!validate()) return;
    setLoading(true);
    await emitWithRes(SocketEvent.CREATE_CHAT, { title: name, encrypted, password, participants: [] }).catch(e => {
      addNotification({ text: e.message, variant: 'danger', dismissable: true });
    });

    setLoading(false);
    reset();
    onClose();
  }

  return (
    <Modal
      title="New Chat"
      open={open}
      closeOnOutsideClick
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <label htmlFor="chat-name">Chat Name</label><br />
      <TextField
        placeholder="Something cool.."
        name="chat-name"
        style={{ marginBottom: '1rem' }}
        autoFocus
        fullWidth
        value={name}
        onChanged={onNameChange}
        error={nameError}
        onBlur={validate}
        disabled={loading}
      />

      <Switch
        label="Encrypt Chat"
        name="encrypt-chat"
        checked={encrypted}
        onCheck={v => {
          setEncrypted(v);
          setPasswordError('');
        }}
        lightBg
        style={{ marginBottom: '1rem' }}
        disabled={loading}
      /><br/>

      {encrypted && (
        <>
          <label htmlFor="chat-password">Password</label><br />
          <TextField
            placeholder="Password"
            name="chat-password"
            style={{ marginBottom: '1rem' }}
            fullWidth
            value={password}
            onChanged={onPasswordChange}
            error={passwordError}
            onBlur={validate}
            disabled={loading}
          />
        </>
      )}

      <Button
        style={{ marginTop: '1rem', marginBottom: '0.2rem' }}
        block
        onClick={createChat}
        disabled={nameError.length > 0 || passwordError.length > 0 || loading}
      >
        Create
      </Button>

      {loading && <Progress indeterminate thin />}

      <small>You can add friends to this chat later</small>
    </Modal>
  );
}

export default CreateChatModal;
