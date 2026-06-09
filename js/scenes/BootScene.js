// BootScene.js - Initial loading scene

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // No external assets — everything is drawn programmatically
    // Just set background
    this.cameras.main.setBackgroundColor('#0a0a0f');
  }

  create() {
    const { width, height } = this.scale;

    // Draw minimal boot screen
    const g = this.add.graphics();
    g.fillStyle(0x0a0a0f, 1);
    g.fillRect(0, 0, width, height);

    // Simple loading text
    this.add.text(width / 2, height / 2 - 20, LANG.t('game_title'), {
      fontFamily: 'Cairo, IBM Plex Mono, monospace',
      fontSize: '28px',
      color: '#e8e0d0',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, LANG.t('loading'), {
      fontFamily: 'Cairo, IBM Plex Mono, monospace',
      fontSize: '13px',
      color: '#5a5040',
    }).setOrigin(0.5);

    // Transition to SetupScene after brief pause
    this.time.delayedCall(800, () => {
      this.scene.start('SetupScene');
    });
  }
}
