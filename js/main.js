// main.js - Phaser 3 configuration and game initialization

const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  parent: 'game-container',
  backgroundColor: '#0a0a0f',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 500,
  },
  scene: [BootScene, SetupScene, GameScene, EventScene, DeathScene, EndScene],
  render: {
    antialias: true,
    pixelArt: false,
  },
  // No physics needed for this game
  physics: false,
  audio: false,
  dom: {
    createContainer: true,
  },
};

// Initialize language from browser or default Arabic
(function initLang() {
  const stored = localStorage.getItem('gazagame_lang');
  const browserLang = navigator.language || navigator.userLanguage || 'ar';
  const lang = stored || (browserLang.startsWith('ar') ? 'ar' : 'en');
  LANG.current = lang;
  setLang(lang);
})();

// Start the game once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  // Show HUD overlay (hidden until game starts)
  const hudOverlay = document.getElementById('hud-overlay');

  // Start Phaser
  const game = new Phaser.Game(GAME_CONFIG);

  // Make game globally accessible for debugging
  window._game = game;

  // Listen for scene events to show/hide HUD
  game.events.on('ready', () => {
    // After Phaser boots, hook into scene manager events
    game.scene.getScene('GameScene') && game.scene.getScene('GameScene').events.on('create', () => {
      if (hudOverlay) hudOverlay.classList.remove('hidden');
    });
  });

  // Track scene transitions to show/hide HUD
  const checkScene = setInterval(() => {
    const sceneManager = game.scene;
    if (!sceneManager) return;

    const gameSceneActive = sceneManager.isActive('GameScene');
    const endActive = sceneManager.isActive('EndScene');
    const setupActive = sceneManager.isActive('SetupScene');
    const bootActive = sceneManager.isActive('BootScene');

    if (hudOverlay) {
      if (gameSceneActive && !endActive) {
        hudOverlay.classList.remove('hidden');
      } else {
        hudOverlay.classList.add('hidden');
      }
    }
  }, 500);
});
