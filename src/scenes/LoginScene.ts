import {
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { IUser } from "~/models/IUser.model";

export default class LoginScene extends Phaser.Scene {
  user: IUser;
  db = getFirestore();
  constructor() {
    super("login");
  }

  init(data) {}

  preload() {}

  create() {
    const loginButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 35,
        "Login",
        {
          backgroundColor: "#45ccf8",
          fontSize: "32px",
          color: "#000",
          padding: {
            x: 20,
            y: 10,
          },
        }
      )
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5, 0);
    loginButton.on("pointerdown", () => {
      this.login();
    });
    loginButton.on("pointerover", () =>
      loginButton.setStyle({ backgroundColor: "#45ccf8" })
    );
    loginButton.on("pointerout", () =>
      loginButton.setStyle({ backgroundColor: "#3aadd2" })
    );

    const continueAsGuestButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 35,
        "Continue as Guest",
        {
          backgroundColor: "#45ccf8",
          fontSize: "32px",
          color: "#000",
          padding: {
            x: 20,
            y: 10,
          },
        }
      )
      .setOrigin(0.5, 0);
    continueAsGuestButton.setInteractive({ useHandCursor: true });
    continueAsGuestButton.on("pointerdown", () => {
      const auth = getAuth();
      signInAnonymously(auth).then(() => {
        this.create();
        const user = auth.currentUser;
        this.scene.start("game");

        deleteUser(user!).then(() => {
          // console.log("deleted");
        });
      });
    });
    continueAsGuestButton.on("pointerover", () =>
      continueAsGuestButton.setStyle({ backgroundColor: "#45ccf8" })
    );
    continueAsGuestButton.on("pointerout", () =>
      continueAsGuestButton.setStyle({ backgroundColor: "#3aadd2" })
    );
  }

  update() {}

  private login() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        // The signed-in user info.
        const user = result.user;
        this.setUser(user);

        // check if already saved before
        const docRef = doc(this.db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Updating user info
          await updateDoc(doc(this.db, "users", this.user!.id), {
            ...this.user,
          });
        } else {
          // Save new user
          await setDoc(doc(this.db, "users", this.user!.id), {
            ...this.user,
          });
        }
        this.scene.start("game", { user: this.user });
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  private setUser(user: User) {
    this.user = {
      id: user.uid,
      name: user.displayName!,
      image: user.photoURL!,
      email: user.email!,
    };
  }
}
