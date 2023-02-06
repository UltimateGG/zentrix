export default class User {
  id: string;
  email: string;
  iconURL: string;
  displayName: string;
  lastChat: string | null;
  lastScreen: string | null;
  chats: string[];


  private constructor() {
    this.id = '';
    this.email = '';
    this.iconURL = '';
    this.displayName = '';
    this.lastChat = null;
    this.lastScreen = null;
    this.chats = [];
  }

  public async setIconURL(iconURL: string) {
    this.iconURL = iconURL;
    // await update(this.dbRef, { iconURL });
  }

  public async setDisplayName(displayName: string) {
    this.displayName = displayName;
    // await update(this.dbRef, { displayName });
  }

  public async setLastChat(lastChat: string | null) {
    this.lastChat = lastChat;
    // await update(this.dbRef, { lastChat });
  }

  public async setLastScreen(lastScreen: string | null) {
    this.lastScreen = lastScreen;
    // await update(this.dbRef, { lastScreen });
  }
}
