import React, { useRef, useState } from 'react';
import { Box, Button, Drawer, Icon, IconEnum, Progress, TextField, theme } from '../../Jet';
import { Chat, SocketEvent } from '../../api/apiTypes';
import { isAsciiPrintable } from './CreateChatModal';
import { emitWithRes } from '../../api/websocket';
import useNotifications from '../../Jet/NotificationContext';
import styled from 'styled-components';
import { uploadFile } from '../../api/api';
import DeleteChatModal from './DeleteChatModal';
import ChatMembersList from './ChatMembersList';
import useAuth from '../../contexts/AuthContext';
import Avatar from '../Avatar';


const LabelStyle = styled.label`
  display: block;
  margin-top: 1rem;
`;

interface ChatSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  chat: Chat;
}

const ChatSettingsDrawer =  ({ open, onClose, chat }: ChatSettingsDrawerProps) => {
  const [name, setName] = useState(chat.title);
  const [nameError, setNameError] = useState<string>('');
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
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

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    try { // Upload to storage
      setUploadingIcon(true);
      const data = await uploadFile(`/media/${chat._id}/icon`, file);

      if (data.error)
        return addNotification({ variant: 'danger', text: data.message, dismissable: true });
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingIcon(false);
      if (ref && ref.current) ref.current.value = '';
    }
  }

  return (
    <>
      <Drawer side="right" open={open} onClose={onClose} closeOnOutsideClick style={{ minWidth: '30vw' }}>
        <LabelStyle htmlFor="name">Chat Name</LabelStyle>
        <TextField
          name="name"
          value={name}
          onChanged={onNameChange}
          error={nameError}
          onBlur={setChatName}
          fullWidth
        />

        <LabelStyle htmlFor="icon">Chat Icon</LabelStyle>
        <Box flexDirection="column" justifyContent="center" alignItems="center" style={{ cursor: 'pointer', marginTop: '0.4rem' }} onClick={() => ref?.current?.click()}>
          {uploadingIcon ? (
            <Progress circular indeterminate />
          ) : (
            <Avatar src={chat.iconURL} size={6} />
          )}
          <small style={{ textAlign: 'center', marginTop: '0.2rem' }}>Click to change</small>

          <input type="file" style={{ display: 'none' }} ref={ref} accept="image/*" onChange={onFileChange} />
        </Box>

        <LabelStyle htmlFor="icon">Chat Members</LabelStyle>
        <div
          style={{
            marginTop: '0.4rem',
            maxHeight: '450px',
            overflowY: 'auto',
            backgroundColor: theme.colors.background[1],
            border: '1px solid ' + theme.colors.background[5],
            padding: '0.4rem 0.8rem',
            borderRadius: theme.rounded
          }}
        >
          <ChatMembersList chat={chat} />
        </div>

        {chat.owner === user?._id && (
          <Box justifyContent="center">
            <Button variant="outlined" color="danger" style={{ position: 'fixed', bottom: '0.4rem', padding: '0.4rem 0.8rem' }} onClick={() => setConfirmDeleteModal(true)}>
              <Icon icon={IconEnum.trash} size={24} />
              Delete Chat
            </Button>
        </Box>
        )}
      </Drawer>

      <DeleteChatModal open={confirmDeleteModal} onClose={() => setConfirmDeleteModal(false)} chat={chat} />
    </>
  );
}

export default ChatSettingsDrawer;
