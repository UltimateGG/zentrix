import { User } from 'firebase/auth';
import { child, DatabaseReference, get, ref, set, update } from 'firebase/database';
import { db } from './firebase';


export default class ZentrixUser {
  id: string;
  iconURL: string;
  displayName: string;
  lastChat: string | null;
  chats: string[];
  firebaseUser: User;
  dbRef: DatabaseReference;


  private constructor(firebaseUser: User) {
    this.id = firebaseUser.uid;
    this.iconURL = '';
    this.displayName = '';
    this.lastChat = null;
    this.chats = [];
    this.firebaseUser = firebaseUser;
    this.dbRef = child(ref(db, 'users'), this.id);
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
      
      // Create a new user
      const userData = await ZentrixUser.createNewUser(this.firebaseUser);
      this.update(userData);

      resolve();
    }).catch((err) => {
      console.error(err);
    });
  }

  public static async getUser(firebaseUser: User) {
    const newUser = new ZentrixUser(firebaseUser);
    await newUser.loadFromDB();
    return newUser;
  }

  private static async createNewUser(firebaseUser: User) {
    let displayName = firebaseUser.displayName;
    if (!displayName || displayName.length < 3)
      displayName = firebaseUser.uid;

    if (displayName.length > 20)
      displayName = displayName.substring(0, 20);

    const newUser = {
      iconURL: firebaseUser.photoURL || this.getRandomProfilePicture(),
      displayName,
      lastChat: null,
      chats: []
    };

    await set(child(ref(db, 'users'), firebaseUser.uid), newUser);
    return newUser;
  }

  public static getRandomProfilePicture(): string {
    const defaultProfilePictures = [
      'https://i.imgur.com/7bKLXsh.png',
      'https://i.imgur.com/XSLGxVM.png',
      'https://i.imgur.com/4CXsECx.png',
      'https://i.imgur.com/BmwfYbV.png',
      'https://i.imgur.com/WTZOiQC.png'
    ];

    const num = Math.floor(Math.random() * defaultProfilePictures.length);
    return defaultProfilePictures[num];
  }


  public async setIconURL(iconURL: string) {
    this.iconURL = iconURL;
    await update(this.dbRef, { iconURL });
  }

  public async setDisplayName(displayName: string) {
    this.displayName = displayName;
    await update(this.dbRef, { displayName });
  }

  public async setLastChat(lastChat: string | null) {
    this.lastChat = lastChat;
    await update(this.dbRef, { lastChat });
  }

  public update(snapshot: any) {
    this.iconURL = snapshot.iconURL;
    this.displayName = snapshot.displayName;
    this.lastChat = snapshot.lastChat;
    this.chats = snapshot.chats;
  }

  public clone() {
    const newUser = new ZentrixUser(this.firebaseUser);

    newUser.update(this);
    return newUser;
  }
}
