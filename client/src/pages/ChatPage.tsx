import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Message, MessageType, SocketEvent } from '../api/apiTypes';
import { emit } from '../api/websocket';
import Avatar from '../components/Avatar';
import ChatMessage from '../components/chat/ChatMessage';
import ChatSettingsDrawer from '../components/chat/ChatSettingsDrawer';
import MessageBar from '../components/chat/MessageBar';
import StatusBar from '../components/StatusBar';
import useAuth from '../contexts/AuthContext';
import useDataCache from '../contexts/DataCacheContext';
import { Box, Icon, IconEnum, Progress, theme } from '../Jet';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import ContextMenu from '../components/chat/ContextMenu';
import useNav, { Page } from '../contexts/NavigationContext';


const TitleStyle = styled.h4`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 7.6rem);
`;

const ChatPage = () => {
  const { navigate, currentChat, setCurrentChat } = useNav();
  const { user } = useAuth();
  const { chats, messages, addMessage, removeMessage, foundFirstMessage, safeArea } = useDataCache();
  const [index, setIndex] = useState<number>(chats.findIndex(chat => chat._id === currentChat));
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [messageBarHeight, setMessageBarHeight] = useState(4);
  const [scrolledToBottom, setScrolledToBottom] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [contextMenu, setContextMenu] = useState<Message | null>(null);


  useEffect(() => {
    if (!user) return;

    const index = chats.findIndex(chat => chat._id === currentChat);
    setIndex(index);
    if (index === -1) navigate(Page.CHAT_LIST);
  }, [user, currentChat, chats, navigate]);

  const onSend = async (string: string) => {
    if (!user || !chat) return;

    const message: Message = {
      _id: Math.random().toString(36) + Date.now().toString(36),
      type: MessageType.PENDING,
      chat: chat._id,
      author: user._id,
      content: string,
      createdAt: Date.now(),
    };

    addMessage({ ...message, type: MessageType.PENDING });
    await emit(SocketEvent.MESSAGE_CREATE, message).catch(e => {
      if (e.message === 'Request timed out') return;
      removeMessage(message); // remove pending message
      addMessage({
        _id: Math.random().toString(36) + Date.now().toString(36),
        type: MessageType.SYSTEM,
        chat: chat._id,
        content: `Could not send message. ${e.message}`,
        createdAt: Date.now(),
        error: true,
        isClientSideOnly: true
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
    const chatMessages = messages.find(m => m.chat === chat._id);
    const hasFirstMessage = chatMessages?.hasFirstMessage;
    if (element.scrollTop === 0 && !hasFirstMessage) loadMoreMessages();

    const tolerance = 15; // px
    const scrolledToBottom = element.scrollHeight - element.scrollTop - element.clientHeight < tolerance;
    setScrolledToBottom(scrolledToBottom);
  }

  const loadMoreMessages = async () => {
    if (loadingMore) return;
    setLoadingMore(true); // find first msg that isnt client side
    const firstMsg = messages.find(m => m.chat === chat._id)?.messages.find(m => !m.isClientSideOnly);
    
    const res = await emit(SocketEvent.GET_MESSAGES, { chat: chat._id, before: firstMsg?.createdAt || Date.now() }).catch(e => {});

    if (res && res.end) foundFirstMessage(chat);
    setLoadingMore(false);
  }

  const handleClose = () => {
    navigate(Page.CHAT_LIST);
    setCurrentChat(null);
  }

  const chat = chats[index];
  if (!user || !chat)
    return (
      <Box justifyContent="center" alignItems="center" style={{ marginTop: '6rem' }}>
        <Progress circular indeterminate />
      </Box>
    );

  const chatMessages = messages.find(m => m.chat === chat._id);
  const hasFirstMessage = chatMessages?.hasFirstMessage;
  if ((!chatMessages || !chatMessages.messages.length) && !hasFirstMessage) loadMoreMessages();

  const safeAreaTop = safeArea?.insets.top || 0;

  return (
    <>
      <StatusBar color={theme.colors.background[1]} />
      <Box alignItems="center" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: `calc(3.2rem + ${safeAreaTop}px)`,
        padding: '0.2rem',
        paddingTop: safeAreaTop === 0 ? '0.2' : safeAreaTop,
        backgroundColor: theme.colors.background[1]
      }}>
        <Icon icon={IconEnum.left} style={{ cursor: 'pointer', marginRight: '0.2rem' }} size={32} onClick={handleClose} />
        <Avatar src={chat.iconURL} size={2.2} mr={0.8} />
        <TitleStyle style={{ margin: 0 }}>{chat.title}</TitleStyle>
        
        <Icon icon={IconEnum.menu} style={{ cursor: 'pointer', marginLeft: 'auto', marginRight: '0.4rem' }} size={32} onClick={() => setSettingsDrawerOpen(true)} />
      </Box>
      <div style={{ height: `calc(3.2rem + ${safeAreaTop}px` }} />

      <Box
        flexDirection="column"
        id="messages-container"
        onScroll={handleScroll}
        style={{
          overflowY: 'auto',
          height: '100%',
          maxHeight: `calc(100% - 3.2rem - ${messageBarHeight}rem - ${safeArea?.insets.bottom || 0}px - ${safeAreaTop}px)`,
          scrollBehavior: 'auto',
        }}
      >
        {hasFirstMessage && (
          <Box justifyContent="center" alignItems="center" style={{ marginTop: '1rem' }}>
            <small>This is the beginning of the chat</small>
          </Box>
        )}

        {loadingMore && (
          <Box justifyContent="center" alignItems="center" style={{ marginTop: '1rem' }}>
            <Progress circular indeterminate />
          </Box>
        )}
        {chatMessages && chatMessages.messages.map((message, i) => (
          <React.Fragment key={i}>
            <ChatMessage
              message={message}
              shouldStack={i !== 0 &&
                chatMessages.messages[i - 1].author === message.author
                && message.createdAt - chatMessages.messages[i - 1].createdAt < 60_000 * 5
              }
              onContextMenu={() => {
                Haptics.impact({ style: ImpactStyle.Light });
                setContextMenu(message);
              }}
            />
            {i === chatMessages.messages.length - 1 && (<div style={{ paddingTop: '2rem' }} />)}
          </React.Fragment>
        ))}
      </Box>

      <MessageBar onSend={onSend} onResize={height => setMessageBarHeight(height)} />

      <ContextMenu message={contextMenu} canDelete={contextMenu ? contextMenu.author === user._id : false} onClose={() => setContextMenu(null)} />
      <ChatSettingsDrawer open={settingsDrawerOpen} onClose={() => setSettingsDrawerOpen(false)} chat={chat} />
    </>
  );
}

export default ChatPage;

