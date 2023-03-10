import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Message, MessageType, SocketEvent } from '../../api/apiTypes';
import { Box, Icon, IconEnum, theme } from '../../Jet';
import { Clipboard } from '@capacitor/clipboard';
import { emit } from '../../api/websocket';
import useNotifications from '../../Jet/NotificationContext';
import { Capacitor } from '@capacitor/core';
import useDataCache from '../../contexts/DataCacheContext';


const OverlayStyle = styled.div.attrs((props: ContextMenuProps) => props)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
  transition: opacity 0.2s ease;
`;

const ContextMenuStyle = styled(Box).attrs((props: any) => props)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(${props => props.open ? '0' : '100%'});
  z-index: 101;
  background-color: ${theme.colors.background[2]};
  border-top: 2px solid ${theme.colors.background[3]};
  padding-bottom: 4rem;
  transition: transform 0.2s ease;
  user-select: none;
`;

const ContextItemStyle = styled(Box)`
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;
  align-items: center;
  padding: 1rem;

  &:active {
    background-color: ${theme.colors.background[1]};
  }
`;

interface ContextMenuProps {
  message: Message | null;
  canDelete: boolean;
  onClose: () => any;
}

const ContextMenu = ({ message, canDelete, onClose }: ContextMenuProps) => {
  const [canClose, setCanClose] = useState(Capacitor.getPlatform() === 'web');
  const [animating, setAnimating] = useState(false);
  const [closing, setClosing] = useState(false);
  const { addNotification } = useNotifications();
  const { setEditingMessage } = useDataCache();
  const open = message !== null;


  useEffect(() => {
    if (message !== null) setAnimating(true);
  }, [message]);

  const close = () => {
    if (!canClose) return;

    setAnimating(true);
    setClosing(true);
    setTimeout(() => {
      setAnimating(false);
      setClosing(false);
      onClose();
      setCanClose(Capacitor.getPlatform() === 'web');
    }, 200);
  }

  const onOverlayClick = (e: React.MouseEvent) => {
    if (open && e.target === e.currentTarget && canClose) close();
  }

  const onDelete = () => {
    if (!message) return;

    emit(SocketEvent.MESSAGE_DELETE, { id: message._id }).catch(e => {
      addNotification({
        variant: 'danger',
        text: e.message || 'Failed to delete message'
      });
    });
  }

  const onAction = (action: string) => {
    if (!canClose || !open) return;
    close();

    switch (action) {
      case 'copy':
        Clipboard.write({
          string: message?.content || ''
        });
        break;
      case 'delete':
        onDelete();
        break;
      case 'edit':
        if (message._id) setEditingMessage(message._id);
        break;
      default:
        break;
    }
  }

  return (
    <OverlayStyle
      onMouseUp={() => setCanClose(true)}
      onTouchEnd={() => setCanClose(true)}
      onClick={onOverlayClick}
      message={message}
      style={{
        visibility: animating ? 'visible' : 'hidden',
        pointerEvents: animating ? 'all' : 'none',
        opacity: (open || animating) && !closing ? 1 : 0,
      }}
    >
      <ContextMenuStyle
        flexDirection="column"
        open={(open || animating) && !closing}
      >
        <small style={{ margin: '0.4rem 1rem' }}>{new Date(message?.createdAt || Date.now()).toLocaleString()}</small>

        <ContextItemStyle spacing="1rem" onClick={() => onAction('copy')}>
          <Icon icon={IconEnum.copy} size={24} />
          <h5 style={{ margin: 0 }}>Copy</h5>
        </ContextItemStyle>

        {canDelete && message?.type === MessageType.USER && (
         <>
           <ContextItemStyle spacing="1rem" onClick={() => onAction('delete')}>
              <Icon icon={IconEnum.trash} size={24} />
              <h5 style={{ margin: 0 }}>Delete</h5>
            </ContextItemStyle>

            <ContextItemStyle spacing="1rem" onClick={() => onAction('edit')}>
              <Icon icon={IconEnum.edit} size={24} />
              <h5 style={{ margin: 0 }}>Edit</h5>
            </ContextItemStyle>
         </>
        )}
      </ContextMenuStyle>
    </OverlayStyle>
  );
}

export default ContextMenu;
