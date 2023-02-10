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
  owner: string;
  title: string;
  iconURL: string;
  lastMessage: Message | null; // only populated on client side
  encrypted: boolean;
  password: string | null;
  members: string[];
}

export enum MessageType {
  USER,
  SYSTEM,

  // Client side only
  PENDING,
  ERROR
}

export const isClientSide = (type: MessageType) => {
  return type === MessageType.PENDING || type === MessageType.ERROR;
}

export interface Message {
  clientSideId?: string;
  _id?: string;
  type: MessageType;
  author?: string;
  chat: string;
  content: string;
  createdAt: number;
}

export interface ChatMessages {
  chat: string;
  messages: Message[];
  hasFirstMessage?: boolean;
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

  // Message
  MESSAGE_CREATE = 'messageCreate',
  GET_MESSAGES = 'getMessages',
}

export interface CacheUpdate {
  chats?: Chat[];
  users?: User[];
  messages?: Message[];
}
