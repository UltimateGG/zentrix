import React, { useEffect } from 'react';
import { Chat } from '../../api/apiTypes';
import useDataCache from '../../contexts/DataCacheContext';
import { Modal } from '../../Jet';


interface ChatMember {
  id: string;
}

const ChatMember = ({ id }: ChatMember) => {
  const { users } = useDataCache();
  const user = users.find(u => u._id === id);

  return (
    <div className="chat-member">
      {user && user.loading ? 'Loading...' : user?.displayName}

    </div>
  );
}

interface ChatMembersModalProps {
  open: boolean;
  onClose: () => void;
  chat: Chat;
}

const ChatMembersModal = ({ open, onClose, chat }: ChatMembersModalProps) => {
  const { getUsers } = useDataCache();


  useEffect(() => {
    if (!open) return;
    getUsers(chat.participants);
  }, [chat.participants]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Chat Members"
      closeOnOutsideClick
    >
      {chat.participants.map(id => <ChatMember key={id} id={id} />)}
    </Modal>
  );
}

export default ChatMembersModal;
