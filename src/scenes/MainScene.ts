import Phaser from "phaser";
import { initializeApp } from "firebase/app";
import { User, getAuth } from "firebase/auth";
import { doc, getFirestore, getDoc } from "firebase/firestore";

import { IUser } from "~/models/IUser.model";

const firebaseConfig = {
  apiKey: "AIzaSyCnHktXPVosVCshoHWejNO0keODYvqRtqs",
  authDomain: "onion-man-game.firebaseapp.com",
  projectId: "onion-man-game",
  storageBucket: "onion-man-game.appspot.com",
  messagingSenderId: "184060253688",
  appId: "1:184060253688:web:e594ff832b8bbe24eff20d",
  measurementId: "G-VG0Y82D082",
};

const app = initializeApp(firebaseConfig);

export default class MainScene extends Phaser.Scene {
  user: IUser;
  db = getFirestore(app);
  constructor() {
    super("main");
  }

  preload() {}

  async create() {
    // Checking is user is authenticated
    const user = await this.isUserAuthenticated();

    // Displaying login options if user not authenticated
    if (!user) {
      this.scene.start("login");
      return;
    }

    // Getting user details from users collection
    if (user) {
      const docRef = doc(this.db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.user = docSnap.data() as IUser;
        this.scene.start("game", { user: this.user });
      }
    }
  }

  update() {}

  private isUserAuthenticated(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      getAuth().onAuthStateChanged((user) => {
        resolve(user);
      }, reject);
    });
  }
}
