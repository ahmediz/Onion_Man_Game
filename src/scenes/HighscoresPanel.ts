import { IUser } from "~/models/IUser.model";

export default class HighscoresPanel {
  private scene!: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, users: IUser[], highScoresPanel?: any) {
    this.scene = scene;
    this.scene.physics.pause();

    if (highScoresPanel?.container) {
      highScoresPanel.container.destroy(true);
      this.scene.physics.resume();
      return;
    }

    const { width, height } = this.scene.scale;
    this.container = this.scene.add.container(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY
    );

    const bg = this.scene.add.rectangle(0, 0, width / 2, height / 2, 0x000000);

    this.container.add(bg);

    users.forEach((user: IUser, index: number) => {
      const rowContainer = this.scene.add.container(-width / 4, -height / 4);
      const rowY = index > 0 ? 56 * index : 0;
      this.scene.load.image(user.name, `${user.image}.png`);

      const userimage = this.scene.add
        .image(-(bg.width / 2), -(bg.height / 2), user.name)
        .setOrigin(0, 0);
      userimage.width = 50;
      userimage.height = 50;

      const username = this.scene.add
        .text(0, rowY, user.name, {
          color: "white",
        })
        .setPadding(20);

      const score = this.scene.add
        .text(bg.width, rowY, String(user.highScore), {
          color: "white",
        })
        .setPadding(20)
        .setOrigin(1, 0);

      rowContainer.add(username);
      rowContainer.add(score);

      this.container.add(rowContainer);
    });
  }
}
