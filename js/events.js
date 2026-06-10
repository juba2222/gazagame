// Real documented events from Gaza war Oct 2023 - Jan 2025
// Sources: UN OCHA, WFP, IPC, WHO, UNICEF, HRW, Amnesty International

const GAME_PHASES = [
  {
    id: 1, nameAr: 'القصف المكثف', nameEn: 'Intense Bombardment',
    period: 'أكتوبر - نوفمبر 2023', periodEn: 'October - November 2023',
    duration: 14, bgColor: '#1a0a0a', skyColor: '#3d0000',
    danger: { north: 10, gaza: 8, central: 5, khanyunis: 3, rafah: 2 },
    foodDecayRate: 4, waterDecayRate: 5, strikeChance: 0.40,
    injuryChance: 0.20, homeDestroyChance: 0.25, medicineAvail: 0.15,
    aidTrucksPerDay: 0, flourPriceUSD: 7,
    realStatAr: 'في أكتوبر 2023 أُصدر أمر إخلاء لمليون ومئة ألف مواطن خلال 24 ساعة',
    realStatEn: 'In October 2023, 1.1 million Gazans ordered to evacuate within 24 hours'
  },
  {
    id: 2, nameAr: 'النزوح الكبير', nameEn: 'The Great Displacement',
    period: 'نوفمبر - ديسمبر 2023', periodEn: 'November - December 2023',
    duration: 10, bgColor: '#0d0d1a', skyColor: '#1a1a3d',
    danger: { north: 10, gaza: 9, central: 6, khanyunis: 4, rafah: 2 },
    foodDecayRate: 5, waterDecayRate: 5, strikeChance: 0.35,
    injuryChance: 0.18, homeDestroyChance: 0.35, medicineAvail: 0.10,
    aidTrucksPerDay: 200, flourPriceUSD: 100,
    realStatAr: '1.7 مليون نازح - 75% من سكان غزة بحلول فبراير 2024',
    realStatEn: '1.7 million displaced — 75% of Gaza population by February 2024'
  },
  {
    id: 3, nameAr: 'الحصار والمجاعة', nameEn: 'Siege & Famine',
    period: 'ديسمبر 2023 - فبراير 2024', periodEn: 'December 2023 - February 2024',
    duration: 21, bgColor: '#0a0a0a', skyColor: '#1a1000',
    danger: { north: 10, gaza: 10, central: 7, khanyunis: 5, rafah: 3 },
    foodDecayRate: 7, waterDecayRate: 6, strikeChance: 0.35,
    injuryChance: 0.22, homeDestroyChance: 0.20, medicineAvail: 0.05,
    aidTrucksPerDay: 57, flourPriceUSD: 410, faminePressure: true,
    realStatAr: 'مارس 2024: 31% من الأطفال دون عامين يعانون سوء تغذية حاداً في الشمال',
    realStatEn: 'March 2024: 31% of children under 2 in North Gaza acutely malnourished'
  },
  {
    id: 4, nameAr: 'اجتياح رفح', nameEn: 'Rafah Invasion',
    period: 'مايو 2024', periodEn: 'May 2024',
    duration: 14, bgColor: '#1a0800', skyColor: '#3d1500',
    danger: { north: 8, gaza: 8, central: 6, khanyunis: 7, rafah: 10 },
    foodDecayRate: 6, waterDecayRate: 6, strikeChance: 0.45,
    injuryChance: 0.28, homeDestroyChance: 0.50, medicineAvail: 0.05,
    aidTrucksPerDay: 6, flourPriceUSD: 200,
    realStatAr: '26 مايو 2024: قصف مخيم تل السلطان - أُعلن آمناً قبل أسبوع - 45 قتيلاً',
    realStatEn: 'May 26 2024: Tel al-Sultan bombed — declared safe one week earlier. 45 killed'
  },
  {
    id: 5, nameAr: 'هدنة جزئية', nameEn: 'Partial Ceasefire',
    period: 'يونيو - يوليو 2024', periodEn: 'June - July 2024',
    duration: 7, bgColor: '#0a0d0a', skyColor: '#0d1a0d',
    danger: { north: 6, gaza: 6, central: 4, khanyunis: 5, rafah: 7 },
    foodDecayRate: 5, waterDecayRate: 5, strikeChance: 0.25,
    injuryChance: 0.15, homeDestroyChance: 0.15, medicineAvail: 0.15,
    aidTrucksPerDay: 69, flourPriceUSD: 150, ceasefire: true,
    realStatAr: 'يوليو 2024: الأمم المتحدة تعلن رسمياً امتداد المجاعة لكامل القطاع',
    realStatEn: 'July 2024: UN formally declared famine spread throughout entire Gaza Strip'
  },
  {
    id: 6, nameAr: 'عودة القصف', nameEn: 'Bombardment Returns',
    period: 'أغسطس - أكتوبر 2024', periodEn: 'August - October 2024',
    duration: 14, bgColor: '#1a0505', skyColor: '#2d0a0a',
    danger: { north: 9, gaza: 9, central: 9, khanyunis: 9, rafah: 9 },
    foodDecayRate: 8, waterDecayRate: 7, strikeChance: 0.50,
    injuryChance: 0.30, homeDestroyChance: 0.40, medicineAvail: 0.04,
    aidTrucksPerDay: 69, flourPriceUSD: 300,
    realStatAr: 'سبتمبر 2024: 83% من المساعدات الغذائية محجوبة. الطحين بالشمال: 1000 دولار/كيس',
    realStatEn: 'September 2024: 83% of food aid blocked. North Gaza flour: $1,000 per bag'
  },
  {
    id: 7, nameAr: 'لا مكان آمن', nameEn: 'Nowhere Is Safe',
    period: 'أكتوبر 2024+', periodEn: 'October 2024+',
    duration: 14, bgColor: '#050505', skyColor: '#0a0a0a',
    danger: { north: 10, gaza: 10, central: 10, khanyunis: 10, rafah: 10 },
    foodDecayRate: 10, waterDecayRate: 8, strikeChance: 0.55,
    injuryChance: 0.35, homeDestroyChance: 0.55, medicineAvail: 0.02,
    aidTrucksPerDay: 45, flourPriceUSD: 1000, faminePressure: true,
    realStatAr: 'سبتمبر 2024: 66% من مباني غزة تضررت أو دُمرت — أكثر من 52 ألف مبنى',
    realStatEn: 'September 2024: 66% of Gaza buildings damaged or destroyed — 52,000+ structures'
  },
  {
    id: 8, nameAr: 'هدنة يناير', nameEn: 'January Ceasefire',
    period: 'يناير 2025', periodEn: 'January 2025',
    duration: 7, bgColor: '#050a05', skyColor: '#0a140a',
    danger: { north: 2, gaza: 2, central: 2, khanyunis: 2, rafah: 2 },
    foodDecayRate: 2, waterDecayRate: 2, strikeChance: 0.05,
    injuryChance: 0.03, homeDestroyChance: 0.02, medicineAvail: 0.60,
    aidTrucksPerDay: 500, flourPriceUSD: 20, ceasefire: true, finalPhase: true,
    realStatAr: 'يناير 2025: عاد 376 ألف نازح للشمال — وجدوا ركاماً. 92% من الطرق محطمة',
    realStatEn: 'January 2025: 376,000 returned north to find rubble — 92% of main roads destroyed'
  }
];

