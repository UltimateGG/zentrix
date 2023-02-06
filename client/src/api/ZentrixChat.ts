import { DatabaseReference, get, push, ref, update } from "firebase/database";
import { db, getStaticResourceURL } from "./firebase";



export default class ZentrixChat {
  id: string;
  title: string;
  iconURL: string;
  lastMessage: string | null;
  encrypted: boolean;
  password: string | null;
  participants: string[];
  dbRef: DatabaseReference;
  unsubscribe: (() => void) | undefined;


  private constructor(id: string) {
    this.id = id;
    this.title = '';
    this.iconURL = '';
    this.lastMessage = null;
    this.encrypted = false;
    this.password = null;
    this.participants = [];
    this.dbRef = ref(db, `chats/${id}`);
  }

  private async loadFromDB() {
    return new Promise<void>(async (resolve, reject) => {
      const snapshot = await get(this.dbRef).catch(reject);
      if (!snapshot) return;
  
      if (snapshot.exists()) {
        const data = snapshot.val(); // If the user already exists, use the data from the database
        if (data !== null) this.update(data);

        resolve();
        return;
      }

      resolve();
    }).catch((err) => {
      console.error(err);
    });
  }

  public static async getChat(id: string) {
    const newChat = new ZentrixChat(id);
    await newChat.loadFromDB();
    return newChat;
  }

  public static async create(title: string, encrypted: boolean, password: string | null, participants: string[]): Promise<ZentrixChat> {
    return new Promise<ZentrixChat>(async (resolve, reject) => {
      const chat = {
        title,
        iconURL: ZentrixChat.getRandomIconURL(),
        lastMessage: null,
        encrypted,
        password: encrypted ? password : null,
        participants
      };
      
      const newChatRef = await push(ref(db, 'chats'), chat);

      // resolve participants and add chat to their list of chats
      for (const participant of participants) {
        const participantRef = ref(db, `users/${participant}`);
        const participantData = await get(participantRef);

        if (!participantData.exists()) continue;
        const chats = participantData.val().chats || [];
        if (!chats || !Array.isArray(chats) || chats.length > 100) continue;
        chats.push(newChatRef.key);

        await update(participantRef, { chats });
      }

      const newChat = new ZentrixChat(newChatRef.key || '');
      newChat.update(chat);
      resolve(newChat);
    });
  }

  public static getRandomIconURL(): string {
    const max = 5;
    const num = Math.floor(Math.random() * max) + 1;

    return getStaticResourceURL(`chats/icon${num}.png`);
  }

  public update(data: any) {
    this.title = data.title;
    this.iconURL = data.iconURL;
    this.lastMessage = data.lastMessage;
    this.encrypted = data.encrypted;
    this.password = data.password;
    this.participants = data.participants;
  }
}
