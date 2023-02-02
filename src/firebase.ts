import Firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


// Initialize Firebase
const app = Firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId:  process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
});

const auth = Firebase.auth();
const db = Firebase.database();

export {
  app,
  auth,
  db
};