// Helper: pick random event for current phase and location
function pickRandomEvent(phaseId, location, recentIds) {
  const pool = GAME_EVENTS.filter(e => {
    if (!e.phase.includes(phaseId)) return false;
    if (e.locations !== 'all' && !e.locations.includes(location)) return false;
    if (e.forced && e.triggerDay) return false; // forced events handled separately
    if (recentIds.includes(e.id)) return false;
    return true;
  });
  if (!pool.length) return GAME_EVENTS.find(e => e.phase.includes(phaseId)) || null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Helper: get forced event for a specific day in a phase
function getForcedEvent(phaseId, dayWithinPhase, location) {
  return GAME_EVENTS.find(e =>
    e.phase.includes(phaseId) &&
    e.forced === true &&
    e.triggerDay === dayWithinPhase &&
    (e.locations === 'all' || e.locations.includes(location))
  ) || null;
}

const GAME_EVENTS = [
  // PHASE 1
  {
    id: 'p1_evacuation_order', phase: [1], locations: 'all', triggerDay: 1, forced: true,
    titleAr: 'أمر الإخلاء', titleEn: 'Evacuation Order',
    storyAr: 'الساعة 6 صباحاً. سقطت منشورات من الطائرات:\n"على سكان شمال غزة الانتقال فوراً جنوب وادي غزة.\nلديكم 24 ساعة."\n\nمليون ومئة ألف إنسان يواجهون نفس القرار.',
    storyEn: '6 AM. Leaflets from planes:\n"All residents of Northern Gaza must move south of Wadi Gaza immediately.\nYou have 24 hours."\n\n1.1 million people face the same decision.',
    choices: [
      {
        textAr: 'نرحل الآن', textEn: 'Leave now',
        consequences: { food: -3, water: -2, money: -100, displacement: true, newLocation: 'central',
          messageAr: 'غادرتم. الطريق مكتظ بمئات الآلاف.', messageEn: 'You fled. Road packed with hundreds of thousands.' }
      },
      {
        textAr: 'نبقى في بيتنا', textEn: 'Stay — our home',
        consequences: { dangerIncrease: 3,
          messageAr: 'بقيتم. الحي يفرغ حولكم. الخطر يتصاعد.', messageEn: 'You stayed. Neighborhood empties. Danger rises.' }
      }
    ],
    realFactAr: 'الأمم المتحدة: الأمر "مستحيل تنفيذه بأمان"',
    realFactEn: 'UN called the order "impossible to implement safely"'
  },
  {
    id: 'p1_jabalia_strike', phase: [1], locations: ['north','gaza'], triggerDay: 3, forced: false,
    titleAr: 'غارة على مخيم جباليا', titleEn: 'Jabalia Camp Airstrike',
    storyAr: '31 أكتوبر. انفجار ضخم.\nالغارة استهدفت جباليا — أكثر المناطق اكتظاظاً.\nمبانٍ دُمرت بالكامل. الجيران يهرعون.',
    storyEn: 'October 31. Massive explosion.\nStrike on Jabalia — most densely populated area.\nBuildings completely destroyed. Neighbors rushing.',
    choices: [
      {
        textAr: 'اذهب للمساعدة', textEn: 'Go help with rescue',
        consequences: { food: -1, water: -1, medicine: -1,
          memberEffects: [{ target: 'self', health: -15 }], morale: +10,
          messageAr: 'ساعدت في إنقاذ عائلة. لكن تعرضت لخطر الغارات الثانية.',
          messageEn: 'Helped save a family. But exposed to secondary strikes.' }
      },
      {
        textAr: 'ابقَ — غارات ثانية قادمة', textEn: 'Stay inside — secondary strikes',
        consequences: { morale: -15,
          messageAr: 'بقيت. سمعت أصوات البحث عن الناجين طوال الليل.',
          messageEn: 'Stayed. Heard search for survivors all night.' }
      }
    ],
    realFactAr: '31 أكتوبر - 1 نوفمبر 2023: أكثر من 130 قتيلاً في غارتين خلال 24 ساعة',
    realFactEn: 'Oct 31 - Nov 1, 2023: 130+ killed in two strikes within 24 hours'
  },
  {
    id: 'p1_hospital_fuel', phase: [1], locations: 'all', triggerDay: 5, forced: false,
    titleAr: 'المستشفى بلا وقود', titleEn: 'Hospital Out of Fuel',
    storyAr: 'وزارة الصحة: المولدات ستتوقف خلال 48 ساعة.\n36 طفلاً حديث الولادة في الحاضنات.\nأحد أفراد أسرتك مصاب في المستشفى.',
    storyEn: 'Health Ministry: Generators stopping in 48 hours.\n36 newborns in incubators.\nA family member is injured at the hospital.',
    choices: [
      {
        textAr: 'أحضره للبيت', textEn: 'Bring them home',
        consequences: { food: -1, water: -1, money: -50,
          memberEffects: [{ target: 'random', health: +10 }],
          messageAr: 'أخرجته. أسلم من مستشفى بلا كهرباء.',
          messageEn: 'Brought home. Safer than hospital without power.' }
      },
      {
        textAr: 'يحتاج رعاية طبية', textEn: 'Needs medical care — stay',
        consequences: { memberEffects: [{ target: 'random', health: -20 }],
          messageAr: 'انقطعت الكهرباء ليلاً. حالته تدهورت.',
          messageEn: 'Power cut at night. Condition worsened.' }
      }
    ],
    realFactAr: '12 نوفمبر 2023: وفاة مريضَي ICU و6 أطفال خدج بعد انقطاع كهرباء مستشفى الشفاء',
    realFactEn: 'Nov 12, 2023: 2 ICU patients and 6 premature infants died when Al-Shifa lost power'
  },
  {
    id: 'p1_water_cut', phase: [1], locations: 'all', triggerDay: 7, forced: true, noChoice: true,
    titleAr: 'انقطاع المياه', titleEn: 'Water Cut Off',
    storyAr: 'توقف الماء تماماً.\nمحطة التحلية أُغلقت.\nخط المياه الإسرائيلي انخفض 78%.\nما تبقى يكفي يومين.',
    storyEn: 'Water completely stopped.\nDesalination plant shut down.\nIsraeli pipeline reduced 78%.\nWhat remains: two days.',
    consequences: { water: -8, memberEffects: [{ target: 'all', health: -5 }],
      messageAr: 'متوسط المياه: 3 لترات/شخص/يوم. الحد الأدنى للبقاء: 15 لتراً.',
      messageEn: 'Available water: 3L/person/day. WHO survival minimum: 15L.' },
    realFactAr: 'نوفمبر 2023: انخفاض 94% في إمداد المياه. أطفال يحصلون على 1.5 لتر/يوم',
    realFactEn: 'November 2023: 94% drop in water supply. Children got only 1.5L per day'
  },

  // PHASE 2
  {
    id: 'p2_ceasefire_week', phase: [2], locations: 'all', triggerDay: 2, forced: true,
    titleAr: 'هدنة!', titleEn: 'Ceasefire!',
    storyAr: '24 نوفمبر. صمت مفاجئ.\nالراديو: هدنة إنسانية 4 أيام.\nالناس يخرجون للمرة الأولى منذ أسابيع.\nهل تذهب لبيتك في الشمال؟',
    storyEn: 'November 24. Sudden silence.\nRadio: 4-day humanitarian pause.\nPeople outside for first time in weeks.\nDo you go check your home in the north?',
    choices: [
      {
        textAr: 'أذهب لأرى بيتي', textEn: 'Go check my home',
        consequences: { food: +3, water: +2, money: +200, medicine: +1,
          messageAr: 'وصلت. نصفه مدمر. وجدت طعاماً ومالاً مخبأً.',
          messageEn: 'Reached home. Half destroyed. Found hidden food and money.' }
      },
      {
        textAr: 'أبقى — الهدنة مؤقتة', textEn: 'Stay — truce is temporary',
        consequences: { food: +1, water: +1, morale: +5,
          messageAr: 'في 1 ديسمبر استُؤنف القصف فوراً.',
          messageEn: 'On December 1 bombardment resumed immediately.' }
      }
    ],
    realFactAr: 'الهدنة (24 نوف - 1 ديس 2023): مساعدات لـ120,000 شخص. إسرائيل منعت العودة الجماعية للشمال',
    realFactEn: 'Nov 24 - Dec 1 truce: Aid to 120,000+. Israel prevented mass return to the north'
  },
  {
    id: 'p2_displacement_road', phase: [2], locations: ['north','gaza'], triggerDay: 4, forced: false,
    titleAr: 'طريق النزوح', titleEn: 'The Displacement Road',
    storyAr: 'قررت النزوح جنوباً.\nمئات الآلاف يسيرون تحت الشمس.\nطفلك يبكي من العطش.',
    storyEn: 'Heading south.\nHundreds of thousands walking under the sun.\nYour child crying from thirst.',
    choices: [
      {
        textAr: 'الطريق الرئيسي (أسرع لكن مكشوف)', textEn: 'Main road (faster but exposed)',
        consequences: { food: -3, water: -4, money: -50,
          memberEffects: [{ target: 'children', health: -10 }], displacement: true, newLocation: 'central',
          messageAr: 'وصلتم بعد 8 ساعات. الأطفال منهكون.',
          messageEn: 'Arrived after 8 hours walking. Children exhausted.' }
      },
      {
        textAr: 'انتظر وابحث عن سيارة', textEn: 'Wait and find a vehicle',
        consequences: { food: -2, water: -2, money: -300, displacement: true, newLocation: 'central',
          messageAr: 'دفعتم 300 دولار لسائق. وصلتم بأمان نسبي.',
          messageEn: 'Paid $300 to a driver. Arrived relatively safely.' }
      }
    ],
    realFactAr: 'وثّقت منظمات حقوقية إطلاق نار على طرق الإخلاء خلال هذه الفترة',
    realFactEn: 'Human rights organizations documented fire on evacuation routes during this period'
  },
  {
    id: 'p2_lost_everything', phase: [2], locations: 'all', triggerDay: 6, forced: true, noChoice: true,
    titleAr: 'خسارة كل شيء', titleEn: 'Everything Lost',
    storyAr: 'وصلتم لمكان النزوح.\nغرفة مع ثلاث عائلات أخرى.\nلا مطبخ. لا حمام خاص.\n\nكل ما جمعتموه — خلفتموه.',
    storyEn: 'Arrived at displacement shelter.\nOne room with three other families.\nNo kitchen. No private bathroom.\n\nEverything you built — left behind.',
    consequences: { food: -5, water: -3, money: -200, morale: -20,
      memberEffects: [{ target: 'all', morale: -15 }],
      messageAr: 'الأطفال لا يفهمون لماذا تركوا ألعابهم. الكبار يصمتون.',
      messageEn: 'Children don\'t understand why they left their toys. Adults go silent.' },
    realFactAr: 'كثافة المواصي (المنطقة الآمنة): 34,000 شخص/كم² مقابل 1,200 قبل الحرب',
    realFactEn: 'Al-Mawasi density reached 34,000/sq km — vs 1,200 before the war'
  },

  // PHASE 3
  {
    id: 'p3_flour_price', phase: [3], locations: 'all', triggerDay: 2, forced: false,
    titleAr: 'السوق السوداء', titleEn: 'The Black Market',
    storyAr: 'شخص يبيع طحيناً.\nكيس 25 كيلو بـ400 دولار.\nقبل الحرب: 7 دولارات.',
    storyEn: 'Someone selling flour.\n25kg bag for $400.\nBefore the war: $7.',
    choices: [
      {
        textAr: 'اشترِ بأي ثمن', textEn: 'Buy at any price',
        consequences: { food: +5, money: -400,
          messageAr: 'اشتريت. المدخرات تنفد. يكفي أسبوعين.',
          messageEn: 'Bought. Savings dwindling. Lasts two weeks.' }
      },
      {
        textAr: 'سننتظر المساعدات', textEn: 'Wait for aid',
        consequences: { memberEffects: [{ target: 'all', hunger: +15 }],
          messageAr: 'المساعدات لم تصل. الجوع يشتد.',
          messageEn: 'Aid didn\'t come. Hunger intensifies.' }
      }
    ],
    realFactAr: 'مارس 2024: الطحين في شمال غزة 410$/كيس — في رفح 19$ فقط',
    realFactEn: 'March 2024: Flour in North Gaza $410/bag — in Rafah only $19'
  },
  {
    id: 'p3_aid_queue', phase: [3], locations: 'all', triggerDay: 5, forced: false,
    titleAr: 'طابور المساعدات', titleEn: 'The Aid Queue',
    storyAr: 'توزيع مساعدات قرب شارع الرشيد.\nالطابور يمتد لكيلومترات.\nالطيران الحربي يحلق فوق المنطقة.',
    storyEn: 'Aid distribution near Al-Rashid Street.\nQueue stretches for kilometers.\nMilitary aircraft circling overhead.',
    choices: [
      {
        textAr: 'اذهب — الأسرة جائعة', textEn: 'Join queue — family starving',
        consequences: { food: +4, water: +2,
          memberEffects: [{ target: 'self', health: -20 }],
          messageAr: 'حصلت على المساعدات. انتظرت 5 ساعات تحت الخطر.',
          messageEn: 'Got aid. Waited 5 hours under threat.' }
      },
      {
        textAr: 'خطير جداً', textEn: 'Too dangerous',
        consequences: { memberEffects: [{ target: 'all', hunger: +20 }],
          messageAr: 'بقيت آمناً. الجوع يشتد. الأطفال يبكون.',
          messageEn: 'Stayed safe. Hunger intensifies. Children crying.' }
      }
    ],
    realFactAr: '29 فبراير 2024 — مجزرة الطحين: 112 قتيلاً و750 جريحاً في شارع الرشيد',
    realFactEn: 'Feb 29, 2024 — Flour Massacre: 112 killed, 750 wounded at Al-Rashid Street'
  },
  {
    id: 'p3_child_hunger', phase: [3], locations: 'all', triggerDay: 8, forced: true,
    titleAr: 'الطفل جائع', titleEn: 'The Child Is Hungry',
    storyAr: 'طفلك لم يأكل منذ يومين.\n"بابا/ماما... أنا جوعان"\n\nعندك آخر كمية طعام.',
    storyEn: 'Your child hasn\'t eaten in two days.\n"Baba/Mama... I\'m hungry"\n\nYou have the last portion of food.',
    choices: [
      {
        textAr: 'كل الطعام للأطفال', textEn: 'All food to the children',
        consequences: { food: -3,
          memberEffects: [{ target: 'children', hunger: -30, health: +5 }, { target: 'adults', hunger: +10 }],
          messageAr: 'الأطفال ناموا. أنت لم تأكل شيئاً.',
          messageEn: 'Children slept. You ate nothing.' }
      },
      {
        textAr: 'اقسم على الجميع', textEn: 'Divide equally',
        consequences: { food: -3, memberEffects: [{ target: 'all', hunger: -15 }],
          messageAr: 'لا يكفي لأحد. لكنكم تشاركتم.',
          messageEn: 'Not enough for anyone. But you shared.' }
      }
    ],
    realFactAr: 'فبراير-مارس 2024: سوء التغذية عند الأطفال دون عامين ارتفع من 15.6% إلى 31% في 6 أسابيع',
    realFactEn: 'Feb-March 2024: Child malnutrition (under 2) jumped from 15.6% to 31% in 6 weeks'
  },
  {
    id: 'p3_contaminated_water', phase: [3], locations: 'all', triggerDay: 10, forced: true, noChoice: true,
    titleAr: 'مياه ملوثة', titleEn: 'Contaminated Water',
    storyAr: 'أحد أفراد الأسرة يعاني إسهالاً شديداً.\nمحطات الصرف متوقفة.\nالمياه الجوفية ملوثة.',
    storyEn: 'A family member has severe diarrhea.\nSewage stations down.\nGroundwater contaminated.',
    consequences: { water: -3, medicine: -1,
      memberEffects: [{ target: 'random', health: -20 }],
      messageAr: 'قبل الحرب: 2000 حالة إسهال/شهر. الآن: 44,000 حالة/شهر.',
      messageEn: 'Before war: 2,000 diarrhea cases/month. Now: 44,000/month.' },
    realFactAr: 'نوف 2023 - فبر 2024: 312,693 حالة التهاب تنفسي، 222,620 حالة إسهال في الملاجئ',
    realFactEn: 'Nov 2023 - Feb 2024: 312,693 respiratory infections, 222,620 diarrhea cases in shelters'
  },
  {
    id: 'p3_share_neighbor', phase: [3], locations: 'all', triggerDay: 12, forced: false,
    titleAr: 'الجيران يطرقون الباب', titleEn: 'Neighbors at the Door',
    storyAr: 'طرق أبو سامر بابك. وجهه شاحب.\n"أولادي لم يأكلوا منذ 3 أيام. عندك أي شيء؟"',
    storyEn: 'Abu Samer knocked. Face pale.\n"My children haven\'t eaten in 3 days. Do you have anything?"',
    choices: [
      {
        textAr: 'أعطه مما عندك', textEn: 'Share what you have',
        consequences: { food: -2, water: -1, morale: +15, memberEffects: [{ target: 'all', morale: +10 }],
          messageAr: 'أطفاله أكلوا. عيناه كانتا تقولان ما لا تقوله الكلمات.',
          messageEn: 'His children ate. His eyes said what words cannot.' }
      },
      {
        textAr: 'لا — بالكاد يكفينا', textEn: 'No — barely enough for us',
        consequences: { morale: -20, memberEffects: [{ target: 'all', morale: -10 }],
          messageAr: 'أغلقت الباب. أطفالك رأوا. لن ينسوا.',
          messageEn: 'Closed the door. Your children saw. They won\'t forget.' }
      }
    ]
  },

  // PHASE 4
  {
    id: 'p4_rafah_invasion', phase: [4], locations: 'all', triggerDay: 1, forced: true,
    titleAr: 'اجتياح رفح', titleEn: 'Rafah Invasion',
    storyAr: '6 مايو 2024. منشورات من الطيران:\n"سكان شرق رفح يُخلوا فوراً نحو المواصي وخانيونس."\n\nأنت في رفح. كنت تظن نفسك في مأمن.\n1.4 مليون شخص يواجهون نفس الأمر.',
    storyEn: 'May 6, 2024. Leaflets from aircraft:\n"Eastern Rafah must evacuate immediately to Al-Mawasi and Khan Yunis."\n\nYou\'re in Rafah. You thought you were safe.\n1.4 million face the same order.',
    choices: [
      {
        textAr: 'أُخلي فوراً', textEn: 'Evacuate immediately',
        consequences: { food: -3, water: -2, money: -150, displacement: true, newLocation: 'khanyunis',
          messageAr: 'المواصي مكتظة. خيمة واحدة لكل أسرة. 34,000 شخص/كم².',
          messageEn: 'Al-Mawasi impossibly crowded. One tent per family. 34,000/sq km.' }
      },
      {
        textAr: 'أبقى — الغرب لا يزال آمناً', textEn: 'Stay — west is still safe',
        consequences: { dangerIncrease: 5,
          messageAr: 'بقيت. الدبابات تتقدم. القصف يقترب.',
          messageEn: 'Stayed. Tanks advancing. Strikes getting closer.' }
      }
    ],
    realFactAr: '26 مايو 2024: تل السلطان قُصف — أُعلن آمناً قبل أسبوع. 45 قتيلاً معظمهم نساء وأطفال',
    realFactEn: 'May 26, 2024: Tel al-Sultan bombed — declared safe one week earlier. 45 killed'
  },
  {
    id: 'p4_wck_strike', phase: [4], locations: 'all', triggerDay: 3, forced: true, noChoice: true,
    titleAr: 'اغتيال عمال الإغاثة', titleEn: 'Aid Workers Killed',
    storyAr: '1 أبريل 2024.\nقُتل 7 من عمال "مطبخ العالم المركزي" في قصف قافلتهم.\nالقافلة منسّقة مسبقاً. السيارات مُعلَّمة.\n\nالمنظمة علّقت عملياتها. الوجبات توقفت.',
    storyEn: 'April 1, 2024.\n7 World Central Kitchen workers killed in strike.\nConvoy was pre-coordinated. Vehicles clearly marked.\n\nOrganization suspended operations. Meals stopped.',
    consequences: { food: -4, morale: -15,
      messageAr: 'المساعدات الغذائية انقطعت. لا مطبخ. لا توزيع.',
      messageEn: 'Food aid cut off. No charity kitchen. No distribution.' },
    realFactAr: 'أبريل 2024: مقتل 7 من WCK — أستراليون، بولنديون، بريطانيون وأمريكي-كندي وفلسطيني',
    realFactEn: 'April 2024: 7 WCK workers killed — Australians, Poles, British, US-Canadian, Palestinian'
  },
  {
    id: 'p4_rafah_crossing_closed', phase: [4], locations: 'all', triggerDay: 5, forced: true, noChoice: true,
    titleAr: 'إغلاق معبر رفح', titleEn: 'Rafah Crossing Closed',
    storyAr: '7 مايو 2024.\nالجيش يسيطر على معبر رفح.\nالمعبر الوحيد للعالم الخارجي أُغلق.\n\nشاحنات المساعدات تنتظر على الجانب المصري.',
    storyEn: 'May 7, 2024.\nMilitary seizes Rafah crossing.\nOnly gateway to outside world — closed.\n\nAid trucks waiting on Egyptian side.',
    consequences: { food: -5, medicine: -2, memberEffects: [{ target: 'all', hunger: +20 }],
      messageAr: 'متوسط الشاحنات اليومية: 6 فقط. قبل الحرب: 500.',
      messageEn: 'Daily trucks: 6 only. Before the war: 500.' },
    realFactAr: 'أغسطس 2024: 69 شاحنة/يوم. 83% من المساعدات المطلوبة محجوبة (NRC)',
    realFactEn: 'August 2024: 69 trucks/day. 83% of required food aid blocked (NRC)'
  },

  // PHASE 5
  {
    id: 'p5_mawasi_bombed', phase: [5], locations: 'all', triggerDay: 2, forced: false,
    titleAr: 'قصف المنطقة "الآمنة"', titleEn: '"Safe Zone" Bombed',
    storyAr: '13 يوليو 2024.\nأنت في المواصي — المنطقة التي أمرك الجيش بالذهاب إليها.\n8 قنابل أمريكية زنة 2000 رطل تضرب المخيم.\n\nلا تحذير.',
    storyEn: 'July 13, 2024.\nYou\'re in Al-Mawasi — where the military told you to go.\n8 US-made 2,000 lb bombs hit the camp.\n\nNo warning.',
    choices: [
      {
        textAr: 'اركض لمنطقة أخرى', textEn: 'Run to another area',
        consequences: { food: -2, water: -2, money: -50,
          memberEffects: [{ target: 'random', health: -25 }],
          messageAr: 'ركضتم. أُصيب بعضكم. لا مكان آمن آخر.',
          messageEn: 'Ran. Some hit by shrapnel. No other safe place.' }
      },
      {
        textAr: 'استلقِ على الأرض', textEn: 'Lie flat',
        consequences: { memberEffects: [{ target: 'random', health: -30 }],
          messageAr: 'انفجار ضخم. شظايا في كل مكان.',
          messageEn: 'Massive explosion. Shrapnel everywhere.' }
      }
    ],
    realFactAr: '13 يوليو 2024: المواصي قُصفت بـ8 قنابل أمريكية. 90 قتيلاً و300+ جريح في المنطقة "الآمنة"',
    realFactEn: 'July 13, 2024: Al-Mawasi hit with 8 US bombs. 90 killed, 300+ wounded in the "safe zone"'
  },
  {
    id: 'p5_return_attempt', phase: [5], locations: 'all', triggerDay: 4, forced: false,
    titleAr: 'محاولة العودة', titleEn: 'Attempt to Return',
    storyAr: 'سمعت أن بعضهم يحاول العودة للشمال.\nقيل إن حيّك أصبح آمناً نسبياً.',
    storyEn: 'Heard people trying to return north.\nYour neighborhood said to be relatively safe now.',
    choices: [
      {
        textAr: 'حاوِل العودة', textEn: 'Try to return',
        consequences: { food: -1, water: -1, money: -100,
          memberEffects: [{ target: 'self', health: -15 }],
          messageAr: 'الجنود أطلقوا النار عند الحاجز. عدت أدراجك.',
          messageEn: 'Soldiers fired at checkpoint. You turned back.' }
      },
      {
        textAr: 'لا — لا يزال خطراً', textEn: 'No — still dangerous',
        consequences: { morale: -10,
          messageAr: 'بقيت. قرار مؤلم. لكنك آمن.',
          messageEn: 'Stayed. Painful decision. But you\'re safe.' }
      }
    ],
    realFactAr: '14 أبريل 2024: جنود أطلقوا النار على حشود تحاول العودة للشمال. قُتلت فتاة صغيرة',
    realFactEn: 'April 14, 2024: Soldiers fired on crowds trying to return north. A young girl was killed'
  },

  // PHASE 6
  {
    id: 'p6_deir_balah_evac', phase: [6], locations: 'all', triggerDay: 2, forced: true,
    titleAr: 'إخلاء آخر منطقة آمنة', titleEn: 'Last Safe Area Evacuated',
    storyAr: 'أغسطس 2024. أمر إخلاء لدير البلح.\nآخر منطقة إنسانية عاملة.\nكل المنظمات الـ24 تغادر قسراً.',
    storyEn: 'August 2024. Evacuation order for Deir al-Balah.\nLast functioning humanitarian zone.\nAll 24 NGOs forced out.',
    choices: [
      {
        textAr: 'تحرك نحو المواصي مجدداً', textEn: 'Move to Al-Mawasi again',
        consequences: { food: -4, water: -3, money: -100, medicine: -1, displacement: true,
          messageAr: 'النزوح الثالث. خيمة ممزقة. كل شيء من الصفر.',
          messageEn: 'Third displacement. Torn tent. Everything from scratch.' }
      },
      {
        textAr: 'ابقَ وتحمّل الخطر', textEn: 'Stay and bear the risk',
        consequences: { dangerIncrease: 4,
          messageAr: 'بقيت. القصف يتصاعد. المساعدات انقطعت.',
          messageEn: 'Stayed. Bombing escalating. Aid cut off.' }
      }
    ],
    realFactAr: 'أغسطس 2024: 5 أوامر إخلاء في 10 أيام. المعدل: أمر كل يومين',
    realFactEn: 'August 2024: 5 evacuation orders in 10 days. Average: one order every 2 days'
  },
  {
    id: 'p6_polio', phase: [6], locations: 'all', triggerDay: 5, forced: true, noChoice: true,
    titleAr: 'شلل الأطفال يعود', titleEn: 'Polio Returns',
    storyAr: 'يوليو 2024. إعلان رسمي:\nشلل الأطفال عاد لغزة.\nأول حالة منذ 25 عاماً.\nطفل عمره 10 أشهر أُصيب بشلل دائم.',
    storyEn: 'July 2024. Official announcement:\nPolio returned to Gaza.\nFirst case in 25 years.\nA 10-month-old permanently paralyzed.',
    consequences: { memberEffects: [{ target: 'children', health: -10 }],
      messageAr: 'حملة طارئة: 559,161 طفل لُقِّحوا خلال هدنة 4 أيام.',
      messageEn: 'Emergency campaign: 559,161 children vaccinated in a 4-day humanitarian pause.' },
    realFactAr: 'يوليو-أغسطس 2024: شلل الأطفال + 40,000 حالة التهاب كبد وبائي مقابل 85 حالة العام السابق',
    realFactEn: 'July-August 2024: Polio + 40,000 Hepatitis A cases vs. 85 cases the previous year'
  },
  {
    id: 'p6_north_siege', phase: [6], locations: ['north','gaza'], triggerDay: 8, forced: true, noChoice: true,
    titleAr: 'الحصار المزدوج', titleEn: 'Double Siege',
    storyAr: 'أكتوبر 2024. لمن بقي في الشمال:\nالدبابات من الشرق. البحر من الغرب.\nلا مخرج.\n\nطعام: صفر. ماء: صفر. دواء: صفر.',
    storyEn: 'October 2024. For those still in the north:\nTanks from east. Sea from west.\nNo way out.\n\nFood: zero. Water: zero. Medicine: zero.',
    consequences: { food: -8, water: -8, medicine: -3,
      memberEffects: [{ target: 'all', health: -15, hunger: +30 }],
      messageAr: 'الأمم المتحدة: "مجاعة متعمدة". الطحين: 1000 دولار/كيس.',
      messageEn: 'UN: "Deliberate starvation." Flour: $1,000 per bag.' },
    realFactAr: 'أكتوبر 2024: أمر إخلاء شمال غزة طال 300,000-400,000 شخص',
    realFactEn: 'October 2024: North Gaza evacuation order affected 300,000-400,000 people'
  },

  // PHASE 7
  {
    id: 'p7_nuseirat_school', phase: [7], locations: 'all', triggerDay: 3, forced: false,
    titleAr: 'قصف مدرسة النصيرات', titleEn: 'Nuseirat School Strike',
    storyAr: 'سبتمبر 2024. مدرسة أونروا في النصيرات.\nتؤوي 12,000 نازح — معظمهم نساء وأطفال.\nغارتان متتاليتان.\n6 موظفين أمميين بين القتلى.',
    storyEn: 'September 2024. UNRWA school in Nuseirat.\nSheltering 12,000 displaced — mostly women and children.\nTwo consecutive strikes.\n6 UN staff among the dead.',
    choices: [
      {
        textAr: 'غادر الملجأ فوراً', textEn: 'Leave shelter immediately',
        consequences: { food: -2, water: -2, money: -100,
          memberEffects: [{ target: 'self', health: -10 }],
          messageAr: 'غادرت. لا ملجأ آخر. نمت في الشارع.',
          messageEn: 'Left. No other shelter. Slept in the street.' }
      },
      {
        textAr: 'ابقَ — الشارع أخطر', textEn: 'Stay — street is more dangerous',
        consequences: { memberEffects: [{ target: 'random', health: -35 }],
          messageAr: 'ضربت الغارة. شظايا في كل مكان.',
          messageEn: 'Strike hit. Shrapnel everywhere.' }
      }
    ],
    realFactAr: 'سبتمبر 2024: 34 قتيلاً منهم 6 موظفين أمميين — أعلى حصيلة لأونروا في حادثة واحدة',
    realFactEn: 'September 2024: 34 killed including 6 UN staff — highest single-incident UNRWA staff toll'
  },
  {
    id: 'p7_starvation', phase: [7], locations: 'all', triggerDay: 6, forced: true, noChoice: true,
    titleAr: 'الموت البطيء', titleEn: 'The Slow Death',
    storyAr: 'أسبوع دون طعام كافٍ.\nجسم أحد أفراد الأسرة يضعف.\nالأطباء: "سوء التغذية الحاد الوخيم".\n\nلا دواء. لا مصل. لا مستشفى.',
    storyEn: 'A week without adequate food.\nA family member\'s body failing.\nDoctors: "Severe Acute Malnutrition".\n\nNo medicine. No IV. No hospital.',
    consequences: { food: -3, medicine: -2,
      memberEffects: [{ target: 'weakest', health: -25, hunger: +20 }],
      messageAr: 'الجسم يأكل نفسه. هذا ما تعنيه المجاعة.',
      messageEn: 'The body eats itself. This is what famine means.' },
    realFactAr: 'يونيو 2024: WHO توقف عن إحصاء وفيات المجاعة. الأرقام الحقيقية أعلى بـ10 أضعاف',
    realFactEn: 'June 2024: WHO stopped counting famine deaths. Real numbers 10x higher than confirmed'
  },
  {
    id: 'p7_tent_strike', phase: [7], locations: 'all', triggerDay: 9, forced: true, noChoice: true,
    titleAr: 'الخيام تحترق', titleEn: 'Tents on Fire',
    storyAr: '4 ديسمبر 2024.\nضربة على مخيم خيام في المواصي.\n21 خيمة احترقت.\nفي المنطقة الإنسانية المُعلنة.',
    storyEn: 'December 4, 2024.\nStrike on tent camp in Al-Mawasi.\n21 tents burned.\nIn the declared humanitarian zone.',
    consequences: { food: -5, water: -3, medicine: -2,
      memberEffects: [{ target: 'random', health: -30 }],
      messageAr: 'في أسبوعين: 7 ضربات على مخيمات خيام — 34 قتيلاً منهم 10 أطفال.',
      messageEn: 'Two weeks: 7 strikes on tent camps — 34 killed including 10 children.' },
    realFactAr: 'ديسمبر 2024: 40-50 شاحنة/يوم فقط — أدنى مستوى في الحرب كلها',
    realFactEn: 'December 2024: Only 40-50 trucks/day — lowest level of the entire war'
  },

  // PHASE 8
  {
    id: 'p8_ceasefire', phase: [8], locations: 'all', triggerDay: 1, forced: true,
    titleAr: 'الهدنة', titleEn: 'The Ceasefire',
    storyAr: '19 يناير 2025.\nالساعة 8:30 صباحاً.\n\nصمت.\n\nللمرة الأولى منذ 469 يوماً.\n\nصمت حقيقي.',
    storyEn: 'January 19, 2025.\n8:30 AM.\n\nSilence.\n\nFor the first time in 469 days.\n\nReal silence.',
    choices: [
      {
        textAr: 'العودة للشمال', textEn: 'Return to the north',
        consequences: { food: +3, water: +3, medicine: +2, money: +200,
          messageAr: 'سلكت الطريق مع 376,000 نازح. ما وجدوه: ركام.',
          messageEn: 'You walked with 376,000 displaced. What they found: rubble.' }
      },
      {
        textAr: 'أبقى — لا شيء هناك', textEn: 'Stay — nothing to return to',
        consequences: { food: +2, water: +2, medicine: +2, morale: -10,
          messageAr: 'المساعدات تتدفق: 600 شاحنة/يوم. لكن البيت لم يعد موجوداً.',
          messageEn: 'Aid finally flowing: 600 trucks/day. But the home no longer exists.' }
      }
    ],
    realFactAr: 'يناير 2025: في 42 يوماً وصل 88 مليون رطل غذاء لـ1.3 مليون شخص',
    realFactEn: 'January 2025: In 42 days, 88 million lbs of food reached 1.3 million people'
  },
  {
    id: 'p8_rubble', phase: [8], locations: 'all', triggerDay: 3, forced: true, noChoice: true,
    titleAr: 'العودة إلى لا شيء', titleEn: 'Returning to Nothing',
    storyAr: 'وصلت لحيّك.\n\nالبيت... غير موجود.\nالشارع... غير موجود.\nالمسجد... غير موجود.\nالمدرسة... غير موجودة.\n\nكل شيء ركام.',
    storyEn: 'You reached your neighborhood.\n\nThe house... gone.\nThe street... gone.\nThe mosque... gone.\nThe school... gone.\n\nEverything is rubble.',
    consequences: { morale: -30, memberEffects: [{ target: 'all', morale: -25 }],
      messageAr: 'لكنك حي. ومن نجا من أسرتك حي. وهذا ما لم يضمنه أحد.',
      messageEn: 'But you\'re alive. And your surviving family is alive. Which nobody guaranteed.' },
    realFactAr: 'سبتمبر 2024: 66% من مباني غزة تضررت — خسائر 18.5 مليار دولار = 97% من الناتج المحلي',
    realFactEn: 'September 2024: 66% of buildings damaged — $18.5B in damage = 97% of combined GDP'
  }
];

const MICRO_EVENTS = [
  { id: 'micro_phone', phase: 'all', textAr: 'بطارية هاتفك تنفد. لا كهرباء.', textEn: 'Phone battery dying. No power.', effect: { morale: -5 } },
  { id: 'micro_news', phase: 'all', textAr: 'الأخبار: العالم يتابع حياته. "يناقشون" الوضع.', textEn: 'News: The world moves on. They\'re "discussing" the situation.', effect: { morale: -10 } },
  { id: 'micro_child', phase: 'all', textAr: '"بابا/ماما... امتى نرجع البيت؟"', textEn: '"Baba/Mama... when do we go back home?"', effect: { morale: -8 } },
  { id: 'micro_water', phase: 'all', textAr: 'وجدت خزاناً فيه ماء صالح للشرب.', textEn: 'Found a tank with drinkable water.', effect: { water: +2 } },
  { id: 'micro_neighbor_died', phase: [3,6,7], textAr: 'توفي أبو إبراهيم — جار عمرك — الليلة. من الجوع.', textEn: 'Abu Ibrahim — your lifelong neighbor — died tonight. From hunger.', effect: { morale: -15 } },
  { id: 'micro_airdrop', phase: [4,5,6], textAr: 'إسقاط جوي للمساعدات. 90% سقطت في البحر.', textEn: 'Airdrop. 90% fell in the sea.', effect: { food: +1, morale: -5 } },
  { id: 'micro_medicine', phase: 'all', textAr: 'جار أعطاك نصف علبة مضادات حيوية.', textEn: 'A neighbor gave you half a box of antibiotics.', effect: { medicine: +1, morale: +5 } },
  { id: 'micro_flour_stolen', phase: [6,7], textAr: 'سُرق كيس الطحين الذي اشتريته بمدخرات أسبوع.', textEn: 'The flour bag you bought with a week\'s savings was stolen.', effect: { food: -4, morale: -20 } },
  { id: 'micro_prayer', phase: 'all', textAr: 'صليتم معاً في الخيمة. لحظة هدوء.', textEn: 'You prayed together in the tent. A moment of calm.', effect: { morale: +8 } },
  { id: 'micro_smoke', phase: [1,2,6,7], textAr: 'دخان كثيف في الأفق. حريق قريب.', textEn: 'Dense smoke on the horizon. Fire nearby.', effect: { morale: -5 } }
];

if (typeof module !== 'undefined') {
  module.exports = { GAME_PHASES, GAME_EVENTS, MICRO_EVENTS };
}
