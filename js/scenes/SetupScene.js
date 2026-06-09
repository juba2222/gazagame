// SetupScene.js - Game setup with DOM overlay

class SetupScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SetupScene' });
    this.memberCount = 0;
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
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    form.appendChild(nameGroup);

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
      locSelect.appendChild(opt);
    });
    locGroup.appendChild(locLabel);
    locGroup.appendChild(locSelect);
    form.appendChild(locGroup);

    // Living standard
    const stdGroup = document.createElement('div');
    stdGroup.className = 'form-group';
    const stdLabel = document.createElement('label');
    stdLabel.className = isAr ? 'form-label ar' : 'form-label';
    stdLabel.textContent = LANG.t('living_standard');
    const stdSelect = document.createElement('select');
    stdSelect.className = 'form-select';
    stdSelect.id = 'living-standard';
    const standards = [
      { val: 'poor', key: 'poor' },
      { val: 'middle', key: 'middle' },
      { val: 'welloff', key: 'welloff' },
    ];
    standards.forEach(std => {
      const opt = document.createElement('option');
      opt.value = std.val;
      opt.textContent = LANG.t(std.key);
      stdSelect.appendChild(opt);
    });
    stdGroup.appendChild(stdLabel);
    stdGroup.appendChild(stdSelect);
    form.appendChild(stdGroup);

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

    // Add one default family member row
    const list = document.getElementById('family-members-list');
    this.addMemberRow(list);
  }

  addMemberRow(list) {
    const isAr = LANG.current === 'ar';
    const row = document.createElement('div');
    row.className = 'family-member-row';

    const nameInput = document.createElement('input');
    nameInput.className = 'form-input';
    nameInput.placeholder = LANG.t('member_name');
    nameInput.type = 'text';
    nameInput.dataset.field = 'name';

    const ageInput = document.createElement('input');
    ageInput.className = 'form-input';
    ageInput.placeholder = LANG.t('member_age');
    ageInput.type = 'number';
    ageInput.min = 1;
    ageInput.max = 99;
    ageInput.dataset.field = 'age';

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
    const locEl = document.getElementById('player-location');
    const stdEl = document.getElementById('living-standard');

    const playerName = nameEl ? nameEl.value.trim() : 'أبو كريم';
    const location = locEl ? locEl.value : 'gaza';
    const livingStandard = stdEl ? stdEl.value : 'middle';

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

    // Init game systems
    FamilyManager.init(playerName || 'أبو كريم', location, livingStandard, familyData);
    ResourceManager.init(livingStandard);

    // Hide overlay
    const overlay = document.getElementById('setup-overlay');
    if (overlay) overlay.classList.add('hidden');

    // Start game scene
    this.scene.start('GameScene');
  }
}
