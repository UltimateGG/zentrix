import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Message, MessageType, SocketEvent } from '../api/apiTypes';
import { emitWithRes } from '../api/websocket';
import ChatMessage from '../components/chat/ChatMessage';
import ChatSettingsDrawer from '../components/chat/ChatSettingsDrawer';
import MessageBar from '../components/chat/MessageBar';
import Image from '../components/Image';
import useAuth from '../contexts/AuthContext';
import useDataCache from '../contexts/DataCacheContext';
import { Box, Icon, IconEnum, Progress, ThemeContext } from '../Jet';


const TitleStyle = styled.h4`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 7.6rem);
`;

const ChatPage = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const { chats, messages, addMessage, loading } = useDataCache();
  const [index, setIndex] = React.useState<number>(chats.findIndex(chat => chat._id === chatId));
  const [settingsDrawerOpen, setSettingsDrawerOpen] = React.useState(false);
  const [messageBarHeight, setMessageBarHeight] = React.useState(4);
  const [scrolledToBottom, setScrolledToBottom] = React.useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    if (!user || loading) return;

    const index = chats.findIndex(chat => chat._id === chatId);
    setIndex(index);

    if (index !== -1) return;
    navigate('/chats');
  }, [user, loading, chatId, chats, navigate]);

  const onSend = async (string: string) => {
    if (!user || !chat) return;

    const message: Message = {
      _id: Math.random().toString(36) + Date.now().toString(36),
      type: MessageType.PENDING,
      chat: chat._id,
      content: string,
      createdAt: Date.now(),
    };

    addMessage({ ...message, type: MessageType.PENDING });
    await emitWithRes(SocketEvent.MESSAGE_CREATE, message).catch(e => {
      addMessage({
        _id: Math.random().toString(36) + Date.now().toString(36),
        type: MessageType.ERROR,
        chat: chat._id,
        content: `Failed to send message: ${e.message}`,
        createdAt: Date.now()
      } as Message);
    });
  }

  useEffect(() => {
    if (!scrolledToBottom) return;
    const element = document.getElementById('messages-container');
    if (!element) return;

    element.scroll({ top: element.scrollHeight });
  }, [scrolledToBottom, messageBarHeight, messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const element = e.currentTarget;
    if (element.scrollTop === 0) {
      console.log('load more'); // TODO
      return;
    }

    const tolerance = 15; // px
    const scrolledToBottom = element.scrollHeight - element.scrollTop - element.clientHeight < tolerance;
    setScrolledToBottom(scrolledToBottom);
  }

  const chat = chats[index];
  if (!user || !chat || loading)
    return (
      <Box justifyContent="center" alignItems="center" style={{ marginTop: '4rem' }}>
        <Progress circular indeterminate />
      </Box>
    );

  const chatMessages = messages.find(m => m.chat === chat._id);
  return (
    <>
      <Box alignItems="center" style={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: '3.6rem',
        padding: '1rem 0.2rem',
        backgroundColor: theme.colors.background[1]
      }}>
        <Icon icon={IconEnum.left} style={{ cursor: 'pointer', marginRight: '0.2rem' }} size={32} onClick={() => navigate('/chats')} />
        <Image src={chat.iconURL} alt="chat" style={{ width: '2.2rem', height: '2.2rem', borderRadius: '50%', marginRight: '0.8rem' }} />
        <TitleStyle style={{ margin: 0 }}>{chat.title}</TitleStyle>
        
        <Icon icon={IconEnum.menu} style={{ cursor: 'pointer', marginLeft: 'auto', marginRight: '0.4rem' }} size={32} onClick={() => setSettingsDrawerOpen(true)} />
      </Box>

      <Box
        flexDirection="column"
        id="messages-container"
        onScroll={handleScroll}
        style={{
          overflowY: 'auto',
          height: '100%',
          maxHeight: `calc(100vh - 3.6rem - ${messageBarHeight}rem)`,
          scrollBehavior: 'auto',
        }}
      >
        {chatMessages && chatMessages.messages.map((message, i) => (
          <ChatMessage key={i} message={message} />
        ))}
      </Box>

      <MessageBar onSend={onSend} onResize={height => setMessageBarHeight(height)} />

      <ChatSettingsDrawer open={settingsDrawerOpen} onClose={() => setSettingsDrawerOpen(false)} chat={chat} />      
    </>
  );
}

export default ChatPage;

