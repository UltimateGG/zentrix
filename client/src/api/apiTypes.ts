export interface User {
  _id: string;
  googleId: string;
  email: string;
  iconURL: string;
  displayName: string;
  lastChat: string | null;
  lastScreen: string | null;
}

export interface Chat {
  _id: string;
  title: string;
  iconURL: string;
  lastMessage: string | null;
  encrypted: boolean;
  password: string | null;
  participants: string[];
}

export enum SocketEvent {
  CONNECT = 'connect', // Inbound only

  ACK = 'ack',

  CACHE_POPULATE = 'cachePopulate',
  CACHE_UPDATE = 'cacheUpdate',

  // User
  SET_DISPLAY_NAME = 'setDisplayName',
  SET_LAST_SCREEN = 'setLastScreen',
  SET_LAST_CHAT = 'setLastChat',

  // Chat
  CREATE_CHAT = 'createChat',
  UPDATE_CHAT = 'updateChat',
}

export interface CacheUpdate {
  chats?: Chat[];
}
