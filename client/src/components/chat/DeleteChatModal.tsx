import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chat, SocketEvent } from '../../api/apiTypes';
import { emitWithRes } from '../../api/websocket';
import { Box, Button, Modal } from '../../Jet';


interface DeleteChatModalProps {
  open?: boolean;
  onClose?: () => void;
  chat: Chat;
}

const DeleteChatModal = ({ open, onClose, chat }: DeleteChatModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();


  const deleteChat = async () => {
    setDeleting(true);
    await emitWithRes(SocketEvent.DELETE_CHAT, { id: chat._id }).catch(e => {});
    navigate('/chats');
    setDeleting(false);
  }

  return (
    <Modal
      open={open}
      onClose={deleting ? undefined : onClose}
      title="Delete Chat"
      closeOnOutsideClick
    >
      <p>Are you sure you want to delete "{chat.title}"?</p>
      <br />
      <p>All messages will be permanently deleted.</p>
      <p>This action <b>cannot</b> be undone.</p>

      <Box justifyContent="flex-end" spacing="1rem" style={{ marginTop: '1.2rem' }}>
        <Button color="secondary" onClick={onClose} disabled={deleting}>Cancel</Button>
        <Button color="danger" onClick={deleteChat} disabled={deleting}>Delete Chat</Button>
      </Box>
    </Modal>
  );
}

export default DeleteChatModal;
