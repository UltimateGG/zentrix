import { User } from 'firebase/auth';
import { child, DatabaseReference, get, ref, set, update } from 'firebase/database';
import { db, getStaticResourceURL } from './firebase';


export default class ZentrixUser {
  id: string;
  iconURL: string;
  displayName: string;
  lastChat: string | null;
  lastScreen: string | null;
  chats: string[];
  firebaseUser: User;
  dbRef: DatabaseReference;


  private constructor(firebaseUser: User) {
    this.id = firebaseUser.uid;
    this.iconURL = '';
    this.displayName = '';
    this.lastChat = null;
    this.lastScreen = null;
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
      lastScreen: null,
      chats: []
    };

    await set(child(ref(db, 'users'), firebaseUser.uid), newUser);
    return newUser;
  }

  public static getRandomProfilePicture(): string {
    const max = 5;
    const num = Math.floor(Math.random() * max) + 1;

    return getStaticResourceURL(`users/icon${num}.png`);
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

  public async setLastScreen(lastScreen: string | null) {
    this.lastScreen = lastScreen;
    await update(this.dbRef, { lastScreen });
  }

  public update(snapshot: any) {
    this.iconURL = snapshot.iconURL || this.iconURL || ZentrixUser.getRandomProfilePicture();
    this.displayName = snapshot.displayName || this.displayName || this.firebaseUser.uid;
    this.lastChat = snapshot.lastChat || this.lastChat || null;
    this.lastScreen = snapshot.lastScreen || this.lastScreen || null;
    this.chats = snapshot.chats || this.chats || [];
  }

  public clone() {
    const newUser = new ZentrixUser(this.firebaseUser);

    newUser.update(this);
    return newUser;
  }
}
