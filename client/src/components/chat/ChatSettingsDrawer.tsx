import React from 'react';
import { Drawer, TextField } from '../../Jet';
import { Chat, SocketEvent } from '../../api/apiTypes';
import { isAsciiPrintable } from './CreateChatModal';
import { emitWithRes } from '../../api/websocket';
import useNotifications from '../../contexts/NotificationContext';


interface ChatSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  chat: Chat;
}

const ChatSettingsDrawer =  ({ open, onClose, chat }: ChatSettingsDrawerProps) => {
  const [name, setName] = React.useState(chat.title);
  const [nameError, setNameError] = React.useState<string>('');
  const { addNotification } = useNotifications();


  const onNameChange = (str: string) => {
    const typed = str.slice(name.length);
    if (typed.length === 0) return setName(str);
    if (typed.length === 0 || !isAsciiPrintable(typed) || str.length > 50) return;
    
    setName(str.trimStart());
    setNameError('');
  }

  const setChatName = () => {
    if (name.length === 0) return setNameError('Chat name cannot be empty');
    if (!isAsciiPrintable(name)) return setNameError('Invalid characters in name');
    setNameError('');

    emitWithRes(SocketEvent.UPDATE_CHAT, { id: chat._id, title: name }).catch(e => {
      addNotification({ variant: 'danger', text: e.message, seconds: 10, dismissable: true });
    });
  }

  return (
    <Drawer side="right" open={open} onClose={onClose} closeOnOutsideClick style={{ minWidth: '30vw', paddingTop: '2rem' }}>
      <label htmlFor="name" style={{ display: 'block' }}>Chat Name</label>
      <TextField
        name="name"
        value={name}
        onChanged={onNameChange}
        error={nameError}
        onBlur={setChatName}
      />

      <label htmlFor="icon" style={{ display: 'block' }}>Chat Icon</label>

      <label htmlFor="participants" style={{ display: 'block' }}>Participants</label>

      <label htmlFor="delete" style={{ display: 'block' }}>Delete Chat</label>
    </Drawer>
  );
}

export default ChatSettingsDrawer;
