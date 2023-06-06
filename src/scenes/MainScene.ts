import Phaser, { Physics } from "phaser";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  User,
  getAuth,
  signInWithPopup,
  signInAnonymously,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  getFirestore,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { ONION_MAN_TOKEN, ONION_MAN_USER } from "~/constants";
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
  platforms?: Phaser.Physics.Arcade.StaticGroup;
  player: Phaser.Physics.Arcade.Sprite;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  stars?: Phaser.Physics.Arcade.Group;
  bombs?: Phaser.Physics.Arcade.Group;
  score = 0;
  scoreText: Phaser.GameObjects.Text;
  gameOver?: boolean;
  playerCollider: Physics.Arcade.Collider;
  windowWidth: number;
  windowHeight: number;
  isLoggedIn: boolean;
  user: IUser;
  db = getFirestore(app);
  constructor() {
    super();
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  async create() {
    const user = await this.isUserAuthenticated();

    if (user) {
      const docRef = doc(this.db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.user = docSnap.data() as IUser;
      }
    }

    if (!this.user) {
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
      return;
    }

    // Defining window width and height
    this.windowWidth = this.cameras.main?.width;
    this.windowHeight = this.cameras.main?.height;

    // Platform
    this.add.tileSprite(
      0,
      0,
      this.windowWidth * 2,
      this.windowHeight * 2,
      "sky"
    );

    // Displaying user name
    this.displayUserInfo();

    this.platforms = this.physics.add.staticGroup();
    this.platforms
      .create(0, this.windowHeight - 30, "ground")
      .setScale(7, 2)
      .refreshBody();
    this.platforms.create(0, this.windowHeight / 4, "ground");
    this.platforms.create(0, this.windowHeight / 2, "ground");
    this.platforms.create(
      this.windowWidth / 2,
      this.windowHeight / 2 + 50,
      "ground"
    );
    this.platforms.create(
      this.windowWidth * 0.9,
      this.windowHeight / 6,
      "ground"
    );

    // Player
    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Defining Player Animations
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // Set Gravity and Collision for Player
    this.player.setGravityY(300);
    this.playerCollider = this.physics.add.collider(
      this.player,
      this.platforms
    );

    // Defining Cursors
    this.cursors = this.input.keyboard?.createCursorKeys();

    // Defining Stars
    this.stars = this.physics.add.group({
      key: "star",
      repeat: this.windowWidth / 70,
      setXY: { x: 12, y: 0, stepX: this.windowWidth / (this.windowWidth / 70) },
    });

    this.stars.children.iterate((c) => {
      const child = c as Phaser.Physics.Arcade.Image;
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      return true;
    });

    // Set Collision for Stars
    this.physics.add.collider(this.stars, this.platforms);

    // Player and Stars overlapping
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.handleCollectStar,
      undefined,
      this
    );

    // Defining Score Text
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "28px",
      color: "#000",
    });

    // Defining Bombs
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(
      this.bombs,
      this.player,
      this.handleBombHit,
      undefined,
      this
    );
  }

  update() {
    // Left & Right
    if (this.cursors?.left.isDown && !this.gameOver) {
      this.player?.setVelocityX(-160);
      this.player?.anims.play("left", true);
    } else if (this.cursors?.right.isDown && !this.gameOver) {
      this.player?.setVelocityX(160);
      this.player?.anims.play("right", true);
    } else {
      this.player?.setVelocityX(0);
      this.player?.anims.play("turn");
    }

    // Jumping
    if (
      this.cursors?.up.isDown &&
      this.player?.body?.touching.down &&
      !this.gameOver
    ) {
      this.player.setVelocityY(-this.windowHeight * 0.8);
    }
  }

  private goLeft(): void {
    this.player?.setVelocityX(-160);
    this.player?.anims.play("left", true);
  }
  private goRight(): void {
    this.player?.setVelocityX(-160);
    this.player?.anims.play("left", true);
  }
  private jumb(): void {
    this.player.setVelocityY(-this.windowHeight * 0.8);
  }

  private handleCollectStar(
    player:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    s: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): any {
    const star = s as Physics.Arcade.Image;

    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.stars?.countActive() === 0) {
      this.stars.children.iterate((c) => {
        const child = c as Phaser.Physics.Arcade.Image;
        child.enableBody(true, child.x, 0, true, true);
      });
    }

    const x =
      this.player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    const bomb = this.bombs?.create(
      x,
      16,
      "bomb"
    ) as Phaser.Physics.Arcade.Image;
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }

  private async handleBombHit(
    player:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    s: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): Promise<any> {
    // this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");
    this.physics.world.removeCollider(this.playerCollider);
    this.player.setCollideWorldBounds(false);
    this.gameOver = true;

    // Saving Score of user and add it to scores collection
    const scoreDoc = doc(this.db, "users", this.user!.id);

    await updateDoc(scoreDoc, {
      latestScore: this.score,
      highScore: Math.max(this.score, +this.user?.highScore!),
    });
    setTimeout(() => {
      window.location.href = "";
    }, 3000);
  }

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
        await setDoc(doc(this.db, "users", this.user!.id), {
          ...this.user,
        });

        this.create();
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
  private displayUserInfo() {
    this.add
      .text(this.cameras.main.centerX, 16, this.user?.name || "Guest", {
        fontSize: "28px",
        color: "#000",
      })
      .setOrigin(0.5, 0);

    if (this.user?.latestScore) {
      this.add
        .text(this.windowWidth - 16, 16, `${String(this.user?.highScore)}`, {
          fontSize: "28px",
          color: "#000",
        })
        .setOrigin(1, 0);
    }
  }

  private isUserAuthenticated(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      getAuth().onAuthStateChanged((user) => {
        resolve(user);
      }, reject);
    });
  }

  private showHighScore() {}
  private setUser(user: User) {
    this.user = {
      id: user.uid,
      name: user.displayName!,
      image: user.photoURL!,
      email: user.email!,
      latestScore: 0,
      highScore: 0,
    };
  }
}
