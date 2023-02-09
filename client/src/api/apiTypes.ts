export interface User {
  _id: string;
  googleId: string;
  email: string;
  iconURL: string;
  displayName: string;
  lastChat: string | null;
  lastScreen: string | null;
  loading?: boolean;
}

export interface Chat {
  _id: string;
  title: string;
  iconURL: string;
  lastMessage: string | null;
  encrypted: boolean;
  password: string | null;
  members: string[];
}

export enum SocketEvent {
  _ALL = '_all',
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
  DELETE_CHAT = 'deleteChat',
  CHAT_UPDATE_MEMBERS = 'chatUpdateMembers',
}

export interface CacheUpdate {
  chats?: Chat[];
  deletedChats?: string[];
  users?: User[];
}
