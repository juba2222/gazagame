// SetupScene.js - Game setup with DOM overlay

const JOB_TYPES = [
  { id: 'government',  nameAr: 'موظف حكومي', nameEn: 'Government Employee', multiplier: 1.0,  riskLevel: 'low',      descAr: 'دخل ثابت، خطر متوسط',    descEn: 'Stable income, medium risk' },
  { id: 'laborer',     nameAr: 'عامل يومي',  nameEn: 'Daily Laborer',       multiplier: 0.6,  riskLevel: 'medium',   descAr: 'دخل متغير، خطر أعلى',    descEn: 'Variable income, higher risk' },
  { id: 'medic',       nameAr: 'طبيب/مسعف', nameEn: 'Doctor / Medic',      multiplier: 1.3,  riskLevel: 'veryhigh', descAr: 'دخل أعلى، خطر شديد جداً', descEn: 'Higher income, very high risk' },
  { id: 'engineer',    nameAr: 'مهندس',      nameEn: 'Engineer',            multiplier: 1.2,  riskLevel: 'high',     descAr: 'دخل جيد، خطر عالٍ',      descEn: 'Good income, high risk' },
  { id: 'unemployed',  nameAr: 'عاطل',       nameEn: 'Unemployed',          multiplier: 0.0,  riskLevel: 'none',     descAr: 'بلا دخل، خطر أقل',       descEn: 'No income, lower risk' },
];

class SetupScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SetupScene' });
    this.memberCount = 0;
    this.selectedJob = 'government';
  }

  create() {
    const { width, height } = this.scale;

    // Dark background
    const g = this.add.graphics();
    g.fillStyle(0x05050a, 1);
    g.fillRect(0, 0, width, height);

    // Show the DOM overlay
    this.showSetupOverlay();
  }

  showSetupOverlay() {
    const overlay = document.getElementById('setup-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
      this.buildSetupForm(overlay);
    }
  }

  buildSetupForm(overlay) {
    overlay.innerHTML = '';

    const lang = LANG.current;
    const isAr = lang === 'ar';

    overlay.dir = isAr ? 'rtl' : 'ltr';

    // Check for replay config
    let replayConfig = null;
    try {
      const stored = localStorage.getItem('gazagame_replay_config');
      if (stored) replayConfig = JSON.parse(stored);
    } catch(e) {}

    // Replay button at top
    if (replayConfig) {
      const replayBtn = document.createElement('button');
      replayBtn.className = 'btn-replay';
      replayBtn.textContent = LANG.t('replay_btn');
      replayBtn.onclick = () => this.startGameWithConfig(replayConfig);
      overlay.appendChild(replayBtn);
    }

    // Title
    const title = document.createElement('div');
    title.className = 'setup-title';
    title.textContent = LANG.t('game_title');
    overlay.appendChild(title);

    const sub = document.createElement('div');
    sub.className = 'setup-subtitle';
    sub.textContent = LANG.t('game_subtitle');
    overlay.appendChild(sub);

    const warning = document.createElement('div');
    warning.className = 'setup-subtitle';
    warning.style.color = '#7a5050';
    warning.style.fontSize = '0.8rem';
    warning.style.borderTop = '1px solid rgba(232,224,208,0.08)';
    warning.style.paddingTop = '12px';
    warning.textContent = LANG.t('game_warning');
    overlay.appendChild(warning);

    // Form
    const form = document.createElement('div');
    form.className = 'setup-form';

    // Language toggle
    const langGroup = document.createElement('div');
    langGroup.className = 'form-group';
    const langLabel = document.createElement('div');
    langLabel.className = 'form-label';
    langLabel.textContent = LANG.t('setup_lang');
    const langRow = document.createElement('div');
    langRow.className = 'lang-toggle-row';

    const btnAr = document.createElement('button');
    btnAr.className = 'lang-btn' + (lang === 'ar' ? ' active' : '');
    btnAr.textContent = 'عربي';
    btnAr.onclick = () => { LANG.current = 'ar'; setLang('ar'); this.buildSetupForm(overlay); };

    const btnEn = document.createElement('button');
    btnEn.className = 'lang-btn' + (lang === 'en' ? ' active' : '');
    btnEn.textContent = 'English';
    btnEn.onclick = () => { LANG.current = 'en'; setLang('en'); this.buildSetupForm(overlay); };

    langRow.appendChild(btnAr);
    langRow.appendChild(btnEn);
    langGroup.appendChild(langLabel);
    langGroup.appendChild(langRow);
    form.appendChild(langGroup);

    // Player name
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    const nameLabel = document.createElement('label');
    nameLabel.className = isAr ? 'form-label ar' : 'form-label';
    nameLabel.textContent = LANG.t('your_name');
    const nameInput = document.createElement('input');
    nameInput.className = 'form-input';
    nameInput.id = 'player-name';
    nameInput.placeholder = LANG.t('your_name_placeholder');
    nameInput.type = 'text';
    if (replayConfig) nameInput.value = replayConfig.playerName || '';
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    form.appendChild(nameGroup);

    // Profession/Job
    const jobGroup = document.createElement('div');
    jobGroup.className = 'form-group';
    const jobLabel = document.createElement('label');
    jobLabel.className = isAr ? 'form-label ar' : 'form-label';
    jobLabel.textContent = LANG.t('your_job');
    const jobInput = document.createElement('input');
    jobInput.className = 'form-input';
    jobInput.id = 'player-job';
    jobInput.placeholder = LANG.t('your_job_placeholder');
    jobInput.type = 'text';
    if (replayConfig) jobInput.value = replayConfig.profession || '';
    jobGroup.appendChild(jobLabel);
    jobGroup.appendChild(jobInput);
    form.appendChild(jobGroup);

    // Location
    const locGroup = document.createElement('div');
    locGroup.className = 'form-group';
    const locLabel = document.createElement('label');
    locLabel.className = isAr ? 'form-label ar' : 'form-label';
    locLabel.textContent = LANG.t('location_label');
    const locSelect = document.createElement('select');
    locSelect.className = 'form-select';
    locSelect.id = 'player-location';
    const locations = [
      { val: 'north', key: 'north' },
      { val: 'gaza', key: 'gaza' },
      { val: 'central', key: 'central' },
      { val: 'khanyunis', key: 'khanyunis' },
      { val: 'rafah', key: 'rafah' },
    ];
    locations.forEach(loc => {
      const opt = document.createElement('option');
      opt.value = loc.val;
      opt.textContent = LANG.t(loc.key);
      if (replayConfig && replayConfig.location === loc.val) opt.selected = true;
      locSelect.appendChild(opt);
    });
    locGroup.appendChild(locLabel);
    locGroup.appendChild(locSelect);
    form.appendChild(locGroup);

    // Job type selector
    const jobTypeGroup = document.createElement('div');
    jobTypeGroup.className = 'form-group';
    const jobTypeLabel = document.createElement('label');
    jobTypeLabel.className = isAr ? 'form-label ar' : 'form-label';
    jobTypeLabel.textContent = isAr ? 'نوع العمل' : 'Job Type';
    jobTypeGroup.appendChild(jobTypeLabel);

    const jobCards = document.createElement('div');
    jobCards.className = 'job-cards';
    jobCards.id = 'job-cards';

    const defaultJob = (replayConfig && replayConfig.jobId) || this.selectedJob || 'government';
    JOB_TYPES.forEach(jt => {
      const card = document.createElement('div');
      card.className = 'job-card' + (jt.id === defaultJob ? ' selected' : '');
      card.dataset.job = jt.id;
      const nameText = isAr ? jt.nameAr : jt.nameEn;
      const descText = isAr ? jt.descAr : jt.descEn;
      const multLabel = jt.multiplier === 0
        ? (isAr ? 'بلا راتب' : 'No salary')
        : 'x' + jt.multiplier + (isAr ? ' الراتب' : ' salary');
      card.innerHTML = `<div class="job-card-name">${nameText}</div><div class="job-card-desc">${descText}</div><div class="job-card-mult">${multLabel}</div>`;
      card.onclick = () => {
        document.querySelectorAll('.job-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedJob = jt.id;
      };
      jobCards.appendChild(card);
    });

    jobTypeGroup.appendChild(jobCards);
    form.appendChild(jobTypeGroup);

    // Financial class selector
    const fcGroup = document.createElement('div');
    fcGroup.className = 'form-group';
    const fcLabel = document.createElement('label');
    fcLabel.className = isAr ? 'form-label ar' : 'form-label';
    fcLabel.textContent = LANG.t('financial_class');
    fcGroup.appendChild(fcLabel);

    const fcCards = document.createElement('div');
    fcCards.className = 'fc-cards';
    fcCards.id = 'fc-cards';

    const defaultFc = (replayConfig && replayConfig.financialClass) || 'middle';
    const fcList = ['poor', 'middle', 'comfortable', 'rich'];
    fcList.forEach(fc => {
      const info = FINANCIAL_CLASSES[fc];
      const card = document.createElement('div');
      card.className = 'fc-card' + (fc === defaultFc ? ' selected' : '');
      card.dataset.fc = fc;
      const nameText = isAr ? info.nameAr : info.nameEn;
      const descText = isAr ? info.descAr : info.descEn;
      card.innerHTML = `<div class="fc-name">${nameText}</div><div class="fc-desc">${descText}</div>`;
      card.onclick = () => {
        document.querySelectorAll('.fc-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      };
      fcCards.appendChild(card);
    });

    fcGroup.appendChild(fcCards);
    form.appendChild(fcGroup);

    // Divider
    const div1 = document.createElement('div');
    div1.className = 'divider';
    form.appendChild(div1);

    // Family members section
    const famHeader = document.createElement('div');
    famHeader.className = 'section-header';
    famHeader.textContent = LANG.t('add_family');
    form.appendChild(famHeader);

    const memberList = document.createElement('div');
    memberList.id = 'family-members-list';
    form.appendChild(memberList);

    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add-member';
    addBtn.textContent = LANG.t('add_member');
    addBtn.onclick = () => {
      const list = document.getElementById('family-members-list');
      if (list.children.length >= 6) {
        addBtn.textContent = LANG.t('max_members');
        return;
      }
      this.addMemberRow(list);
    };
    form.appendChild(addBtn);

    // Divider
    const div2 = document.createElement('div');
    div2.className = 'divider';
    form.appendChild(div2);

    // Start button
    const startBtn = document.createElement('button');
    startBtn.className = 'btn-start';
    startBtn.textContent = LANG.t('start_game');
    startBtn.onclick = () => this.startGame();
    form.appendChild(startBtn);

    overlay.appendChild(form);

    // Pre-populate family from replay config or add a default row
    const list = document.getElementById('family-members-list');
    if (replayConfig && replayConfig.familyData && replayConfig.familyData.length > 0) {
      replayConfig.familyData.forEach(fd => this.addMemberRow(list, fd));
    } else {
      this.addMemberRow(list);
    }
  }

  addMemberRow(list, prefill) {
    const isAr = LANG.current === 'ar';
    const row = document.createElement('div');
    row.className = 'family-member-row';

    const nameInput = document.createElement('input');
    nameInput.className = 'form-input';
    nameInput.placeholder = LANG.t('member_name');
    nameInput.type = 'text';
    nameInput.dataset.field = 'name';
    if (prefill && prefill.name) nameInput.value = prefill.name;

    const ageInput = document.createElement('input');
    ageInput.className = 'form-input';
    ageInput.placeholder = LANG.t('member_age');
    ageInput.type = 'number';
    ageInput.min = 1;
    ageInput.max = 99;
    ageInput.dataset.field = 'age';
    if (prefill && prefill.age) ageInput.value = prefill.age;

    const relSelect = document.createElement('select');
    relSelect.className = 'form-select';
    relSelect.dataset.field = 'relation';
    const relations = [
      { val: 'spouse', key: 'spouse' },
      { val: 'child', key: 'child' },
      { val: 'parent', key: 'parent' },
      { val: 'sibling', key: 'sibling' },
    ];
    relations.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.val;
      opt.textContent = LANG.t(r.key);
      if (prefill && prefill.relation === r.val) opt.selected = true;
      relSelect.appendChild(opt);
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove-member';
    removeBtn.textContent = '×';
    removeBtn.onclick = () => row.remove();

    row.appendChild(nameInput);
    row.appendChild(ageInput);
    row.appendChild(relSelect);
    row.appendChild(removeBtn);
    list.appendChild(row);
  }

  startGame() {
    const nameEl = document.getElementById('player-name');
    const jobEl = document.getElementById('player-job');
    const locEl = document.getElementById('player-location');
    const selectedFcCard = document.querySelector('.fc-card.selected');
    const selectedJobCard = document.querySelector('.job-card.selected');

    const playerName = (nameEl && nameEl.value.trim()) || 'أبو كريم';
    const profession = (jobEl && jobEl.value.trim()) || '';
    const location = locEl ? locEl.value : 'gaza';
    const financialClass = selectedFcCard ? selectedFcCard.dataset.fc : 'middle';
    const jobId = selectedJobCard ? selectedJobCard.dataset.job : (this.selectedJob || 'government');

    // Collect family members
    const memberRows = document.querySelectorAll('#family-members-list .family-member-row');
    const familyData = [];
    memberRows.forEach(row => {
      const name = row.querySelector('[data-field="name"]')?.value?.trim();
      const age = row.querySelector('[data-field="age"]')?.value || 30;
      const relation = row.querySelector('[data-field="relation"]')?.value || 'sibling';
      if (name) {
        familyData.push({ name, age: parseInt(age), relation });
      }
    });

    const config = { playerName, profession, location, financialClass, familyData, jobId };
    this.startGameWithConfig(config);
  }

  startGameWithConfig(config) {
    const { playerName, profession, location, financialClass, familyData, jobId } = config;

    // Resolve job type
    const jobType = JOB_TYPES.find(j => j.id === jobId) || JOB_TYPES[0];
    const jobMultiplier = jobType.multiplier;

    // Init game systems
    FamilyManager.init(playerName || 'أبو كريم', location, financialClass, familyData || [], profession || '');
    FamilyManager.job = jobId || 'government';
    ResourceManager.init(financialClass, jobMultiplier);
    ResourceManager.workRiskLevel = jobType.riskLevel;

    // Hide overlay
    const overlay = document.getElementById('setup-overlay');
    if (overlay) overlay.classList.add('hidden');

    // Start game scene
    this.scene.start('GameScene', { initialConfig: config });
  }
}
