export class Button {
  constructor(x, y, label, scene, callback) {
    const button = scene.add
      .text(x, y, label)
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({
        backgroundColor: "#3aadd2",
        fontSize: "32px",
        color: "#000",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => callback())
      .on("pointerover", () => button.setStyle({ backgroundColor: "#45ccf8" }))
      .on("pointerout", () => button.setStyle({ backgroundColor: "#3aadd2" }));
  }
}
