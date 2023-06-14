export default class LoadingScene extends Phaser.Scene {
  windowWidth: number;
  windowHeight: number;
  constructor() {
    super("loading");
  }

  init(data) {}

  preload() {
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

    this.load.spritesheet({
      key: "logo",
      url: "assets/dude.png",
      frameConfig: {
        frameWidth: 32,
        frameHeight: 48,
      },
    });
    for (let i = 0; i < 500; i++) {
      this.load.image("logo" + i, "assets/dude.png");
    }
  }

  create() {
    const logo = this.add.sprite(
      this.windowWidth / 2,
      this.windowHeight / 2,
      "logo",
      4
    );
    this.scene.start("main");
  }

  update() {}
}
