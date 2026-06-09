// GameScene.js - Main game loop with Phaser canvas + DOM HUD

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    this.currentDay = 1;
    this.currentPhaseIndex = 0;
    this.dayWithinPhase = 0;
    this.totalDays = 0;
    this.recentEventIds = [];
    this.pendingDeaths = [];
    this.eventActive = false;
    this.bgColors = [
      0x0d1520, // phase 1 - dark blue
      0x150d0d, // phase 2 - dark red
      0x110d0d, // phase 3 - very dark
      0x0d0d0d, // phase 4
      0x0d1210, // phase 5 - slight hope green
      0x120d0d, // phase 6
      0x0a0a0a, // phase 7 - almost black
      0x0d120f, // phase 8 - ceasefire
    ];
    this.smokeParticles = [];
    this.fireParticles = [];
    this.buildingData = null;
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#0a0a0f');

    // Generate static building silhouettes
    this.buildingData = this.generateBuildings(width, height);

    // Draw background layer (sky + buildings + ground)
    this.bgGraphics = this.add.graphics();
    this.fgGraphics = this.add.graphics(); // for particles / effects

    this.drawBackground();

    // Show HUD
    this.updateHUD();

    // Start first day
    this.time.delayedCall(600, () => this.startDay());
  }

  update(time, delta) {
    // Animate smoke / fire
    this.updateParticles(delta);
    if (this.smokeParticles.length > 0 || this.fireParticles.length > 0) {
      this.drawParticles();
    }
  }

  // ====================== BACKGROUND ======================

  generateBuildings(width, height) {
    const buildings = [];
    const horizonY = height * 0.62;
    let x = 0;
    while (x < width + 60) {
      const w = Phaser.Math.Between(30, 90);
      const h = Phaser.Math.Between(40, 160);
      // Some buildings are partially destroyed (jagged top)
      const destroyed = Math.random() < 0.4;
      buildings.push({ x, w, h, horizonY, destroyed,
        windowRows: Phaser.Math.Between(2, 5),
        windowCols: Phaser.Math.Between(1, 3) });
      x += w + Phaser.Math.Between(2, 12);
    }
    return buildings;
  }

  drawBackground() {
    const g = this.bgGraphics;
    const { width, height } = this.scale;
    const phase = PHASES[this.currentPhaseIndex];
    const bgColor = this.bgColors[this.currentPhaseIndex] || 0x0a0a0f;

    g.clear();

    // Sky gradient simulation (top band + lower band)
    const skyTop = bgColor;
    const skyMid = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.IntegerToColor(bgColor),
      Phaser.Display.Color.IntegerToColor(0x1a0a0a),
      10, 5
    );

    // Sky
    g.fillStyle(bgColor, 1);
    g.fillRect(0, 0, width, height * 0.65);

    // Slightly lighter ground
    g.fillStyle(0x080808, 1);
    g.fillRect(0, height * 0.65, width, height * 0.35);

    // Ground line
    g.fillStyle(0x1a1008, 1);
    g.fillRect(0, height * 0.64, width, 4);

    // Moon / sun (pale in sky)
    if (this.currentPhaseIndex < 2) {
      g.fillStyle(0x3a3020, 0.6);
      g.fillCircle(width * 0.8, height * 0.12, 18);
    }

    // Building silhouettes
    const horizonY = height * 0.64;
    for (const b of this.buildingData) {
      const bx = b.x;
      const by = horizonY - b.h;
      const bw = b.w;
      const bh = b.h;

      g.fillStyle(0x050508, 1);

      if (b.destroyed) {
        // Jagged / ruined building
        g.fillRect(bx, by + bh * 0.3, bw * 0.6, bh * 0.7);
        // Rubble pile
        g.fillTriangle(
          bx, horizonY,
          bx + bw * 0.7, horizonY,
          bx + bw * 0.35, by + bh * 0.28
        );
        // Broken wall fragment
        g.fillRect(bx + bw * 0.65, by + bh * 0.55, bw * 0.35, bh * 0.45);
      } else {
        g.fillRect(bx, by, bw, bh);
        // Dark windows
        g.fillStyle(0x0a0a12, 1);
        const winH = Math.floor(bh / (b.windowRows + 1));
        const winW = Math.floor(bw / (b.windowCols + 1));
        for (let r = 1; r <= b.windowRows; r++) {
          for (let c = 1; c <= b.windowCols; c++) {
            const wx = bx + c * winW - 4;
            const wy = by + r * winH - 3;
            g.fillRect(wx, wy, 6, 6);
          }
        }
      }
    }

    // Distant smoke columns (phase-dependent)
    const smokeCount = phase ? Math.floor(phase.dangerLevel[FamilyManager.getLocation()] / 2) : 2;
    for (let i = 0; i < smokeCount; i++) {
      const sx = (width * (i + 1)) / (smokeCount + 1) + Phaser.Math.Between(-30, 30);
      this.drawSmokeColumn(g, sx, horizonY - 20, width, height);
    }
  }

  drawSmokeColumn(g, x, baseY, width, height) {
    // Simple upward smoke column using semi-transparent circles
    for (let i = 0; i < 8; i++) {
      const alpha = 0.06 - i * 0.006;
      const radius = 8 + i * 6;
      const yOffset = i * 18;
      const xWobble = Math.sin(i * 0.8) * 8;
      g.fillStyle(0x302828, alpha);
      g.fillCircle(x + xWobble, baseY - yOffset, radius);
    }
  }

  drawParticles() {
    const g = this.fgGraphics;
    g.clear();

    const now = Date.now();

    for (const p of this.smokeParticles) {
      const age = (now - p.born) / p.life;
      if (age < 1) {
        g.fillStyle(0x303030, (1 - age) * 0.3);
        g.fillCircle(p.x + Math.sin(age * 4) * 6, p.y - age * 40, p.r + age * 8);
      }
    }

    for (const p of this.fireParticles) {
      const age = (now - p.born) / p.life;
      if (age < 1) {
        const col = age < 0.5 ? 0xff6600 : 0xcc2200;
        g.fillStyle(col, (1 - age) * 0.8);
        g.fillCircle(p.x, p.y - age * 20, p.r * (1 - age * 0.5));
      }
    }
  }

  updateParticles(delta) {
    const now = Date.now();
    this.smokeParticles = this.smokeParticles.filter(p => now - p.born < p.life);
    this.fireParticles = this.fireParticles.filter(p => now - p.born < p.life);
  }

  triggerExplosionEffect(x, y) {
    const now = Date.now();
    // Fire burst
    for (let i = 0; i < 6; i++) {
      this.fireParticles.push({
        x: x + Phaser.Math.Between(-20, 20),
        y: y + Phaser.Math.Between(-10, 10),
        r: Phaser.Math.Between(12, 30),
        born: now + i * 50,
        life: 800 + i * 100,
      });
    }
    // Smoke
    for (let i = 0; i < 8; i++) {
      this.smokeParticles.push({
        x: x + Phaser.Math.Between(-15, 15),
        y: y,
        r: Phaser.Math.Between(8, 18),
        born: now + i * 80,
        life: 2000 + i * 200,
      });
    }
  }

  // ====================== DAILY LOOP ======================

  startDay() {
    if (this.eventActive) return;

    const phase = PHASES[this.currentPhaseIndex];
    this.totalDays++;
    this.dayWithinPhase++;

    // Check phase transition
    if (this.dayWithinPhase > phase.duration) {
      this.advancePhase();
      return;
    }

    // Pick and show event
    const event = pickRandomEvent(phase.id, FamilyManager.getLocation(), this.recentEventIds);
    if (event) {
      this.recentEventIds.push(event.id);
      if (this.recentEventIds.length > 6) this.recentEventIds.shift();
    }

    this.showEvent(event);
  }

  advancePhase() {
    this.currentPhaseIndex++;
    this.dayWithinPhase = 0;

    if (this.currentPhaseIndex >= PHASES.length) {
      // Game complete
      this.endGame();
      return;
    }

    // Redraw background for new phase
    this.drawBackground();
    this.updateHUD();

    // Show phase transition message
    this.showPhaseTransition(PHASES[this.currentPhaseIndex]);
  }

  showPhaseTransition(phase) {
    const overlay = document.getElementById('event-overlay');
    if (!overlay) { this.startDay(); return; }
    overlay.classList.remove('hidden');
    this.eventActive = true;

    const isAr = LANG.current === 'ar';
    const phaseName = isAr ? LANG.t(phase.nameKey) : phase.nameEn;

    overlay.innerHTML = `
      <div class="event-panel" dir="${isAr ? 'rtl' : 'ltr'}">
        <div class="event-day-badge">${LANG.t('day')} ${this.totalDays} — ${phase.month}</div>
        <div class="event-title">${phaseName}</div>
        <div class="event-story">${this.getPhaseDescription(phase)}</div>
        <div class="event-choices">
          <button class="btn-continue" id="phase-continue-btn">${LANG.t('continue_btn')}</button>
        </div>
      </div>
    `;

    document.getElementById('phase-continue-btn').onclick = () => {
      overlay.classList.add('hidden');
      this.eventActive = false;
      this.startDay();
    };
  }

  getPhaseDescription(phase) {
    const isAr = LANG.current === 'ar';
    const descriptions = {
      ar: [
        'القصف لا يتوقف. كل لحظة قد تكون الأخيرة.',
        'الجميع يهرب. الشوارع مليئة بالنازحين. لا مكان آمن.',
        'الحصار خانق. الطعام نفد. المجاعة تطرق الأبواب.',
        'اجتاح الجيش رفح. آخر ملجأ يحترق.',
        'هدنة هشة. الصمت مرعب بعد كل هذا الضجيج.',
        'عاد القصف. كأن الهدنة لم تكن.',
        'لا فرق بين الشمال والجنوب. كل مكان هدف.',
        'أُعلنت الهدنة في يناير 2025. لكن ما الذي تبقى؟',
      ],
      en: [
        'The bombing doesn\'t stop. Every moment could be the last.',
        'Everyone is fleeing. Streets full of displaced people. No safe place.',
        'The siege is suffocating. Food is gone. Famine is at the door.',
        'The army invaded Rafah. The last refuge is burning.',
        'A fragile ceasefire. The silence is terrifying after all that noise.',
        'The bombing returned. As if the ceasefire never happened.',
        'No difference between north and south. Everywhere is a target.',
        'A ceasefire was announced in January 2025. But what remains?',
      ]
    };

    const idx = PHASES.indexOf(phase);
    const arr = isAr ? descriptions.ar : descriptions.en;
    return arr[idx] || '';
  }

  showEvent(event) {
    if (!event) {
      this.endDay();
      return;
    }

    this.eventActive = true;

    // Trigger visual effect for bombardment events
    if (event.id.includes('001') || event.id.includes('002') || event.id.includes('003')
        || event.id.includes('017')) {
      const { width, height } = this.scale;
      const ex = Phaser.Math.Between(width * 0.2, width * 0.8);
      const ey = Phaser.Math.Between(height * 0.3, height * 0.6);
      this.triggerExplosionEffect(ex, ey);
    }

    const overlay = document.getElementById('event-overlay');
    if (!overlay) { this.endDay(); return; }
    overlay.classList.remove('hidden');

    const isAr = LANG.current === 'ar';
    const phase = PHASES[this.currentPhaseIndex];
    const phaseName = isAr ? LANG.t(phase.nameKey) : phase.nameEn;

    const title = isAr ? event.title.ar : event.title.en;
    const story = isAr ? event.story.ar : event.story.en;

    let choicesHtml = '';

    if (event.noChoice) {
      const msg = isAr ? event.consequences.message.ar : event.consequences.message.en;
      choicesHtml = `
        <div class="event-story" style="color:#7a6060;font-size:0.82rem;border-top:1px solid rgba(255,255,255,0.06);padding-top:12px;">${msg}</div>
        <div style="display:flex;justify-content:${isAr ? 'flex-start' : 'flex-end'}">
          <button class="btn-continue" id="evt-continue-btn">${LANG.t('continue_btn')}</button>
        </div>
      `;
    } else {
      const choices = event.choices || [];
      choicesHtml = `<div class="event-choices">`;
      choices.forEach((choice, i) => {
        const choiceText = isAr ? choice.text.ar : choice.text.en;
        choicesHtml += `<button class="choice-btn${isAr ? ' rtl' : ''}" data-choice="${i}">${choiceText}</button>`;
      });
      choicesHtml += `</div>`;
    }

    overlay.innerHTML = `
      <div class="event-panel" dir="${isAr ? 'rtl' : 'ltr'}">
        <div class="event-day-badge">${LANG.t('day')} ${this.totalDays} · ${phaseName} · ${phase.month}</div>
        <div class="event-title">${title}</div>
        <div class="event-story">${story}</div>
        ${choicesHtml}
      </div>
    `;

    if (event.noChoice) {
      document.getElementById('evt-continue-btn').onclick = () => {
        this.applyConsequences(event.consequences, event);
        overlay.classList.add('hidden');
        this.endDay();
      };
    } else {
      overlay.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.choice);
          const choice = event.choices[idx];
          this.applyConsequences(choice.consequences, event);
          overlay.classList.add('hidden');
          this.endDay();
        });
      });
    }
  }

  applyConsequences(cons, event) {
    if (!cons) return;

    // Resource changes
    const delta = {};
    if (cons.food !== undefined) delta.food = cons.food;
    if (cons.water !== undefined) delta.water = cons.water;
    if (cons.money !== undefined) delta.money = cons.money;
    if (cons.medicine !== undefined) delta.medicine = cons.medicine;
    if (cons.fuel !== undefined) delta.fuel = cons.fuel;
    if (Object.keys(delta).length) ResourceManager.apply(delta);

    // Displacement
    if (cons.displace) {
      ResourceManager.displacementLoss();
      const locations = ['north', 'gaza', 'central', 'khanyunis', 'rafah'];
      const current = FamilyManager.getLocation();
      const idx = locations.indexOf(current);
      const newLoc = locations[Math.min(idx + 1, locations.length - 1)];
      FamilyManager.setLocation(newLoc);
      this.drawBackground();
    }

    // Member effects
    if (cons.memberEffects) {
      for (const eff of cons.memberEffects) {
        const phase = PHASES[this.currentPhaseIndex];
        const died = FamilyManager.applyEffect(eff.target, eff, this.totalDays, phase.id);
        if (died) {
          this.pendingDeaths.push(died);
        }
      }
    }

    // Show consequence message as toast
    const isAr = LANG.current === 'ar';
    const msg = cons.message ? (isAr ? cons.message.ar : cons.message.en) : null;
    if (msg) this.showToast(msg);

    this.updateHUD();
  }

  showToast(msg) {
    const toast = document.getElementById('consequence-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    toast.style.opacity = '1';

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.classList.add('hidden'), 500);
    }, 3500);
  }

  endDay() {
    this.eventActive = false;

    // Apply daily tick (hunger/thirst/health)
    const phase = PHASES[this.currentPhaseIndex];
    const deaths = FamilyManager.dailyTick(ResourceManager, this.totalDays, phase.id);

    // Collect all deaths
    const allDeaths = [...this.pendingDeaths, ...deaths];
    this.pendingDeaths = [];

    this.updateHUD();

    if (allDeaths.length > 0) {
      // Show death scenes one by one
      this.showDeaths(allDeaths, 0, () => {
        if (FamilyManager.allDead()) {
          this.endGame();
        } else {
          this.time.delayedCall(400, () => this.startDay());
        }
      });
    } else if (FamilyManager.allDead()) {
      this.endGame();
    } else {
      this.time.delayedCall(600, () => this.startDay());
    }
  }

  showDeaths(deaths, index, callback) {
    if (index >= deaths.length) {
      callback();
      return;
    }

    const member = deaths[index];
    this.scene.launch('DeathScene', {
      member,
      onContinue: () => {
        this.scene.stop('DeathScene');
        this.showDeaths(deaths, index + 1, callback);
      }
    });
  }

  endGame() {
    const overlay = document.getElementById('event-overlay');
    if (overlay) overlay.classList.add('hidden');

    this.scene.start('EndScene', {
      totalDays: this.totalDays,
      familyMembers: FamilyManager.members,
      playerName: FamilyManager.player ? FamilyManager.player.name : '',
    });
  }

  // ====================== HUD ======================

  updateHUD() {
    this.updateResourcesPanel();
    this.updatePhasePanel();
    this.updateFamilyPanel();
  }

  updateResourcesPanel() {
    const panel = document.getElementById('hud-resources');
    if (!panel) return;

    const isAr = LANG.current === 'ar';
    const R = ResourceManager;

    const items = [
      { key: 'food', icon: '🍞', val: Math.floor(R.food) },
      { key: 'water', icon: '💧', val: Math.floor(R.water) },
      { key: 'medicine', icon: '💊', val: Math.floor(R.medicine) },
      { key: 'money', icon: '💰', val: Math.floor(R.money) },
    ];

    let html = '';
    for (const item of items) {
      const low = item.val <= 1;
      const warn = item.val <= 3 && item.val > 1;
      const cls = low ? 'hud-res-val low' : warn ? 'hud-res-val warn' : 'hud-res-val';
      html += `<div>${item.icon} ${LANG.t(item.key)}: <span class="${cls}">${item.val}</span></div>`;
    }
    panel.innerHTML = html;
  }

  updatePhasePanel() {
    const panel = document.getElementById('hud-phase');
    if (!panel) return;

    const phase = PHASES[this.currentPhaseIndex];
    if (!phase) return;

    const isAr = LANG.current === 'ar';
    const phaseName = isAr ? LANG.t(phase.nameKey) : phase.nameEn;
    const location = FamilyManager.getLocation();
    const locKey = location;

    panel.innerHTML = `
      <div class="hud-phase-name">${phaseName}</div>
      <div style="font-size:0.68rem;color:#665;">${LANG.t(locKey)} · ${LANG.t('day')} ${this.totalDays}</div>
      <div style="font-size:0.68rem;color:#554;">${phase.month}</div>
    `;
  }

  updateFamilyPanel() {
    const panel = document.getElementById('hud-family');
    if (!panel) return;

    let html = '';
    for (const m of FamilyManager.members) {
      const isDead = m.status === 'dead';
      const healthPct = Math.max(0, Math.min(100, m.health));
      const hungerPct = Math.max(0, Math.min(100, m.hunger));
      const healthCls = healthPct < 20 ? 'mini-bar-fill health critical' : 'mini-bar-fill health';

      html += `
        <div class="family-card${isDead ? ' dead' : ''}">
          <div class="family-card-name">${m.name}</div>
          <div class="mini-bar"><div class="${healthCls}" style="width:${healthPct}%"></div></div>
          <div class="mini-bar"><div class="mini-bar-fill hunger" style="width:${hungerPct}%"></div></div>
          ${isDead ? '<div style="font-size:0.65rem;color:#443;margin-top:2px;">✕</div>' : ''}
        </div>
      `;
    }
    panel.innerHTML = html;
  }
}
