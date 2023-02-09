import React, { useContext } from 'react';
import { Chat, SocketEvent, User } from '../../api/apiTypes';
import { emitWithRes } from '../../api/websocket';
import useAuth from '../../contexts/AuthContext';
import useDataCache from '../../contexts/DataCacheContext';
import useNotifications from '../../contexts/NotificationContext';
import { Box, Checkbox, Progress, ThemeContext } from '../../Jet';
import Image from '../Image';


interface ChatMemberProps {
  user: User;
  added: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const ChatMember = ({ user, added, onToggle, disabled, style }: ChatMemberProps) => {
  const { theme } = useContext(ThemeContext);


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
        <Image src={user.iconURL} style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} />

        <Box flexDirection="column">
          <p>{user.displayName}</p>
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
  const { users, loading } = useDataCache();
  const [updating, setUpdating] = React.useState(false);

  const { addNotification } = useNotifications();


  const onToggleMember = async (user: User) => {
    const newMembers = [...chat.members];

    if (newMembers.includes(user._id)) newMembers.splice(newMembers.indexOf(user._id), 1);
    else newMembers.push(user._id);

    setUpdating(true);
    await emitWithRes(SocketEvent.CHAT_UPDATE_MEMBERS, { id: chat._id, members: newMembers }).catch(e => {
      addNotification({ variant: 'danger', text: 'Error updating chat members', dismissable: true });
    });
    setUpdating(false);
  }

  const sortedUsers = users.sort((a, b) => {
    if (a._id === user?._id) return -1;
    const aInChat = chat.members.includes(a._id);
    const bInChat = chat.members.includes(b._id);

    if (aInChat && !bInChat) return -1;
    if (!aInChat && bInChat) return 1;
    return 0;
  });

  return (
    <>
      {loading && <Box justifyContent="center"><Progress circular indeterminate /></Box>}

      <Box flexDirection="column" alignItems="center" spacing="0.4rem">
        {!loading && sortedUsers.map((u, index) => (
          <ChatMember
            key={u._id}
            user={u}
            added={chat.members.includes(u._id)}
            onToggle={() => onToggleMember(u)}
            disabled={updating || u._id === user?._id}
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
