import Phaser, { Physics } from "phaser";

import {
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

import { IUser } from "~/models/IUser.model";
import HighscoresPanel from "./HighscoresPanel";

export default class GameScene extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticGroup;
  player: Phaser.Physics.Arcade.Sprite;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  stars?: Phaser.Physics.Arcade.Group;
  bombs?: Phaser.Physics.Arcade.Group;
  score = 0;
  scoreText: Phaser.GameObjects.Text;
  gameOver?: boolean;
  playerColliderWithPlatforms: Physics.Arcade.Collider;
  playerColliderWithBombs: Physics.Arcade.Collider;
  windowWidth: number;
  windowHeight: number;
  isLoggedIn: boolean;
  user: IUser;
  users: IUser[] = [];
  db = getFirestore();
  highScoresPanel: any;
  goRightButton: Phaser.GameObjects.Rectangle;
  goRightButtonIsDown: boolean;
  goLeftButton: Phaser.GameObjects.Rectangle;
  goLeftButtonIsDown: boolean;
  goUpButton: Phaser.GameObjects.Image;
  goUpButtonIsDown: boolean;
  constructor() {
    super("game");
  }

  init(data) {
    const { user } = data;
    this.user = user;
  }

  preload() {
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.image("sky", "assets/sky.png");

    // Loading
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(
      this.scale.width / 2 - 160,
      this.scale.height / 2 - 25,
      320,
      50
    );

    this.windowWidth = this.cameras.main.width;
    this.windowHeight = this.cameras.main.height;
    const loadingText = this.make.text({
      x: this.windowWidth / 2,
      y: this.windowHeight / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        color: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: this.windowWidth / 2,
      y: this.windowHeight / 2,
      text: "0%",
      style: {
        font: "18px monospace",
        color: "#ffffff",
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: this.windowWidth / 2,
      y: this.windowHeight / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        color: "#ffffff",
      },
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", (value) => {
      percentText.setText(Math.round(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        this.scale.width / 2 - 160 + 10,
        this.scale.height / 2 - 25 + 10,
        300 * value,
        30
      );
    });

    this.load.on("fileprogress", function (file) {
      assetText.setText("Loading asset: " + file.key);
    });

    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }

  create() {
    // Getting all users
    this.getUsers();

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

    // Showing highscores button
    if (this.user) {
      const highScoreButton = this.add
        .text(this.windowWidth - 16, 16, "Highscore", {
          fontSize: "28px",
          color: "#000",
        })
        .setOrigin(1, 0)
        .setInteractive({ useHandCursor: true });
      highScoreButton.on("pointerdown", () => {
        this.showHighScore();
      });
    }

    this.platforms = this.physics.add.staticGroup();
    this.platforms
      .create(0, this.windowHeight - 30, "ground")
      .setScale(7, 4)
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
    this.playerColliderWithPlatforms = this.physics.add.collider(
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
    this.playerColliderWithBombs = this.physics.add.collider(
      this.bombs,
      this.player,
      this.handleBombHit,
      undefined,
      this
    );

    // Creating direction buttons for touch devices only
    if (!this.sys.game.device.os.desktop) {
      //* Right
      this.goRightButton = this.add
        .rectangle(
          this.windowWidth,
          0,
          this.windowWidth / 2,
          this.windowHeight,
          0x000000,
          0
        )
        .setOrigin(1, 0)
        .setInteractive({ useHandCursor: true });
      this.goRightButton.on("pointerdown", () => {
        this.goRightButtonIsDown = true;
        this.goLeftButtonIsDown = false;
        this.goUpButtonIsDown = false;
      });
      this.goRightButton.on("pointerup", () => {
        this.goRightButtonIsDown = false;
      });

      //* Left
      this.goLeftButton = this.add
        .rectangle(0, 0, this.windowWidth / 2, this.windowHeight, 0x000000, 0)
        .setOrigin(0, 0)
        .setInteractive({ useHandCursor: true });
      this.goLeftButton.on("pointerdown", () => {
        this.goLeftButtonIsDown = true;
        this.goRightButtonIsDown = false;
        this.goUpButtonIsDown = false;
      });
      this.goLeftButton.on("pointerup", () => {
        this.goLeftButtonIsDown = false;
      });
    }

    // this.scale.on("orientationchange", (orientation) => {
    //   if (orientation === Phaser.Scale.PORTRAIT) {
    //     console.log("portrait");
    //     this.scale.resize(this.windowWidth, (this.windowHeight * 9) / 16);
    //   } else if (orientation === Phaser.Scale.LANDSCAPE) {
    //     console.log("landscape");
    //     this.scale.resize(this.windowWidth, this.windowHeight);
    //   }
    // });

    this.game.events.on("swipe", (dir) => {
      // 'up', 'right', 'down' or 'left'
      if (dir === "up") {
        this.goUpButtonIsDown = true;
        this.goRightButtonIsDown = false;
        this.goLeftButtonIsDown = false;
        setTimeout(() => {
          this.goUpButtonIsDown = false;
        }, 100);
      }
    });
  }

  update() {
    // Left & Right
    if (
      (this.cursors?.left.isDown || this.goLeftButtonIsDown) &&
      !this.gameOver
    ) {
      this.player?.setVelocityX(-160);
      this.player?.anims.play("left", true);
    } else if (
      (this.cursors?.right.isDown || this.goRightButtonIsDown) &&
      !this.gameOver
    ) {
      this.player?.setVelocityX(160);
      this.player?.anims.play("right", true);
    } else {
      this.player?.setVelocityX(0);
      this.player?.anims.play("turn");
    }

    // Jumping
    if (
      (this.cursors?.up.isDown || this.goUpButtonIsDown) &&
      this.player?.body?.touching.down &&
      !this.gameOver
    ) {
      this.player.setVelocityY(-this.windowHeight * 0.8);
    }
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
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");
    this.physics.world.removeCollider(this.playerColliderWithPlatforms);
    this.physics.world.removeCollider(this.playerColliderWithBombs);
    this.player.setCollideWorldBounds(false);
    this.gameOver = true;

    // Saving Score of user and add it to scores collection
    if (this.user) {
      const scoreDoc = doc(this.db, "users", this.user!.id);
      await updateDoc(scoreDoc, {
        latestScore: this.score,
        highScore: Math.max(this.score, +this.user?.highScore! || 0),
      });
    }
    setTimeout(() => {
      this.tryAgain();
    }, 3000);
  }

  private displayUserInfo() {
    this.add
      .text(this.cameras.main.centerX, 16, this.user?.name || "Guest", {
        fontSize: "28px",
        color: "#000",
      })
      .setOrigin(0.5, 0);

    // if (this.user?.latestScore) {
    //   this.add
    //     .text(this.windowWidth - 16, 16, `${String(this.user?.highScore)}`, {
    //       fontSize: "28px",
    //       color: "#000",
    //     })
    //     .setOrigin(1, 0);
    // }
  }

  private showHighScore() {
    this.highScoresPanel = new HighscoresPanel(
      this,
      this.users,
      this.highScoresPanel
    );
  }

  private async getUsers() {
    this.users = [];
    const querySnapshot = await getDocs(collection(this.db, "users"));
    querySnapshot.forEach((doc) => {
      const user = doc.data() as IUser;
      this.users.push(user);
    });
  }

  private tryAgain(): void {
    this.gameOver = false;
    this.score = 0;
    this.scene.restart();
  }
}
