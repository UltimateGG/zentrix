export default class Chat {
  id: string;
  title: string;
  iconURL: string;
  lastMessage: string | null;
  encrypted: boolean;
  password: string | null;
  participants: string[];


  private constructor() {
    this.id = '';
    this.title = '';
    this.iconURL = '';
    this.lastMessage = null;
    this.encrypted = false;
    this.password = null;
    this.participants = [];
  }

  public static getRandomIconURL(): string {
    const max = 5;
    const num = Math.floor(Math.random() * max) + 1;

    return ''; // todo
  }

  public static async create(title: string, encrypted: boolean, password: string | null, participants: string[]): Promise<Chat> {
    return new Promise<Chat>(async (resolve, reject) => {
      const chat = {
        title,
        iconURL: Chat.getRandomIconURL(),
        lastMessage: null,
        encrypted,
        password: encrypted ? password : null,
        participants
      };
      

      const newChat = new Chat();
      resolve(newChat);
    });
  }
}
