import { getDocs, getFirestore, collection } from "firebase/firestore";
import { IUser } from "~/models/IUser.model";

export default class HighscoresPanel {
  private scene!: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private scores: Phaser.GameObjects.Group;
  private users: IUser[];
  private db = getFirestore();

  constructor(scene: Phaser.Scene, users: IUser[]) {
    this.scene = scene;
    this.users = users;
    this.scene.physics.pause();

    const { width, height } = this.scene.scale;
    this.container = this.scene.add.container(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY
    );

    const bg = this.scene.add.rectangle(0, 0, width / 2, height / 2, 0x000000);

    this.container.add(bg);

    this.users.forEach((user) => {
      this.scene.load.image(user.name, `${user.image}.png`);

      const userimage = this.scene.add
        .image(-(bg.width / 2), -(bg.height / 2), user.name)
        .setOrigin(0, 0);
      userimage.width = 50;
      userimage.height = 50;
      const username = this.scene.add.text(
        userimage.x + userimage.width,
        userimage.y + 10,
        user.name,
        {
          color: "white",
        }
      );

      this.container.add(userimage);
      this.container.add(username);
    });
  }
}
