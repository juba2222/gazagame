// DeathScene.js - Quiet, factual death notification

class DeathScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DeathScene' });
  }

  init(data) {
    this.member = data.member || null;
    this.onContinue = data.onContinue || null;
  }

  create() {
    const { width, height } = this.scale;
    const isAr = LANG.current === 'ar';

    // Black background
    this.cameras.main.setBackgroundColor('#000000');

    // Show DOM death overlay
    const overlay = document.getElementById('death-overlay');
    if (!overlay) {
      if (this.onContinue) this.onContinue();
      return;
    }

    overlay.classList.remove('hidden');
    overlay.dir = isAr ? 'rtl' : 'ltr';

    const m = this.member;
    if (!m) {
      overlay.classList.add('hidden');
      if (this.onContinue) this.onContinue();
      return;
    }

    const causeKey = this.getCauseKey(m.causeOfDeath);
    const causeTxt = LANG.t(causeKey);
    const stat = this.getStatForCause(m.causeOfDeath);

    overlay.innerHTML = `
      <div class="death-name">${m.name}</div>
      <div class="death-info">${LANG.t('death_age')} — ${m.age} ${LANG.t(isAr ? 'days_unit' : 'days_unit').replace('يوماً','').trim()} ${isAr ? 'سنة' : 'years old'}</div>
      <div class="death-info">${causeTxt}</div>
      <div class="death-stat">${stat}</div>
      <div style="margin-top:28px;">
        <button class="btn-continue" id="death-continue-btn" style="pointer-events:all;cursor:pointer;">${LANG.t('death_continue')}</button>
      </div>
    `;

    const btn = document.getElementById('death-continue-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        overlay.innerHTML = '';
        if (this.onContinue) this.onContinue();
      });
    }

    // Dim game graphics
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.9);
    g.fillRect(0, 0, width, height);
  }

  getCauseKey(cause) {
    const map = {
      hunger: 'died_hunger',
      thirst: 'died_thirst',
      disease: 'died_disease',
      injury: 'died_injury',
    };
    return map[cause] || 'died_injury';
  }

  getStatForCause(cause) {
    const isAr = LANG.current === 'ar';
    if (cause === 'hunger' || cause === 'thirst') {
      return LANG.t('real_stat_hunger');
    } else if (cause === 'disease') {
      return LANG.t('real_stat_medical');
    }
    return LANG.t('real_stat_children');
  }
}
