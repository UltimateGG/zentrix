export default interface User {
  _id: string;
  googleId: string;
  email: string;
  iconURL: string;
  displayName: string;
  lastChat: string | null;
  lastScreen: string | null;
}

export default interface Chat {
  _id: string;
  title: string;
  iconURL: string;
  lastMessage: string | null;
  encrypted: boolean;
  password: string | null;
  participants: string[];
}
