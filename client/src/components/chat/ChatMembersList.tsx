import React from 'react';
import { Chat, SocketEvent, User } from '../../api/apiTypes';
import { emit } from '../../api/websocket';
import useAuth from '../../contexts/AuthContext';
import useDataCache from '../../contexts/DataCacheContext';
import useNotifications from '../../Jet/NotificationContext';
import { Box, Checkbox, theme } from '../../Jet';
import Avatar from '../Avatar';


interface ChatMemberProps {
  user: User;
  isOwner: boolean;
  added: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const ChatMember = ({ user, isOwner, added, onToggle, disabled, style }: ChatMemberProps) => {
  return (
    <Box
      justifyContent="space-between"
      alignItems="center"
      spacing="1rem"
      onClick={disabled ? undefined : onToggle}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: theme.colors.background[1],
        borderBottom: `1px solid ${theme.colors.background[2]}`,
        width: '100%',
        padding: '0.4rem 0.6rem',
        ...style
      }}
    >
      <Box alignItems="center" spacing="1rem">
        <Avatar src={user.iconURL} size={3} />

        <Box flexDirection="column">
          <p>{isOwner ? <>&#128081; {user.displayName}</> : user.displayName}</p>
          
          <small>{user.email}</small>
        </Box>
      </Box>

      <Checkbox checked={added} disabled={disabled} />
    </Box>
  );
}

interface ChatMembersListProps {
  chat: Chat;
}

const ChatMembersList = ({ chat }: ChatMembersListProps) => {
  const { user } = useAuth();
  const { users } = useDataCache();
  const [updating, setUpdating] = React.useState(false);

  const { addNotification } = useNotifications();


  const onToggleMember = async (user: User) => {
    const isMember = chat.members.includes(user._id);

    setUpdating(true);
    await emit(SocketEvent.CHAT_UPDATE_MEMBERS, { id: chat._id, member: user._id, add: !isMember }).catch(e => {
      addNotification({ variant: 'danger', text: e.message, dismissable: true });
    });
    setUpdating(false);
  }

  const sortedUsers = users.sort((a, b) => {
    if (chat.owner === a._id) return -1;
    if (a._id === user?._id) return -1;
    const aInChat = chat.members.includes(a._id);
    const bInChat = chat.members.includes(b._id);

    if (aInChat && !bInChat) return -1;
    if (!aInChat && bInChat) return 1;
    return 0;
  });

  return (
    <>
      <Box flexDirection="column" alignItems="center" spacing="0.4rem">
        {sortedUsers.map((u, index) => (
          <ChatMember
            key={u._id}
            user={u}
            isOwner={chat.owner === u._id}
            added={chat.members.includes(u._id)}
            onToggle={() => onToggleMember(u)}
            disabled={updating || u._id === user?._id || chat.owner === u._id}
            style={{
              borderBottom: index === sortedUsers.length - 1 ? 'none' : undefined
            }}
          />
        ))}
      </Box>
    </>
  );
}

export default ChatMembersList;
