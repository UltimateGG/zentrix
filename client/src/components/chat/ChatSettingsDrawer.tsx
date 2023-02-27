import React, { useRef, useState } from 'react';
import { Box, Button, Drawer, Icon, IconEnum, Progress, TextField, theme } from '../../Jet';
import { Chat, SocketEvent } from '../../api/apiTypes';
import { isAsciiPrintable } from './CreateChatModal';
import { emit } from '../../api/websocket';
import useNotifications from '../../Jet/NotificationContext';
import styled from 'styled-components';
import { uploadFile } from '../../api/api';
import DeleteChatModal from './DeleteChatModal';
import ChatMembersList from './ChatMembersList';
import useAuth from '../../contexts/AuthContext';
import Avatar from '../Avatar';
import useDataCache from '../../contexts/DataCacheContext';


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
  const [topic, setTopic] = useState(chat.topic || '');
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { safeArea } = useDataCache();
  const { addNotification } = useNotifications();


  const onNameChange = (str: string) => {
    setName(str.trimStart());
    setNameError('');
  }

  const onTopicChange = (str: string) => {
    setTopic(str.trimStart());
  }

  const setChatName = () => {
    if (name.length === 0) return setNameError('Chat name cannot be empty');
    if (!isAsciiPrintable(name)) return setNameError('Invalid characters in name');
    setNameError('');

    if (name === chat.title) return;
    emit(SocketEvent.UPDATE_CHAT, { ...chat, title: name }).catch(e => {
      addNotification({ variant: 'danger', text: e.message, seconds: 10, dismissable: true });
    });
  }

  const setChatTopic = () => {
    if (topic === chat.topic) return;
    emit(SocketEvent.UPDATE_CHAT, { ...chat, topic }).catch(e => {
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
      <Drawer side="right" open={open} onClose={onClose} closeOnOutsideClick style={{ minWidth: '30vw' }} pt={safeArea?.insets.top || 0} pb={safeArea?.insets.bottom || 0}>
        <LabelStyle htmlFor="name">Chat Name</LabelStyle>
        <TextField
          name="name"
          value={name}
          maxLength={50}
          onChanged={onNameChange}
          error={nameError}
          onBlur={setChatName}
          onKeyDown={e => {
            if (e.key !== 'Enter') return;
            (e.target as HTMLInputElement).blur();
          }}
          fullWidth
          enterKeyHint="done"
        />

        <LabelStyle htmlFor="topic">Chat Topic</LabelStyle>
        <TextField
          name="topic"
          value={topic}
          maxLength={200}
          onChanged={onTopicChange}
          onBlur={setChatTopic}
          onKeyDown={e => {
            if (e.key !== 'Enter') return;
            (e.target as HTMLInputElement).blur();
          }}
          fullWidth
          enterKeyHint="done"
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
            <Button variant="outlined" color="danger" style={{ position: 'fixed', bottom: `calc(1.4rem)`, padding: '0.4rem 0.8rem' }} onClick={() => setConfirmDeleteModal(true)}>
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
