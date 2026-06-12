// i18n.js - Bilingual Arabic/English translations

const LANG = {
  current: 'ar',

  toggle() {
    this.current = this.current === 'ar' ? 'en' : 'ar';
    document.documentElement.dir = this.current === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = this.current;
  },

  t(key) {
    const val = this[this.current][key];
    if (val === undefined) {
      const fallback = this.current === 'ar' ? this.en[key] : this.ar[key];
      return fallback !== undefined ? fallback : key;
    }
    return val;
  },

  ar: {
    // Game title
    loading: 'جاري التحميل...',
    game_title: 'هل ستنجو؟',
    game_subtitle: 'تجربة مدني غزاوي خلال الحرب',
    game_warning: 'هذه المحاكاة مبنية على أحداث حقيقية. المحتوى صعب عاطفياً.',
    setup_lang: 'اللغة',

    // Setup
    setup_title: 'إعداد اللعبة',
    your_name: 'اسمك',
    your_name_placeholder: 'أدخل اسمك',
    add_family: 'أضف أفراد العائلة',
    member_name: 'الاسم',
    member_age: 'العمر',
    member_relation: 'الصلة',
    add_member: '+ إضافة فرد',
    max_members: 'الحد الأقصى 6 أفراد',
    location_label: 'موقعك الأولي',
    living_standard: 'مستوى المعيشة',
    start_game: 'ابدأ',
    language_toggle: 'English',

    // Relations
    spouse: 'زوج/زوجة',
    child: 'ابن/ابنة',
    parent: 'أب/أم',
    sibling: 'أخ/أخت',

    // Locations
    north: 'شمال غزة',
    gaza: 'مدينة غزة',
    central: 'المنطقة الوسطى',
    khanyunis: 'خان يونس',
    rafah: 'رفح',

    // Living standards / financial classes
    poor: 'فقير',
    middle: 'متوسط',
    welloff: 'ميسور',
    comfortable: 'ميسور',
    rich: 'غني',
    financial_class: 'الفئة الاجتماعية',
    salary: 'الراتب',
    savings: 'المدخرات',
    debt: 'الديون',
    monthly_burden: 'الأعباء الشهرية',
    work_hours: 'ساعات العمل',
    your_job: 'مهنتك',
    your_job_placeholder: 'مثال: مهندس، طبيب، معلم',

    // Resources
    food: 'طعام',
    water: 'ماء',
    medicine: 'دواء',
    money: 'مال',
    fuel: 'وقود',

    // Monthly system
    month_of: 'الشهر {n} من 36',
    next_month: 'الشهر التالي',
    month_summary: 'ملخص الشهر',
    salary_received: 'راتب مُضاف',
    costs_deducted: 'أعباء مخصومة',
    replay_btn: 'إعادة المحاولة بطريقة مختلفة',
    bankrupt_warning: 'المدخرات نفدت والديون وصلت للحد الأقصى',
    emigrated_title: 'غادرت غزة',
    emigrated_text: 'اخترت المغادرة. نجوت بأسرتك.\nبيتك... لن تعود إليه.',

    // Month names (Oct 2023 = month 1)
    month_name_1: 'أكتوبر 2023',
    month_name_2: 'نوفمبر 2023',
    month_name_3: 'ديسمبر 2023',
    month_name_4: 'يناير 2024',
    month_name_5: 'فبراير 2024',
    month_name_6: 'مارس 2024',
    month_name_7: 'أبريل 2024',
    month_name_8: 'مايو 2024',
    month_name_9: 'يونيو 2024',
    month_name_10: 'يوليو 2024',
    month_name_11: 'أغسطس 2024',
    month_name_12: 'سبتمبر 2024',
    month_name_13: 'أكتوبر 2024',
    month_name_14: 'نوفمبر 2024',
    month_name_15: 'ديسمبر 2024',
    month_name_16: 'يناير 2025',
    month_name_17: 'فبراير 2025',
    month_name_18: 'مارس 2025',
    month_name_19: 'أبريل 2025',
    month_name_20: 'مايو 2025',
    month_name_21: 'يونيو 2025',
    month_name_22: 'يوليو 2025',
    month_name_23: 'أغسطس 2025',
    month_name_24: 'سبتمبر 2025',
    month_name_25: 'أكتوبر 2025',
    month_name_26: 'نوفمبر 2025',
    month_name_27: 'ديسمبر 2025',
    month_name_28: 'يناير 2026',
    month_name_29: 'فبراير 2026',
    month_name_30: 'مارس 2026',
    month_name_31: 'أبريل 2026',
    month_name_32: 'مايو 2026',
    month_name_33: 'يونيو 2026',
    month_name_34: 'يوليو 2026',
    month_name_35: 'أغسطس 2026',
    month_name_36: 'سبتمبر 2026',

    // Game UI
    day: 'يوم',
    phase: 'مرحلة',
    family: 'العائلة',
    resources: 'الموارد',
    location: 'الموقع',
    health: 'الصحة',
    hunger: 'الجوع',
    morale: 'المعنوية',
    alive: 'حي',
    dead: 'استشهد',
    critical: 'حرج',

    // Events
    choose_action: 'اختر ما ستفعل:',
    continue_btn: 'تابع',
    no_choice: 'لا يوجد خيار...',

    // Death scene
    died_title: 'استُشهد',
    died_hunger: 'مات جوعاً',
    died_injury: 'استشهد من جراء القصف',
    died_disease: 'توفي بسبب المرض',
    died_thirst: 'مات عطشاً',
    death_continue: 'تابع...',
    real_stat_children: 'استشهد أكثر من 15,000 طفل في غزة.',
    real_stat_hunger: 'مات عشرات الأطفال جوعاً في شمال غزة.',
    real_stat_medical: 'دمر الاحتلال معظم المستشفيات في غزة.',

    // End scene
    end_title: 'انتهت رحلتك',
    end_survived: 'نجا',
    end_lost: 'فُقد',
    end_days: 'أيام نجاة',
    end_summary: 'ملخص الرحلة',
    play_again: 'العب مجدداً',
    share_story: 'شارك قصتك',
    end_stat_header: 'الواقع في غزة:',
    end_stat1: 'أكثر من 46,000 شهيد حتى يناير 2025',
    end_stat2: 'أكثر من 110,000 جريح',
    end_stat3: 'أكثر من 1.9 مليون نازح (85% من السكان)',
    end_stat4: 'دمر أو تضرر أكثر من 60% من المباني',
    end_stat5: 'مجاعة تطال الجميع في شمال غزة',
    end_ceasefire: 'أُعلن وقف إطلاق النار في يناير 2025',
    all_died: 'لم ينجُ أحد من عائلتك.',
    some_survived: 'نجا بعض أفراد عائلتك.',
    all_survived: 'نجت عائلتك بأكملها.',

    // Phases
    phase1_name: 'القصف المكثف',
    phase2_name: 'النزوح الكبير',
    phase3_name: 'الحصار والمجاعة',
    phase4_name: 'اجتياح رفح',
    phase5_name: 'هدنة جزئية',
    phase6_name: 'عودة القصف',
    phase7_name: 'لا مكان آمن',
    phase8_name: 'هدنة يناير',

    // UI messages
    day_summary: 'ملخص اليوم',
    morning: 'الصباح',
    night: 'المساء',
    warning_hunger: 'تحذير: بعض أفراد العائلة يعانون من الجوع الشديد',
    warning_health: 'تحذير: صحة أحد أفراد العائلة في خطر',
    ceasefire_msg: 'أُعلن وقف لإطلاق النار... لكن حتى متى؟',
    displacement_msg: 'يجب الرحيل الآن. اترك كل شيء.',
    days_unit: 'يوماً',

    // Specific event messages
    strike_nearby: 'قصف قريب',
    running_low: 'الموارد تنفد',
    aid_arrived: 'وصلت مساعدات',
    neighbor_died: 'رحل جار',
  },

  en: {
    game_title: 'Will You Survive?',
    game_subtitle: 'Experience of a Gazan Civilian During the War',

    setup_title: 'Game Setup',
    your_name: 'Your Name',
    your_name_placeholder: 'Enter your name',
    add_family: 'Add Family Members',
    member_name: 'Name',
    member_age: 'Age',
    member_relation: 'Relation',
    add_member: '+ Add Member',
    max_members: 'Maximum 6 members',
    location_label: 'Starting Location',
    living_standard: 'Living Standard',
    start_game: 'Start',
    language_toggle: 'عربي',

    spouse: 'Spouse',
    child: 'Child',
    parent: 'Parent',
    sibling: 'Sibling',

    north: 'North Gaza',
    gaza: 'Gaza City',
    central: 'Central Area',
    khanyunis: 'Khan Yunis',
    rafah: 'Rafah',

    poor: 'Poor',
    middle: 'Middle Class',
    welloff: 'Well-off',

    food: 'Food',
    water: 'Water',
    medicine: 'Medicine',
    money: 'Money',
    fuel: 'Fuel',

    day: 'Day',
    phase: 'Phase',
    family: 'Family',
    resources: 'Resources',
    location: 'Location',
    health: 'Health',
    hunger: 'Hunger',
    morale: 'Morale',
    alive: 'Alive',
    dead: 'Martyred',
    critical: 'Critical',

    choose_action: 'Choose what to do:',
    continue_btn: 'Continue',
    no_choice: 'No choice...',

    died_title: 'Died',
    died_hunger: 'Died of starvation',
    died_injury: 'Martyred in airstrike',
    died_disease: 'Died of disease',
    died_thirst: 'Died of thirst',
    death_continue: 'Continue...',
    real_stat_children: 'Over 15,000 children were killed in Gaza.',
    real_stat_hunger: 'Dozens of children died of starvation in northern Gaza.',
    real_stat_medical: 'The occupation destroyed most hospitals in Gaza.',

    end_title: 'Your Journey Has Ended',
    end_survived: 'Survived',
    end_lost: 'Lost',
    end_days: 'Days Survived',
    end_summary: 'Journey Summary',
    play_again: 'Play Again',
    share_story: 'Share Your Story',
    end_stat_header: 'The Reality in Gaza:',
    end_stat1: 'Over 46,000 martyred by January 2025',
    end_stat2: 'Over 110,000 injured',
    end_stat3: 'Over 1.9 million displaced (85% of population)',
    end_stat4: 'Over 60% of buildings destroyed or damaged',
    end_stat5: 'Famine affecting everyone in northern Gaza',
    end_ceasefire: 'A ceasefire was announced in January 2025',
    all_died: 'None of your family survived.',
    some_survived: 'Some of your family members survived.',
    all_survived: 'Your entire family survived.',

    phase1_name: 'Intense Bombardment',
    phase2_name: 'The Great Displacement',
    phase3_name: 'Siege & Famine',
    phase4_name: 'Rafah Invasion',
    phase5_name: 'Partial Ceasefire',
    phase6_name: 'Bombardment Returns',
    phase7_name: 'Nowhere is Safe',
    phase8_name: 'January Ceasefire',

    day_summary: 'Day Summary',
    morning: 'Morning',
    night: 'Evening',
    warning_hunger: 'Warning: Some family members are severely hungry',
    warning_health: 'Warning: A family member\'s health is at risk',
    ceasefire_msg: 'A ceasefire was announced... but for how long?',
    displacement_msg: 'You must leave now. Leave everything behind.',
    days_unit: 'days',

    strike_nearby: 'Strike Nearby',
    running_low: 'Resources Running Low',
    aid_arrived: 'Aid Arrived',
    neighbor_died: 'A Neighbor Passed',

    // Extra keys used in scenes
    game_warning: 'This simulation is based on real events. The content is emotionally difficult.',
    setup_lang: 'Language',
    loading: 'Loading...',

    // Financial classes
    comfortable: 'Comfortable',
    rich: 'Wealthy',
    financial_class: 'Financial Class',
    salary: 'Salary',
    savings: 'Savings',
    debt: 'Debt',
    monthly_burden: 'Monthly Costs',
    work_hours: 'Work Hours',
    your_job: 'Your Profession',
    your_job_placeholder: 'e.g. Engineer, Doctor, Teacher',

    // Monthly system
    month_of: 'Month {n} of 36',
    next_month: 'Next Month',
    month_summary: 'Monthly Summary',
    salary_received: 'Salary Added',
    costs_deducted: 'Costs Deducted',
    replay_btn: 'Try Again — Different Outcome',
    bankrupt_warning: 'Savings gone and debt maxed out',
    emigrated_title: 'You Left Gaza',
    emigrated_text: "You chose to leave. Your family survived.\nYour home... you'll never return.",

    month_name_1: 'October 2023',
    month_name_2: 'November 2023',
    month_name_3: 'December 2023',
    month_name_4: 'January 2024',
    month_name_5: 'February 2024',
    month_name_6: 'March 2024',
    month_name_7: 'April 2024',
    month_name_8: 'May 2024',
    month_name_9: 'June 2024',
    month_name_10: 'July 2024',
    month_name_11: 'August 2024',
    month_name_12: 'September 2024',
    month_name_13: 'October 2024',
    month_name_14: 'November 2024',
    month_name_15: 'December 2024',
    month_name_16: 'January 2025',
    month_name_17: 'February 2025',
    month_name_18: 'March 2025',
    month_name_19: 'April 2025',
    month_name_20: 'May 2025',
    month_name_21: 'June 2025',
    month_name_22: 'July 2025',
    month_name_23: 'August 2025',
    month_name_24: 'September 2025',
    month_name_25: 'October 2025',
    month_name_26: 'November 2025',
    month_name_27: 'December 2025',
    month_name_28: 'January 2026',
    month_name_29: 'February 2026',
    month_name_30: 'March 2026',
    month_name_31: 'April 2026',
    month_name_32: 'May 2026',
    month_name_33: 'June 2026',
    month_name_34: 'July 2026',
    month_name_35: 'August 2026',
    month_name_36: 'September 2026',
  }
};

// Global helper functions
function setLang(lang) {
  LANG.current = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  try { localStorage.setItem('gazagame_lang', lang); } catch(e) {}
}
