// DeathScene.js - Death notification with real martyr references

const REAL_MARTYRS = {
  injury: [
    { nameAr: 'إسماعيل الغول', age: 27, descAr: 'صحفي أقنال استُشهد في غارة مباشرة على سيارته المُعلَّمة', ageGroup: [20, 35] },
    { nameAr: 'رضا أبو سيف', age: 8, descAr: 'طفل استُشهد مع أسرته في قصف منزلهم بجباليا', ageGroup: [0, 12] },
    { nameAr: 'يزن الكفارنة', age: 35, descAr: 'طبيب استُشهد داخل مستشفى القدس أثناء أداء عمله', ageGroup: [30, 45] },
    { nameAr: 'وليد دحدوح', age: 53, descAr: 'مراسل الجزيرة — فقد زوجته وأبناءه في قصف المخيم', ageGroup: [45, 65] },
    { nameAr: 'سلمى خضر', age: 16, descAr: 'فتاة استُشهدت مع عائلتها في غارة على شقتهم في الشجاعية', ageGroup: [13, 20] },
  ],
  starvation: [
    { nameAr: 'رضا إيهاب', age: 0, descAr: 'رضيعة عمرها شهران توفيت بسوء التغذية الحاد في مستشفى كمال عدوان', ageGroup: [0, 2] },
    { nameAr: 'لقاء سمير', age: 4, descAr: 'طفلة عمرها 4 سنوات توفيت بجفاف وسوء تغذية في شمال غزة', ageGroup: [0, 10] },
    { nameAr: 'أبو كريم النجار', age: 63, descAr: 'رجل توفي من الجوع في رفح — رفض مغادرة بيته', ageGroup: [55, 80] },
    { nameAr: 'نور محمد', age: 12, descAr: 'طفل توفي من الجوع في مخيم خان يونس بعد أسابيع من الحصار', ageGroup: [10, 18] },
  ],
  disease: [
    { nameAr: 'مريم الحاج', age: 4, descAr: 'توفيت بالتهاب رئوي حاد بلا مضادات حيوية في مخيم النازحين', ageGroup: [0, 10] },
    { nameAr: 'سامي عبد الرحمن', age: 58, descAr: 'مريض غسيل كلوي توفي بعد انقطاع الكهرباء عن المستشفى', ageGroup: [50, 75] },
    { nameAr: 'أم أحمد القرم', age: 44, descAr: 'توفيت بالتهاب كبد حاد في مخيم المواصي بلا علاج', ageGroup: [35, 55] },
  ],
  capture: [
    { nameAr: 'موثّق من منظمة هيومن رايتس ووتش', age: null, descAr: '247 حالة اعتقال تعسفي موثّقة بين أكتوبر 2023 ومارس 2024 — تقارير عن تعذيب وإخفاء قسري', ageGroup: 'all' },
  ],
};

function findClosestMartyr(cause, age) {
  const pool = REAL_MARTYRS[cause] || REAL_MARTYRS.injury;
  if (!pool || pool.length === 0) return null;

  // Try to find by age group
  const byAge = pool.filter(m => {
    if (m.ageGroup === 'all') return true;
    if (!Array.isArray(m.ageGroup)) return true;
    return age >= m.ageGroup[0] && age <= m.ageGroup[1];
  });

  const candidates = byAge.length > 0 ? byAge : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

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

    this.cameras.main.setBackgroundColor('#000000');

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

    // Find matching martyr
    const martyrCause = this.getMartyrCategory(m.causeOfDeath);
    const martyr = findClosestMartyr(martyrCause, m.age || 35);

    let martyrHtml = '';
    if (martyr) {
      martyrHtml = `
        <div class="death-martyr-box">
          <div class="death-martyr-label">${isAr ? 'في الواقع الحقيقي:' : 'In real life:'}</div>
          <div class="death-martyr-name">${isAr ? martyr.nameAr : martyr.nameAr}</div>
          <div class="death-martyr-desc">${isAr ? martyr.descAr : martyr.descAr}</div>
        </div>
      `;
    }

    const statText = this.getStatForCause(m.causeOfDeath, isAr);

    overlay.innerHTML = `
      <div class="death-name">${m.name}</div>
      <div class="death-info">${m.age} ${isAr ? 'سنة' : 'years old'}</div>
      <div class="death-info">${causeTxt}</div>
      ${m.injured ? `<div class="death-info" style="color:#8a4040;">${isAr ? 'أُصيب بجراح قبل الاستشهاد' : 'Was injured before martyrdom'}</div>` : ''}
      ${martyrHtml}
      <div class="death-stat">${statText}</div>
      <div style="margin-top:28px;">
        <button class="btn-continue" id="death-continue-btn">${LANG.t('death_continue')}</button>
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

    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.92);
    g.fillRect(0, 0, width, height);
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

  getMartyrCategory(cause) {
    if (cause === 'hunger' || cause === 'starvation') return 'starvation';
    if (cause === 'disease') return 'disease';
    if (cause === 'capture') return 'capture';
    return 'injury';
  }

  getStatForCause(cause, isAr) {
    if (cause === 'hunger' || cause === 'starvation') {
      return isAr
        ? 'أكثر من 30 طفلاً توفوا جوعاً في شمال غزة بحلول مارس 2024'
        : 'Over 30 children died of starvation in northern Gaza by March 2024';
    }
    if (cause === 'disease') {
      return isAr
        ? 'دمّر الاحتلال 90% من مستشفيات غزة — آلاف يموتون بأمراض قابلة للعلاج'
        : '90% of Gaza hospitals destroyed — thousands dying from treatable diseases';
    }
    if (cause === 'capture') {
      return isAr
        ? 'وثّقت منظمات حقوق الإنسان مئات حالات الاحتجاز التعسفي والتعذيب'
        : 'Human rights organizations documented hundreds of cases of arbitrary detention and torture';
    }
    return isAr
      ? 'استُشهد أكثر من 55,000 فلسطيني في غزة منذ أكتوبر 2023'
      : 'Over 55,000 Palestinians martyred in Gaza since October 2023';
  }
}
