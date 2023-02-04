import React from 'react';
import { Button, Modal, TextField } from '../../Jet';


const isAsciiPrintable = (str: string) => /^[\x20-\x7E]*$/.test(str);

interface PasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const PasswordModal = ({ open, onClose }: PasswordModalProps) => {
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const onPasswordChange = (str: string) => {
    const typed = str.slice(password.length);
    if (typed.length === 0) return setPassword(str);
    if (typed.length === 0 || !isAsciiPrintable(typed) || str.length > 50) return;

    setPassword(str.trim());
    setError('');
  }

  const validate = () => {
    if (password.length === 0) return setError('Password cannot be empty');
    if (!isAsciiPrintable(password)) return setError('Invalid characters in password');
    setError('');

    return true;
  }

  const reset = () => {
    setPassword('');
    setError('');
  }

  const doClose = () => {
    reset();
    onClose();
  }

  const onUnlock = () => {
    if (!validate()) return;

    //.. TODO:

    doClose();
  }

  return (
    <Modal open={open} onClose={doClose} closeOnOutsideClick title="Enter Password">
      <p>This chat is encrypted. Please enter the password to view it.</p>

      <TextField
        type="password"
        placeholder="Enter password.."
        fullWidth
        autoFocus
        value={password}
        onChanged={str => onPasswordChange(str)}
        error={error}
        onBlur={validate}
        style={{ marginTop: '1rem' }}
      />

      <div style={{ marginTop: '1rem', float: 'right' }}>
        <Button onClick={doClose} style={{ marginRight: '1rem' }} variant="outlined">Cancel</Button>
        <Button onClick={onUnlock} disabled={error.length > 0 || password.length === 0}>Unlock</Button>
      </div>
    </Modal>
  );
}

export default PasswordModal;
