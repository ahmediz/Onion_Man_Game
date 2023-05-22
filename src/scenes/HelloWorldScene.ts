import Phaser, { Physics } from "phaser";

export default class HelloWorldScene extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticGroup;
  player: Phaser.Physics.Arcade.Sprite;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  stars?: Phaser.Physics.Arcade.Group;
  bombs?: Phaser.Physics.Arcade.Group;
  score = 0;
  scoreText: Phaser.GameObjects.Text;
  gameOver?: boolean;
  playerCollider: Physics.Arcade.Collider;
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

  create() {
    // Platform
    this.add.image(400, 300, "sky");
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
    this.platforms.create(600, 400, "ground");
    this.platforms.create(20, 250, "ground");
    this.platforms.create(750, 220, "ground");

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
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
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
      fontSize: "32px",
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
      this.player.setVelocityY(-500);
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

  private handleBombHit(
    player:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    s: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): any {
    // this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");
    this.physics.world.removeCollider(this.playerCollider);
    this.player.setCollideWorldBounds(false);
    this.gameOver = true;
    setTimeout(() => {
      window.location.href = "";
    }, 5000);
  }
}
