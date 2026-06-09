// EndScene.js - Final summary after game ends

class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  init(data) {
    this.totalDays = data.totalDays || 0;
    this.familyMembers = data.familyMembers || [];
    this.playerName = data.playerName || '';
  }

  create() {
    const { width, height } = this.scale;
    const isAr = LANG.current === 'ar';

    // Dark background
    this.cameras.main.setBackgroundColor('#05050a');
    const g = this.add.graphics();
    g.fillStyle(0x05050a, 1);
    g.fillRect(0, 0, width, height);

    // Hide other overlays
    ['event-overlay', 'death-overlay', 'hud-overlay', 'consequence-toast'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    this.showEndOverlay(isAr);
  }

  showEndOverlay(isAr) {
    const overlay = document.getElementById('end-overlay');
    if (!overlay) return;

    overlay.classList.remove('hidden');
    overlay.dir = isAr ? 'rtl' : 'ltr';

    const survived = this.familyMembers.filter(m => m.status !== 'dead');
    const dead = this.familyMembers.filter(m => m.status === 'dead');
    const allDied = survived.length === 0;
    const allSurvived = dead.length === 0;

    let titleKey = allDied ? 'end_title' : 'end_title';
    let outcomeText = allDied
      ? LANG.t('all_died')
      : allSurvived
        ? LANG.t('all_survived')
        : LANG.t('some_survived');

    // Build survived list
    let survivedHtml = '';
    for (const m of survived) {
      survivedHtml += `<div class="end-member-line survived">✓ ${m.name} — ${m.age} ${isAr ? 'سنة' : 'yrs'}</div>`;
    }
    if (!survivedHtml) survivedHtml = `<div class="end-member-line" style="color:#443;">${LANG.t('all_died')}</div>`;

    // Build dead list
    let deadHtml = '';
    for (const m of dead) {
      const phaseNum = m.phaseOfDeath || '—';
      const causeKey = this.getCauseKey(m.causeOfDeath);
      const causeTxt = LANG.t(causeKey);
      deadHtml += `<div class="end-member-line died">✕ ${m.name} — ${causeTxt}${m.dayOfDeath ? (' · ' + LANG.t('day') + ' ' + m.dayOfDeath) : ''}</div>`;
    }
    if (!deadHtml) deadHtml = `<div class="end-member-line" style="color:#556;">—</div>`;

    // Real stats
    const statsHtml = `
      <div class="end-stats">
        <div>${LANG.t('end_stat_header')}</div>
        <div>${LANG.t('end_stat1')}</div>
        <div>${LANG.t('end_stat2')}</div>
        <div>${LANG.t('end_stat3')}</div>
        <div>${LANG.t('end_stat4')}</div>
        <div>${LANG.t('end_stat5')}</div>
        <div style="margin-top:8px;color:#6a8a6a;">${LANG.t('end_ceasefire')}</div>
      </div>
    `;

    overlay.innerHTML = `
      <div class="end-title">${LANG.t('end_title')}</div>
      <div class="end-days">${this.totalDays} ${LANG.t('end_days')}</div>
      <div style="color:#7a6060;font-size:0.9rem;text-align:center;margin-bottom:20px;max-width:500px;">${outcomeText}</div>

      <div class="end-section" style="max-width:560px;width:100%">
        <div class="end-section-title">${LANG.t('end_survived')}</div>
        ${survivedHtml}
      </div>

      <div class="end-section" style="max-width:560px;width:100%">
        <div class="end-section-title">${LANG.t('end_lost')}</div>
        ${deadHtml}
      </div>

      <div class="end-section" style="max-width:560px;width:100%;border-color:rgba(232,224,208,0.07)">
        <div class="end-section-title">${LANG.t('end_stat_header')}</div>
        ${statsHtml}
      </div>

      <div class="end-actions">
        <button class="btn-end" id="btn-share-end">${LANG.t('share_story')}</button>
        <button class="btn-end" id="btn-restart-end">${LANG.t('play_again')}</button>
      </div>
    `;

    document.getElementById('btn-share-end').addEventListener('click', () => {
      this.shareResult(survived, dead, isAr);
    });

    document.getElementById('btn-restart-end').addEventListener('click', () => {
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      this.restartGame();
    });
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

  shareResult(survived, dead, isAr) {
    const lines = [];
    if (isAr) {
      lines.push(`صمدتُ ${this.totalDays} يوماً في محاكاة "هل ستنجو؟"`);
      if (survived.length) lines.push(`نجا: ${survived.map(m => m.name).join('، ')}`);
      if (dead.length) lines.push(`فقدنا: ${dead.map(m => m.name).join('، ')}`);
      lines.push('');
      lines.push('في غزة الحقيقية، الأرقام أكبر من أي لعبة.');
      lines.push('أكثر من 46,000 شهيد. 90% نازحون. مجاعة متعمدة.');
    } else {
      lines.push(`I survived ${this.totalDays} days in "Will You Survive?" simulation.`);
      if (survived.length) lines.push(`Survived: ${survived.map(m => m.name).join(', ')}`);
      if (dead.length) lines.push(`Lost: ${dead.map(m => m.name).join(', ')}`);
      lines.push('');
      lines.push('In real Gaza, the numbers are beyond any game.');
      lines.push('46,000+ martyred. 90% displaced. Deliberate famine.');
    }

    const text = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => prompt('Copy this:', text));
    } else {
      prompt('Copy this:', text);
    }
  }

  restartGame() {
    // Reset managers
    FamilyManager.members = [];
    FamilyManager.player = null;

    // Show setup again
    const setupOverlay = document.getElementById('setup-overlay');
    if (setupOverlay) setupOverlay.classList.remove('hidden');

    // Hide end overlay
    const endOverlay = document.getElementById('end-overlay');
    if (endOverlay) endOverlay.classList.add('hidden');

    this.scene.start('SetupScene');
  }
}
