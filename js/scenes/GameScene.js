// GameScene.js - 36-month survival simulation

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    this.currentMonth = 1;
    this.resolvedChallengeIds = new Set();
    this.pendingChallengeIds = new Set();
    this.monthChoices = {};       // challengeId → choiceIndex
    this.monthConsequences = [];  // queued consequence messages
    this.emigrated = false;
    this.gameOver = false;
    this.initialConfig = null;
    this.buildingData = null;
    this.bgGraphics = null;
    this.fgGraphics = null;
    this.smokeParticles = [];
    this.fireParticles = [];

    this.cumulativeExplosivesTons = 0;
    this.bombingMonthlyBase = [
      0, // padding index 0
      // Month 1-36: bombing intensity in tons/month (total = ~150,000 tons over 36 months)
      3000, 4000, 5000, 5500, 6000, 6000,   // months 1-6
      5500, 5000, 5500, 6000, 6000, 6000,   // months 7-12
      5500, 5000, 4500, 5000, 5500, 5000,   // months 13-18
      4000, 4500, 5000, 5000, 4500, 4000,   // months 19-24
      3500, 3000, 3000, 3500, 3000, 2500,   // months 25-30
      2000, 1500, 1000, 500, 200, 100,      // months 31-36 (ceasefire)
    ];
  }

  init(data) {
    this.initialConfig = (data && data.initialConfig) || null;
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#0a0a0f');

    // Generate static building silhouettes
    this.buildingData = this.generateBuildings(width, height);
    this.bgGraphics = this.add.graphics();
    this.fgGraphics = this.add.graphics();

    this.drawBackground();

    // Show HUD panels
    const hudOverlay = document.getElementById('hud-overlay');
    if (hudOverlay) hudOverlay.classList.remove('hidden');

    // Hide overlays from previous runs
    ['event-overlay', 'death-overlay', 'end-overlay'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    this.updateHUD();

    // Start month 1 after brief pause
    this.time.delayedCall(500, () => this.startMonth());
  }

  update(time, delta) {
    this.updateParticles(delta);
    if (this.smokeParticles.length > 0 || this.fireParticles.length > 0) {
      this.drawParticles();
    }
  }

  // ====================== BACKGROUND ======================

  generateBuildings(width, height) {
    const buildings = [];
    let x = 0;
    while (x < width + 60) {
      const w = Phaser.Math.Between(30, 90);
      const h = Phaser.Math.Between(40, 160);
      const destroyed = Math.random() < 0.4;
      buildings.push({
        x, w, h,
        destroyed,
        windowRows: Phaser.Math.Between(2, 5),
        windowCols: Phaser.Math.Between(1, 3),
      });
      x += w + Phaser.Math.Between(2, 12);
    }
    return buildings;
  }

  drawBackground() {
    const g = this.bgGraphics;
    const { width, height } = this.scale;
    const horizonY = height * 0.64;

    // Destruction ratio increases with month
    const destroyRatio = Math.min(0.95, 0.4 + (this.currentMonth / 36) * 0.5);
    const bgColor = this.currentMonth < 10 ? 0x0d1520
      : this.currentMonth < 20 ? 0x150d0d
      : this.currentMonth < 30 ? 0x0d0d0d
      : 0x0d120f;

    g.clear();
    g.fillStyle(bgColor, 1);
    g.fillRect(0, 0, width, height * 0.65);
    g.fillStyle(0x080808, 1);
    g.fillRect(0, height * 0.65, width, height * 0.35);
    g.fillStyle(0x1a1008, 1);
    g.fillRect(0, horizonY, width, 4);

    // Moon
    if (this.currentMonth < 10) {
      g.fillStyle(0x3a3020, 0.6);
      g.fillCircle(width * 0.8, height * 0.12, 18);
    }

    // Building silhouettes
    for (const b of this.buildingData) {
      const bx = b.x;
      const by = horizonY - b.h;
      const bw = b.w;
      const bh = b.h;
      const isDestroyed = b.destroyed || (Math.random() < destroyRatio - 0.4);

      g.fillStyle(0x050508, 1);

      if (isDestroyed) {
        g.fillRect(bx, by + bh * 0.3, bw * 0.6, bh * 0.7);
        g.fillTriangle(bx, horizonY, bx + bw * 0.7, horizonY, bx + bw * 0.35, by + bh * 0.28);
        g.fillRect(bx + bw * 0.65, by + bh * 0.55, bw * 0.35, bh * 0.45);
      } else {
        g.fillRect(bx, by, bw, bh);
        g.fillStyle(0x0a0a12, 1);
        const winH = Math.floor(bh / (b.windowRows + 1));
        const winW = Math.floor(bw / (b.windowCols + 1));
        for (let r = 1; r <= b.windowRows; r++) {
          for (let c = 1; c <= b.windowCols; c++) {
            g.fillRect(bx + c * winW - 4, by + r * winH - 3, 6, 6);
          }
        }
      }
    }

    // Smoke columns (more per month)
    const smokeCount = Math.min(6, 1 + Math.floor(this.currentMonth / 6));
    for (let i = 0; i < smokeCount; i++) {
      const sx = (width * (i + 1)) / (smokeCount + 1) + Phaser.Math.Between(-20, 20);
      this.drawSmokeColumn(g, sx, horizonY - 20);
    }
  }

  drawSmokeColumn(g, x, baseY) {
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

  triggerExplosionEffect() {
    const { width, height } = this.scale;
    const x = Phaser.Math.Between(width * 0.2, width * 0.8);
    const y = Phaser.Math.Between(height * 0.3, height * 0.6);
    const now = Date.now();
    for (let i = 0; i < 6; i++) {
      this.fireParticles.push({
        x: x + Phaser.Math.Between(-20, 20), y: y + Phaser.Math.Between(-10, 10),
        r: Phaser.Math.Between(12, 30), born: now + i * 50, life: 800 + i * 100,
      });
    }
    for (let i = 0; i < 8; i++) {
      this.smokeParticles.push({
        x: x + Phaser.Math.Between(-15, 15), y,
        r: Phaser.Math.Between(8, 18), born: now + i * 80, life: 2000 + i * 200,
      });
    }
  }

  // ====================== MONTHLY LOOP ======================

  startMonth() {
    if (this.gameOver) return;

    // Redraw background for current month (more destroyed over time)
    this.drawBackground();

    // 1. Process finances
    const summary = ResourceManager.processMonth();

    // 2. Apply auto events for this month
    this.applyAutoEvents(this.currentMonth);

    // 3. Check bankruptcy → health decay
    const isBankrupt = ResourceManager.isBankrupt();
    const deaths = FamilyManager.monthlyTick(this.currentMonth, isBankrupt);

    // 4. Apply ongoing working death hazard
    let workDeath = null;
    if (ResourceManager.workActive && ResourceManager.monthlyDeathHazard > 0) {
      if (Math.random() < ResourceManager.monthlyDeathHazard) {
        workDeath = FamilyManager.applyEffect('player', { health: -999, causeOfDeath: 'injury' }, this.currentMonth);
      }
    }
    if (workDeath) deaths.push(workDeath);

    this.updateHUD();

    if (FamilyManager.allDead()) {
      this.endGame(false);
      return;
    }

    // 5. Monthly bombing probability
    let autoDeaths = deaths;
    const bombResult = this.rollMonthlyBombing();
    if (bombResult.hit) {
      autoDeaths = [...(autoDeaths || []), ...(bombResult.deaths || [])];
    }
    // Add this month's explosives to counter
    const tonsThisMonth = this.bombingMonthlyBase[this.currentMonth] || 0;
    this.cumulativeExplosivesTons += tonsThisMonth;

    // 6. Show month UI
    this.showMonthScreen(summary, isBankrupt, autoDeaths, bombResult);
  }

  applyAutoEvents(month) {
    const autoEvents = MONTHLY_CHALLENGES.filter(c => c.month === month && c.autoEvent);
    for (const ev of autoEvents) {
      const eff = ev.autoEffect;
      if (!eff) continue;

      if (eff.salaryPenaltyAdd) {
        ResourceManager.addSalaryPenalty(eff.salaryPenaltyAdd);
      }
      if (eff.salaryRestore) {
        ResourceManager.restoreSalary(eff.salaryRestore);
      }
      if (eff.updateBurdenId && eff.newAmount !== undefined) {
        // Only update if burden exists and only if family has children (for baby formula)
        if (!ev.showOnlyIfChildren || FamilyManager.hasChildren()) {
          ResourceManager.addMonthlyBurden(eff.updateBurdenId, eff.newAmount, '', '');
        }
      }
      if (eff.healthEffect) {
        FamilyManager.applyToAll({ health: eff.healthEffect, causeOfDeath: 'disease' }, month);
      }
      if (eff.childrenHealthEffect) {
        FamilyManager.applyToChildren({ health: eff.childrenHealthEffect, causeOfDeath: 'disease' }, month);
      }
      if (eff.deathRisk) {
        if (Math.random() < eff.deathRisk) {
          FamilyManager.applyEffect('random', { health: -999, causeOfDeath: 'injury' }, month);
        }
      }
      if (eff.injuryRisk) {
        if (Math.random() < eff.injuryRisk) {
          FamilyManager.applyEffect('random', { injure: true, causeOfDeath: 'injury' }, month);
        }
      }
      if (eff.savingsBonus) {
        ResourceManager.receive(eff.savingsBonus);
      }
      if (eff.savingsDevaluation) {
        ResourceManager.savings = Math.floor(ResourceManager.savings * (1 - eff.savingsDevaluation));
      }
      if (eff.allBurdenIncrease) {
        ResourceManager.activeMonthlyBurdens.forEach(b => {
          b.amount = Math.round(b.amount * (1 + eff.allBurdenIncrease));
        });
      }
      if (eff.allBurdenDecrease) {
        ResourceManager.activeMonthlyBurdens.forEach(b => {
          b.amount = Math.round(b.amount * (1 - eff.allBurdenDecrease));
        });
      }
      if (eff.moraleEffect) {
        FamilyManager.applyToAll({ morale: eff.moraleEffect }, month);
      }
      if (eff.moraleBonusThenPenalty) {
        FamilyManager.applyToAll({ morale: eff.moraleBonusThenPenalty.bonus }, month);
        // Penalty applied next tick
        this.time.delayedCall(2000, () => {
          FamilyManager.applyToAll({ morale: eff.moraleBonusThenPenalty.penalty }, month);
          this.updateHUD();
        });
      }
      if (eff.foodCostIncrease) {
        // Temporary food cost increase
        ResourceManager.addMonthlyBurden(
          'temp_food_' + month,
          eff.foodCostIncrease,
          'غلاء الطعام المؤقت',
          'Temporary food price increase'
        );
        // Remove after 2 months
        this.time.delayedCall(100, () => {
          const removeMonth = month + (eff.durationMonths || 2);
          this._scheduleRemoveBurden('temp_food_' + month, removeMonth);
        });
      }
      if (eff.triggerEndGame) {
        this.time.delayedCall(2000, () => this.endGame(true));
      }
      if (eff.medicineCost) {
        ResourceManager.pay(eff.medicineCost);
      }
      if (eff.homeValueLoss) {
        // Just narrative — morale hit applied via moraleEffect
      }
      if (eff.workingDeathRiskIncrease) {
        ResourceManager.monthlyDeathHazard = Math.min(0.5,
          ResourceManager.monthlyDeathHazard + eff.workingDeathRiskIncrease);
      }
      if (eff.northGazaFoodCostIncrease && FamilyManager.getLocation() === 'north') {
        ResourceManager.addMonthlyBurden('north_food', eff.northGazaFoodCostIncrease,
          'طعام شمال غزة', 'North Gaza food');
        FamilyManager.applyToAll({ health: -10 }, month);
      }
    }
  }

  rollMonthlyBombing() {
    const month = this.currentMonth;
    // Base probability 5% month 1, up to 30% month 24, then decreasing toward ceasefire
    const basePct = Math.min(0.30, 0.05 + (month - 1) * 0.011);
    // Location modifier: north and gaza are more dangerous
    const loc = FamilyManager.getLocation();
    const locBonus = (loc === 'north' || loc === 'gaza') ? 0.07 : (loc === 'central') ? 0.04 : 0.02;
    // Job modifier: medic/doctor working = higher risk
    const jobRisk = (ResourceManager.workActive && ResourceManager.workRiskLevel === 'veryhigh') ? 0.05 : 0;

    const chance = Math.min(0.45, basePct + locBonus + jobRisk);

    if (Math.random() > chance) return { hit: false };

    // Bombing hit — determine severity
    const rand = Math.random();
    const deaths = [];

    if (rand < 0.20) {
      // Death
      const died = FamilyManager.applyEffect('random', { health: -999, causeOfDeath: 'injury' }, month);
      if (died) deaths.push(died);
      return { hit: true, severity: 'death', deaths };
    } else if (rand < 0.50) {
      // Limb injury
      FamilyManager.applyEffect('random', { injure: true, causeOfDeath: 'injury' }, month);
      return { hit: true, severity: 'injury', deaths };
    } else {
      // Health damage only
      const healthLoss = -20 - Math.floor(Math.random() * 20); // -20 to -40
      FamilyManager.applyToAll({ health: healthLoss, causeOfDeath: 'injury' }, month);
      return { hit: true, severity: 'damage', deaths };
    }
  }

  _scheduleRemoveBurden(burdenId, targetMonth) {
    // Store for later removal
    if (!this._pendingBurdenRemovals) this._pendingBurdenRemovals = [];
    this._pendingBurdenRemovals.push({ burdenId, targetMonth });
  }

  showMonthScreen(summary, isBankrupt, autoDeaths, bombResult) {
    const overlay = document.getElementById('event-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');

    const isAr = LANG.current === 'ar';
    const monthName = LANG.t('month_name_' + this.currentMonth) || ('Month ' + this.currentMonth);
    const snap = ResourceManager.snapshot();

    // Gather challenges for this month
    const newChallenges = MONTHLY_CHALLENGES.filter(c => {
      if (c.month !== this.currentMonth) return false;
      if (c.autoEvent) return false;
      if (this.resolvedChallengeIds.has(c.id)) return false;
      // Show aid convoy only if broke
      if (c.showOnlyIfBroke && snap.savings >= 500) return false;
      // Show children challenges only if has children
      if (c.showOnlyIfChildren && !FamilyManager.hasChildren()) return false;
      return true;
    });

    // Pending (unresolved from previous months)
    const pendingChallenges = MONTHLY_CHALLENGES.filter(c => {
      return c.recurring && this.pendingChallengeIds.has(c.id) && !this.resolvedChallengeIds.has(c.id);
    });

    const allChallenges = [...newChallenges, ...pendingChallenges];

    // Mark new recurring challenges as pending
    newChallenges.forEach(c => {
      if (c.recurring) this.pendingChallengeIds.add(c.id);
    });

    // ── TOP BAR ──────────────────────────────────────────────
    const savingsClass = snap.savings < 300 ? 'danger' : snap.savings < 800 ? 'warn' : '';
    const tons = Math.round(this.cumulativeExplosivesTons / 1000);
    const salarySign = snap.salary > 0 ? `+$${summary.earned.toLocaleString()}` : (isAr ? 'بلا راتب' : 'no salary');
    const burdenSign = summary.burden > 0 ? `-$${summary.burden.toLocaleString()}` : '';

    let html = `<div class="panel-top-bar" dir="${isAr ? 'rtl' : 'ltr'}">`;
    html += `<span class="panel-month-name">${monthName} <span style="color:#5a5040;font-weight:400">${isAr ? this.currentMonth + '/36' : this.currentMonth + '/36'}</span></span>`;
    html += `<span class="panel-separator">|</span>`;
    html += `<span class="panel-stat ${savingsClass}">${isAr ? 'مدخرات' : 'Saved'} <span>$${snap.savings.toLocaleString()}</span></span>`;
    if (snap.debt > 0) {
      html += `<span class="panel-separator">·</span><span class="panel-stat warn">${isAr ? 'دين' : 'Debt'} <span>$${snap.debt.toLocaleString()}</span></span>`;
    }
    if (summary.earned > 0 || summary.burden > 0) {
      html += `<span class="panel-separator">·</span><span class="panel-stat positive">${salarySign}`;
      if (burdenSign) html += ` <span style="color:#a06060">${burdenSign}</span>`;
      html += `</span>`;
    }
    if (tons > 0) {
      html += `<span class="panel-separator">|</span><span class="panel-stat bombs">💥 <span>${tons}k ${isAr ? 'طن' : 't'}</span></span>`;
    }
    html += `</div>`;

    // ── ALERTS ROW (deaths / bombing / bankruptcy) ────────────
    const hasAlerts = (autoDeaths && autoDeaths.length > 0) || (bombResult && bombResult.hit) || isBankrupt;
    if (hasAlerts) {
      html += `<div class="panel-alerts" dir="${isAr ? 'rtl' : 'ltr'}">`;
      if (autoDeaths && autoDeaths.length > 0) {
        autoDeaths.forEach(m => {
          html += `<span class="alert-death">✕ ${m.name}</span>`;
        });
      }
      if (bombResult && bombResult.hit) {
        const bombMsg = bombResult.severity === 'death'
          ? (isAr ? '💥 قصف — وفاة' : '💥 Strike — death')
          : bombResult.severity === 'injury'
          ? (isAr ? '💥 قصف — بتر' : '💥 Strike — amputation')
          : (isAr ? '💥 قصف — جروح' : '💥 Strike — wounds');
        html += `<span class="alert-bomb">${bombMsg}</span>`;
      }
      if (isBankrupt) {
        html += `<span class="alert-bankrupt">⚠ ${isAr ? 'إفلاس' : 'Bankrupt'}</span>`;
      }
      html += `</div>`;
    }

    // ── CHALLENGE CARDS ROW ───────────────────────────────────
    html += `<div class="challenges-row${allChallenges.length === 0 ? ' no-challenges' : ''}" dir="${isAr ? 'rtl' : 'ltr'}">`;
    if (allChallenges.length > 0) {
      allChallenges.forEach(challenge => {
        html += this.buildChallengeCard(challenge, isAr);
      });
    } else {
      html += `<span>${isAr ? 'لا تحديات هذا الشهر' : 'No challenges this month'}</span>`;
    }
    html += `</div>`;

    // ── NEXT MONTH BUTTON ─────────────────────────────────────
    const nextLabel = LANG.t('next_month');
    html += `<button class="btn-next-month" id="btn-next-month" ${allChallenges.length > 0 ? 'disabled' : ''}>${nextLabel} ▶</button>`;

    overlay.innerHTML = html;

    // Wire up choice buttons
    if (allChallenges.length > 0) {
      this.wireChoiceButtons(allChallenges);
    } else {
      document.getElementById('btn-next-month').disabled = false;
    }

    document.getElementById('btn-next-month').addEventListener('click', () => {
      overlay.classList.add('hidden');
      this.processChoicesAndAdvance(allChallenges);
    });
  }

  buildChallengeCard(challenge, isAr) {
    const title = isAr ? challenge.titleAr : challenge.titleEn;
    const story = isAr ? challenge.storyAr : challenge.storyEn;
    const realFact = isAr ? challenge.realFactAr : challenge.realFactEn;
    const theme = challenge.emotionalTheme || '';

    let choicesHtml = '<div class="challenge-choices">';
    challenge.choices.forEach((choice, i) => {
      const text = isAr ? choice.textAr : choice.textEn;
      choicesHtml += `<button class="choice-btn" data-challenge="${challenge.id}" data-choice="${i}">${text}</button>`;
    });
    choicesHtml += '</div>';

    return `
      <div class="challenge-card" id="card-${challenge.id}">
        ${theme ? `<div class="challenge-theme">${theme}</div>` : ''}
        <div class="challenge-title">${title}</div>
        <div class="challenge-story">${story}</div>
        ${choicesHtml}
        ${realFact ? `<div class="real-fact">${realFact}</div>` : ''}
      </div>
    `;
  }

  wireChoiceButtons(challenges) {
    const choicesMade = {};
    const totalChallenges = challenges.length;

    const checkAllMade = () => {
      const madeCount = Object.keys(choicesMade).length;
      const btn = document.getElementById('btn-next-month');
      if (btn) btn.disabled = madeCount < totalChallenges;
    };

    challenges.forEach(challenge => {
      const card = document.getElementById('card-' + challenge.id);
      if (!card) return;

      card.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const challengeId = btn.dataset.challenge;
          const choiceIdx = parseInt(btn.dataset.choice);

          // Mark selection
          card.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          choicesMade[challengeId] = choiceIdx;
          this.monthChoices[challengeId] = choiceIdx;

          // Show consequence message in card
          const ch = challenges.find(c => c.id === challengeId);
          if (ch && ch.choices[choiceIdx]) {
            const choice = ch.choices[choiceIdx];
            const isAr = LANG.current === 'ar';
            const msg = isAr ? choice.messageAr : choice.messageEn;
            let msgEl = card.querySelector('.choice-message');
            if (!msgEl) {
              msgEl = document.createElement('div');
              msgEl.className = 'choice-message';
              card.appendChild(msgEl);
            }
            msgEl.textContent = msg;
          }

          checkAllMade();
        });
      });
    });
  }

  processChoicesAndAdvance(challenges) {
    const deaths = [];

    challenges.forEach(challenge => {
      const choiceIdx = this.monthChoices[challenge.id];
      if (choiceIdx === undefined) return;

      const choice = challenge.choices[choiceIdx];
      if (!choice) return;

      // Apply one-time cost
      if (choice.oneTimeCost && choice.oneTimeCost > 0) {
        ResourceManager.pay(choice.oneTimeCost);
      } else if (choice.oneTimeCost && choice.oneTimeCost < 0) {
        // Negative cost = income (e.g., aid convoy)
        ResourceManager.receive(Math.abs(choice.oneTimeCost));
      }

      // Shelter setup cost
      if (choice.shelterSetupCost) {
        ResourceManager.pay(choice.shelterSetupCost);
      }

      // Add monthly burden
      if (choice.burdenId && choice.monthlyCost > 0) {
        ResourceManager.addMonthlyBurden(
          choice.burdenId,
          choice.monthlyCost,
          choice.burdenLabelAr || '',
          choice.burdenLabelEn || ''
        );
      }

      // Work hours lost
      if (choice.workHoursLost > 0) {
        ResourceManager.workHours = Math.max(0, ResourceManager.workHours - choice.workHoursLost);
      }

      // Health effect (all alive)
      if (choice.healthEffect) {
        const causeOfDeath = choice.healthEffect < -50 ? 'injury' : 'disease';
        FamilyManager.applyToAll({ health: choice.healthEffect, causeOfDeath }, this.currentMonth);
      }

      // Children-only health
      if (choice.childrenOnly && choice.healthEffect) {
        FamilyManager.applyToChildren({ health: choice.healthEffect, causeOfDeath: 'starvation' }, this.currentMonth);
      }

      // Morale effect
      if (choice.moraleEffect) {
        FamilyManager.applyToAll({ morale: choice.moraleEffect }, this.currentMonth);
      }

      // Death risk
      if (choice.deathRisk > 0 && Math.random() < choice.deathRisk) {
        const died = FamilyManager.applyEffect('random', { health: -999, causeOfDeath: 'injury' }, this.currentMonth);
        if (died) deaths.push(died);
      }

      // Injury risk
      if (choice.injuryRisk > 0 && Math.random() < choice.injuryRisk) {
        FamilyManager.applyEffect('random', { injure: true }, this.currentMonth);
      }

      // Capture risk (for staying home)
      if (choice.captureRisk > 0 && Math.random() < choice.captureRisk) {
        if (FamilyManager.player) {
          FamilyManager.player.captured = true;
          FamilyManager.player.health = Math.max(0, FamilyManager.player.health - 40);
        }
      }

      // Monthly working death hazard addition
      if (choice.monthlyDeathHazard) {
        ResourceManager.monthlyDeathHazard = Math.min(0.5,
          ResourceManager.monthlyDeathHazard + choice.monthlyDeathHazard);
      }

      // Special consequences
      if (choice.consequence === 'work_stop') {
        ResourceManager.workActive = false;
        ResourceManager.workHours = 0;
      }
      if (choice.consequence === 'emigrate') {
        this.emigrated = true;
      }

      // Only mark as resolved if player chose a cost option (monthlyCost > 0)
      // Free option = stays pending for next month (challenge repeats)
      const isFreeCyclicChoice = choice && choice.monthlyCost === 0 && choice.oneTimeCost === 0 && challenge.recurring;
      if (isFreeCyclicChoice) {
        // Challenge will reappear next month — keep in pending
        this.pendingChallengeIds.add(challenge.id);
      } else {
        this.resolvedChallengeIds.add(challenge.id);
        if (this.pendingChallengeIds.has(challenge.id)) {
          this.pendingChallengeIds.delete(challenge.id);
        }
      }
    });

    // Remove pending burdens scheduled for this month
    if (this._pendingBurdenRemovals) {
      this._pendingBurdenRemovals = this._pendingBurdenRemovals.filter(r => {
        if (r.targetMonth <= this.currentMonth) {
          ResourceManager.removeMonthlyBurden(r.burdenId);
          return false;
        }
        return true;
      });
    }

    this.updateHUD();

    // Check emigration
    if (this.emigrated) {
      this.showEmigrationEnd();
      return;
    }

    // Handle deaths from choices
    if (deaths.length > 0) {
      this.showDeaths(deaths, 0, () => {
        if (FamilyManager.allDead()) {
          this.endGame(false);
        } else {
          this.advanceMonth();
        }
      });
    } else if (FamilyManager.allDead()) {
      this.endGame(false);
    } else {
      this.advanceMonth();
    }
  }

  advanceMonth() {
    if (this.currentMonth >= 36) {
      this.endGame(true);
      return;
    }
    this.currentMonth++;
    this.monthChoices = {};
    this.time.delayedCall(300, () => this.startMonth());
  }

  // ====================== DEATHS ======================

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

  // ====================== END GAME ======================

  showEmigrationEnd() {
    const overlay = document.getElementById('event-overlay');
    if (overlay) overlay.classList.add('hidden');
    const isAr = LANG.current === 'ar';
    this.endGame(true, 'emigrate');
  }

  endGame(completed, reason) {
    if (this.gameOver) return;
    this.gameOver = true;

    // Save replay config
    if (this.initialConfig) {
      try {
        localStorage.setItem('gazagame_replay_config', JSON.stringify(this.initialConfig));
      } catch(e) {}
    }

    const overlay = document.getElementById('event-overlay');
    if (overlay) overlay.classList.add('hidden');
    const hudOverlay = document.getElementById('hud-overlay');
    if (hudOverlay) hudOverlay.classList.add('hidden');

    this.scene.start('EndScene', {
      totalMonths: this.currentMonth,
      familyMembers: FamilyManager.members,
      playerName: FamilyManager.player ? FamilyManager.player.name : '',
      completed: !!completed,
      reason: reason || (completed ? 'survived' : 'died'),
      financialSnapshot: ResourceManager.snapshot(),
      emigrated: this.emigrated,
    });
  }

  // ====================== HUD ======================

  updateHUD() {
    this.updateFinancialPanel();
    this.updateFamilyPanel();
  }

  updateFinancialPanel() {
    const panel = document.getElementById('hud-resources');
    if (!panel) return;
    const isAr = LANG.current === 'ar';
    const snap = ResourceManager.snapshot();

    panel.innerHTML = `
      <div class="financial-panel" dir="${isAr ? 'rtl' : 'ltr'}">
        <div class="financial-row">
          <span class="financial-label">${LANG.t('savings')}:</span>
          <span class="financial-value ${snap.savings < 500 ? 'val-danger' : ''}">$${snap.savings.toLocaleString()}</span>
        </div>
        <div class="financial-row">
          <span class="financial-label">${LANG.t('salary')}:</span>
          <span class="financial-value">$${snap.salary.toLocaleString()}/${isAr ? 'شهر' : 'mo'}</span>
        </div>
        <div class="financial-row">
          <span class="financial-label">${LANG.t('monthly_burden')}:</span>
          <span class="financial-value ${snap.burden > snap.salary ? 'val-warn' : ''}">$${snap.burden.toLocaleString()}/${isAr ? 'شهر' : 'mo'}</span>
        </div>
        ${snap.debt > 0 ? `<div class="financial-row">
          <span class="financial-label">${LANG.t('debt')}:</span>
          <span class="financial-value val-warn">$${snap.debt.toLocaleString()}/$${snap.debtLimit.toLocaleString()}</span>
        </div>` : ''}
        <div class="financial-row">
          <span class="financial-label">${LANG.t('work_hours')}:</span>
          <span class="financial-value">${snap.workHours}/8</span>
        </div>
        <div class="financial-row">
          <span class="financial-label">${isAr ? 'متفجرات' : 'Explosives'}:</span>
          <span class="financial-value val-danger">${Math.round(this.cumulativeExplosivesTons / 1000)}K ${isAr ? 'طن' : 'tons'}</span>
        </div>
      </div>
    `;
  }

  updateFamilyPanel() {
    const panel = document.getElementById('hud-family');
    if (!panel) return;
    let html = '<div class="family-panel">';

    for (const m of FamilyManager.members) {
      const isDead = m.status === 'dead';
      const hp = Math.max(0, Math.min(100, m.health));
      const hpColor = hp > 60 ? '#6a9060' : hp > 30 ? '#c77a1a' : '#c0392b';

      html += `
        <div class="member-row${isDead ? ' member-dead' : ''}">
          <span class="member-name">${m.name}${isDead ? ' ✕' : ''}</span>
          <div class="health-bar"><div class="health-fill" style="width:${hp}%;background:${hpColor}"></div></div>
        </div>
      `;
    }
    html += '</div>';
    panel.innerHTML = html;
  }
}
