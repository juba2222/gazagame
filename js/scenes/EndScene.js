// EndScene.js - Final summary after game ends

class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  init(data) {
    this.totalMonths = data.totalMonths || 0;
    this.familyMembers = data.familyMembers || [];
    this.playerName = data.playerName || '';
    this.completed = data.completed || false;
    this.reason = data.reason || 'died';
    this.financialSnapshot = data.financialSnapshot || null;
    this.emigrated = data.emigrated || false;
  }

  create() {
    const { width, height } = this.scale;
    const isAr = LANG.current === 'ar';

    this.cameras.main.setBackgroundColor('#05050a');
    const g = this.add.graphics();
    g.fillStyle(0x05050a, 1);
    g.fillRect(0, 0, width, height);

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

    let outcomeText = allDied
      ? LANG.t('all_died')
      : allSurvived
        ? LANG.t('all_survived')
        : LANG.t('some_survived');

    if (this.emigrated) {
      outcomeText = isAr
        ? LANG.t('emigrated_text')
        : LANG.t('emigrated_text');
    }

    // Title
    let titleText = LANG.t('end_title');
    if (this.emigrated) titleText = LANG.t('emigrated_title');

    // Months info
    const monthsText = isAr
      ? this.totalMonths + ' ' + 'شهراً من 36'
      : this.totalMonths + ' months of 36';

    // Survived list
    let survivedHtml = '';
    for (const m of survived) {
      const injuredNote = m.injured ? (isAr ? ' (مُصاب)' : ' (injured)') : '';
      survivedHtml += `<div class="end-member-line survived">✓ ${m.name} — ${m.age} ${isAr ? 'سنة' : 'yrs'}${injuredNote}</div>`;
    }
    if (!survivedHtml) survivedHtml = `<div class="end-member-line" style="color:#443;">${LANG.t('all_died')}</div>`;

    // Dead list
    let deadHtml = '';
    for (const m of dead) {
      const causeKey = this.getCauseKey(m.causeOfDeath);
      const causeTxt = LANG.t(causeKey);
      const monthNote = m.monthOfDeath ? ` · ${isAr ? 'شهر' : 'month'} ${m.monthOfDeath}` : '';
      deadHtml += `<div class="end-member-line died">✕ ${m.name} — ${causeTxt}${monthNote}</div>`;
    }
    if (!deadHtml) deadHtml = `<div class="end-member-line" style="color:#556;">—</div>`;

    // Financial summary
    let financialHtml = '';
    if (this.financialSnapshot) {
      const snap = this.financialSnapshot;
      financialHtml = `
        <div class="end-financial">
          <div>${isAr ? 'المدخرات المتبقية' : 'Remaining savings'}: <strong>$${snap.savings.toLocaleString()}</strong></div>
          <div>${isAr ? 'الديون' : 'Debt'}: <strong>$${snap.debt.toLocaleString()}</strong></div>
        </div>
      `;
    }

    overlay.innerHTML = `
      <div class="end-title">${titleText}</div>
      <div class="end-days">${monthsText}</div>
      <div style="color:#7a6060;font-size:0.9rem;text-align:center;margin-bottom:20px;max-width:500px;white-space:pre-line;">${outcomeText}</div>

      ${financialHtml}

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
        <div class="end-stats">
          <div>${LANG.t('end_stat1')}</div>
          <div>${LANG.t('end_stat2')}</div>
          <div>${LANG.t('end_stat3')}</div>
          <div>${LANG.t('end_stat4')}</div>
          <div>${LANG.t('end_stat5')}</div>
          <div style="margin-top:8px;color:#6a8a6a;">${LANG.t('end_ceasefire')}</div>
        </div>
      </div>

      <div class="end-actions">
        <button class="btn-end" id="btn-share-end">${LANG.t('share_story')}</button>
        <button class="btn-end" id="btn-replay-end">${LANG.t('replay_btn')}</button>
        <button class="btn-end" id="btn-restart-end">${LANG.t('play_again')}</button>
      </div>
    `;

    document.getElementById('btn-share-end').addEventListener('click', () => {
      this.shareResult(survived, dead, isAr);
    });

    document.getElementById('btn-replay-end').addEventListener('click', () => {
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      this.restartGame(true);
    });

    document.getElementById('btn-restart-end').addEventListener('click', () => {
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      this.restartGame(false);
    });
  }

  getCauseKey(cause) {
    const map = {
      hunger: 'died_hunger',
      starvation: 'died_hunger',
      thirst: 'died_thirst',
      disease: 'died_disease',
      injury: 'died_injury',
      capture: 'died_injury',
    };
    return map[cause] || 'died_injury';
  }

  shareResult(survived, dead, isAr) {
    const lines = [];
    if (isAr) {
      lines.push(`صمدتُ ${this.totalMonths} شهراً من 36 في محاكاة "هل ستنجو؟"`);
      if (survived.length) lines.push(`نجا: ${survived.map(m => m.name).join('، ')}`);
      if (dead.length) lines.push(`فقدنا: ${dead.map(m => m.name).join('، ')}`);
      lines.push('');
      lines.push('في غزة الحقيقية، الأرقام أكبر من أي لعبة.');
      lines.push('أكثر من 55,000 شهيد. 90% نازحون. مجاعة متعمدة.');
    } else {
      lines.push(`I survived ${this.totalMonths}/36 months in "Will You Survive?" simulation.`);
      if (survived.length) lines.push(`Survived: ${survived.map(m => m.name).join(', ')}`);
      if (dead.length) lines.push(`Lost: ${dead.map(m => m.name).join(', ')}`);
      lines.push('');
      lines.push('In real Gaza, the numbers are beyond any game.');
      lines.push('55,000+ martyred. 90% displaced. Deliberate famine.');
    }

    const text = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => prompt('Copy this:', text));
    } else {
      prompt('Copy this:', text);
    }
  }

  restartGame(useReplay) {
    FamilyManager.members = [];
    FamilyManager.player = null;

    if (!useReplay) {
      // Clear replay config for fresh start
      try { localStorage.removeItem('gazagame_replay_config'); } catch(e) {}
    }

    const endOverlay = document.getElementById('end-overlay');
    if (endOverlay) endOverlay.classList.add('hidden');

    this.scene.start('SetupScene');
  }
}
