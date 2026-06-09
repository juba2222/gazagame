// EventScene.js - (Kept as minimal stub — event display handled by DOM overlay in GameScene)
// This scene is reserved for future expansion if needed.

class EventScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EventScene' });
  }

  init(data) {
    this.eventData = data.eventData || null;
    this.onChoiceMade = data.onChoiceMade || null;
  }

  create() {
    // EventScene currently delegates all display to DOM overlays in GameScene.
    // This scene exists as a Phaser scene for architecture completeness.
  }
}
