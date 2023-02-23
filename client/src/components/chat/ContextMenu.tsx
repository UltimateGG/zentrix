import React, { useState } from 'react';
import styled from 'styled-components';
import { Message, SocketEvent } from '../../api/apiTypes';
import { Box, Icon, IconEnum, theme } from '../../Jet';
import { Clipboard } from '@capacitor/clipboard';
import { emitWithRes } from '../../api/websocket';
import useNotifications from '../../Jet/NotificationContext';


const OverlayStyle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const ContextMenuStyle = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 101;
  background-color: ${theme.colors.background[2]};
  border-top: 2px solid ${theme.colors.background[3]};
  padding-bottom: 4rem;
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
  const [canClose, setCanClose] = useState(false);
  const { addNotification } = useNotifications();
  const open = message !== null;


  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && canClose) {
      onClose();
      setCanClose(false);
    }
  }

  const onDelete = async () => {
    if (!message) return;

    await emitWithRes(SocketEvent.MESSAGE_DELETE, { id: message._id }).catch(e => {
      addNotification({
        variant: 'danger',
        text: e.message || 'Failed to delete message'
      });
    });
  }

  const onAction = (action: string) => {
    if (!canClose) return;

    onClose();
    setCanClose(false);

    switch (action) {
      case 'delete':
        onDelete();
        break;
      case 'copy':
        Clipboard.write({
          string: message?.content || ''
        });
        break;
      default:
        break;
    }
  }

  return !open ? null : (
    <OverlayStyle onMouseUp={() => setCanClose(true)} onClick={onOverlayClick}>
      <ContextMenuStyle flexDirection="column">
        {canDelete && (
          <ContextItemStyle spacing="1rem" onClick={() => onAction('delete')}>
            <Icon icon={IconEnum.trash} size={24} />
            <h5 style={{ margin: 0 }}>Delete</h5>
          </ContextItemStyle>
        )}

        <ContextItemStyle spacing="1rem" onClick={() => onAction('copy')}>
          <Icon icon={IconEnum.copy} size={24} />
          <h5 style={{ margin: 0 }}>Copy</h5>
        </ContextItemStyle>
      </ContextMenuStyle>
    </OverlayStyle>
  );
}

export default ContextMenu;
