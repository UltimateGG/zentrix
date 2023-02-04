import React from 'react';
import ZentrixChat from '../api/ZentrixChat';


const ChatEntry = ({ chat }: { chat: ZentrixChat }) => {
  return (
    <div>
      {chat.title}
    </div>
  );
}

export default ChatEntry;
