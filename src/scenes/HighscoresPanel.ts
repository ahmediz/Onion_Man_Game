import { IUser } from "~/models/IUser.model";

export default class HighscoresPanel {
  private scene!: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private users: IUser[];

  constructor(scene: Phaser.Scene, users: IUser[], highScoresPanel?: any) {
    const rowHeight = 56.4296875; // username or score cell  height;
    const listMaxNo = 5;
    this.scene = scene;
    this.users = users
      .sort((a: IUser, b: IUser) => a.highScore! - b.highScore!)
      .reverse();
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

    const bg = this.scene.add.rectangle(
      0,
      0,
      width / 2,
      rowHeight * listMaxNo,
      0x000000
    );

    this.container.add(bg);

    this.users
      .slice(0, listMaxNo)
      .filter((user) => user.highScore)
      .forEach((user: IUser, index: number) => {
        const rowContainer = this.scene.add.container(-width / 4, -height / 4);
        const rowY = index > 0 ? rowHeight * (index + 1) : rowHeight;

        if (this.users.length === 1 && user.highScore! === 0) {
          const noData = this.scene.add
            .text(0, rowY, "No super heroes yet!", {
              color: "white",
            })
            .setPadding(20);
          rowContainer.add(noData);
          this.container.add(rowContainer);
          return;
        }

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
