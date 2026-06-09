// events.js - Events database

const PHASES = [
  { id: 1, nameKey: 'phase1_name', nameEn: 'Intense Bombardment',
    month: 'Oct-Nov 2023', duration: 14,
    dangerLevel: { north: 10, gaza: 8, central: 5, khanyunis: 3, rafah: 2 } },

  { id: 2, nameKey: 'phase2_name', nameEn: 'The Great Displacement',
    month: 'Nov-Dec 2023', duration: 10,
    dangerLevel: { north: 10, gaza: 9, central: 6, khanyunis: 4, rafah: 2 } },

  { id: 3, nameKey: 'phase3_name', nameEn: 'Siege & Famine',
    month: 'Dec 2023 - Feb 2024', duration: 21,
    dangerLevel: { north: 10, gaza: 10, central: 7, khanyunis: 5, rafah: 3 },
    faminePressure: true },

  { id: 4, nameKey: 'phase4_name', nameEn: 'Rafah Invasion',
    month: 'May 2024', duration: 14,
    dangerLevel: { north: 8, gaza: 8, central: 6, khanyunis: 7, rafah: 10 } },

  { id: 5, nameKey: 'phase5_name', nameEn: 'Partial Ceasefire',
    month: 'Jun-Jul 2024', duration: 7,
    dangerLevel: { north: 5, gaza: 5, central: 3, khanyunis: 4, rafah: 6 },
    ceasefire: true },

  { id: 6, nameKey: 'phase6_name', nameEn: 'Bombardment Returns',
    month: 'Aug-Oct 2024', duration: 14,
    dangerLevel: { north: 9, gaza: 9, central: 8, khanyunis: 9, rafah: 9 } },

  { id: 7, nameKey: 'phase7_name', nameEn: 'Nowhere is Safe',
    month: 'Oct 2024+', duration: 14,
    dangerLevel: { north: 10, gaza: 10, central: 10, khanyunis: 10, rafah: 10 },
    faminePressure: true },

  { id: 8, nameKey: 'phase8_name', nameEn: 'January Ceasefire',
    month: 'Jan 2025', duration: 7,
    ceasefire: true, finalPhase: true },
];

const EVENTS = [
  // ============== BOMBARDMENT EVENTS ==============
  {
    id: 'evt_001',
    phase: [1, 2, 6, 7],
    locations: 'all',
    title: { ar: 'قصف قريب من البيت', en: 'Airstrike Near Home' },
    story: {
      ar: 'سمعتَ دويّ انفجار ضخم. الجدران ترتجف. الزجاج يتكسر. يصرخ أحد أفراد عائلتك. الغارة كانت على المبنى المجاور مباشرةً. الدخان يتصاعد من النافذة.',
      en: 'You hear a massive explosion. The walls shake. Glass shatters. A family member screams. The strike hit the building next door. Smoke rises from the window.'
    },
    choices: [
      {
        text: { ar: 'ابقَ داخل البيت ولا تتحرك', en: 'Stay inside, do not move' },
        consequences: {
          water: -1,
          memberEffects: [{ target: 'random', health: -8, causeOfDeath: 'injury' }],
          message: { ar: 'بقيتَ. سقطت شظايا لكن البيت صمد. أحد أفراد عائلتك أُصيب بجروح طفيفة.', en: 'You stayed. Shrapnel fell but the building held. A family member suffered minor injuries.' }
        }
      },
      {
        text: { ar: 'اهرب فوراً إلى الشارع', en: 'Flee immediately to the street' },
        consequences: {
          food: -1, water: -2,
          memberEffects: [{ target: 'random', health: -20, causeOfDeath: 'injury' }],
          message: { ar: 'ركضتم إلى الشارع وسط الفوضى. كانت غارة أخرى قريبة. أحد أفراد عائلتك أُصيب بجروح بالغة.', en: 'You ran into the street amid chaos. Another strike hit nearby. A family member was seriously wounded.' }
        }
      },
      {
        text: { ar: 'انزل إلى الطابق الأرضي', en: 'Go down to the ground floor' },
        consequences: {
          water: -1,
          message: { ar: 'نزلتم إلى الطابق الأرضي وانتظرتم. مرّت الغارة. الجميع بخير نسبياً.', en: 'You went to the ground floor and waited. The strike passed. Everyone is relatively okay.' }
        }
      }
    ]
  },

  {
    id: 'evt_002',
    phase: [1, 2, 3, 6, 7],
    locations: 'all',
    title: { ar: 'قصف على طابور المساعدات', en: 'Strike on Aid Queue' },
    story: {
      ar: 'وصلت شاحنات مساعدات غذائية إلى الحي. تجمّع الناس بالآلاف. لكن الطابور طويل جداً وهناك أنباء عن وجود طائرات في المنطقة. طعامك ينفد.',
      en: 'Aid trucks arrived in the neighborhood. Thousands gathered. But the queue is very long and there are reports of aircraft in the area. Your food is running out.'
    },
    choices: [
      {
        text: { ar: 'اذهب وانتظر في الطابور', en: 'Go and wait in the queue' },
        consequences: {
          food: 5, water: 3,
          memberEffects: [{ target: 'player', health: -15, causeOfDeath: 'injury' }],
          message: { ar: 'حصلتَ على الطعام. لكن حدث قصف مفاجئ على الطابور. أُصبتَ بجروح.', en: 'You got food. But a sudden strike hit the queue. You were wounded.' }
        }
      },
      {
        text: { ar: 'ابقَ في البيت رغم الجوع', en: 'Stay home despite the hunger' },
        consequences: {
          memberEffects: [{ target: 'random', hunger: 20 }],
          message: { ar: 'بقيتَ. سمعتَ لاحقاً أن الطابور تعرّض لضربة جوية. قُتل عشرات الأشخاص.', en: 'You stayed. You heard later that the queue was hit by an airstrike. Dozens were killed.' }
        }
      }
    ]
  },

  {
    id: 'evt_003',
    phase: [1, 2, 3, 6, 7],
    locations: ['north', 'gaza', 'central'],
    title: { ar: 'غارة على المستشفى', en: 'Hospital Under Fire' },
    story: {
      ar: 'أحد أفراد عائلتك يحتاج علاجاً عاجلاً. لكن المستشفى القريب تعرّض لقصف الليلة الماضية. يعمل جزئياً. الطريق إليه خطر.',
      en: 'A family member needs urgent medical care. But the nearby hospital was struck last night. It\'s partially operational. The road there is dangerous.'
    },
    choices: [
      {
        text: { ar: 'اذهب إلى المستشفى رغم الخطر', en: 'Go to the hospital despite the danger' },
        consequences: {
          medicine: 2,
          memberEffects: [{ target: 'weakest', health: 20, sick: false }],
          message: { ar: 'وصلتم إلى المستشفى. الأطباء منهكون لكنهم يعملون. حصل المريض على بعض العلاج.', en: 'You reached the hospital. The doctors are exhausted but working. The patient received some treatment.' }
        }
      },
      {
        text: { ar: 'استخدم ما تبقى من دواء في البيت', en: 'Use remaining medicine at home' },
        consequences: {
          medicine: -2,
          memberEffects: [{ target: 'weakest', health: 10 }],
          message: { ar: 'استخدمتَ ما تبقى من دواء. أسهم ذلك قليلاً. لكن الحالة تحتاج عناية طبية حقيقية.', en: 'You used the remaining medicine. It helped a little. But the condition needs real medical care.' }
        }
      },
      {
        text: { ar: 'لا شيء يمكن فعله', en: 'Nothing can be done' },
        consequences: {
          memberEffects: [{ target: 'weakest', health: -25, causeOfDeath: 'disease' }],
          message: { ar: 'لا دواء. لا طبيب. الحالة تتدهور يوماً بعد يوم.', en: 'No medicine. No doctor. The condition worsens day by day.' }
        }
      }
    ]
  },

  // ============== DISPLACEMENT EVENTS ==============
  {
    id: 'evt_004',
    phase: [1, 2, 4],
    locations: 'all',
    title: { ar: 'أوامر إخلاء عسكرية', en: 'Military Evacuation Orders' },
    story: {
      ar: 'وصلت رسالة نصية على الهاتف: "سكان المنطقة يُطلب منهم المغادرة فوراً". في الخارج يصرخ الناس ويركضون. الجيران يحملون ما يستطيعون.',
      en: 'A text message arrives: "Residents are ordered to evacuate immediately." Outside, people are shouting and running. Neighbors carry what they can.'
    },
    choices: [
      {
        text: { ar: 'اغادر الآن مع أقل ما يمكن', en: 'Leave now with as little as possible' },
        consequences: {
          displace: true,
          message: { ar: 'غادرتم. تركتم معظم ممتلكاتكم. الطريق كان مروّعاً. وصلتم أخيراً إلى منطقة أكثر أماناً.', en: 'You left. You abandoned most of your belongings. The road was harrowing. You finally reached a safer area.' }
        }
      },
      {
        text: { ar: 'ابقَ. ربما تكون الأوامر مبالغاً فيها', en: 'Stay. Maybe the orders are exaggerated' },
        consequences: {
          memberEffects: [{ target: 'random', health: -35, causeOfDeath: 'injury' }],
          dangerIncrease: 3,
          message: { ar: 'بقيتَ. وقعت غارة على الحي. فقدنا أحد أفراد العائلة.', en: 'You stayed. The neighborhood was struck. We lost a family member.' }
        }
      }
    ]
  },

  {
    id: 'evt_005',
    phase: [2, 3, 4],
    locations: 'all',
    title: { ar: 'طريق النزوح مقطوع', en: 'Displacement Route Blocked' },
    story: {
      ar: 'أنتم في الطريق للنزوح نحو الجنوب. فجأة، اكتشفتم أن الطريق الرئيسي مقطوع. الجيش يمنع العبور. أمامك خياران كلاهما خطر.',
      en: 'You\'re on your way south. Suddenly, you discover the main road is blocked. The military is preventing passage. Two options, both dangerous.'
    },
    choices: [
      {
        text: { ar: 'انتظر على جانب الطريق', en: 'Wait on the side of the road' },
        consequences: {
          food: -3, water: -3,
          message: { ar: 'انتظرتم لساعات تحت الشمس. نفد الماء تقريباً. بعد اليوم الثاني فُتح الطريق جزئياً.', en: 'You waited for hours in the sun. Water nearly ran out. After the second day, the road partially opened.' }
        }
      },
      {
        text: { ar: 'خذ طريق الحقول البديل', en: 'Take the alternative field path' },
        consequences: {
          food: -2, water: -4,
          memberEffects: [{ target: 'random', health: -20, causeOfDeath: 'injury' }],
          message: { ar: 'سلكتم الطريق البديل عبر الحقول. كانت هناك قناصة. أُصيب أحد أفراد العائلة.', en: 'You took the alternative path through the fields. There were snipers. A family member was shot.' }
        }
      }
    ]
  },

  {
    id: 'evt_006',
    phase: [2, 4],
    locations: 'all',
    title: { ar: 'فقدان الحقائب أثناء النزوح', en: 'Bags Lost During Displacement' },
    story: {
      ar: 'في زحمة النزوح الرهيبة، سقطت إحدى الحقائب التي تحتوي على الطعام والأدوية. لم تستطع العودة لاسترجاعها.',
      en: 'In the terrible displacement chaos, one of the bags containing food and medicine was lost. You could not go back for it.'
    },
    noChoice: true,
    consequences: {
      food: -4, water: -3, medicine: -2,
      message: { ar: 'فقدتَ الحقيبة. لا شيء يعوضها. هكذا يبدو النزوح — تخسر شيئاً في كل خطوة.', en: 'The bag was lost. Nothing can replace it. This is what displacement looks like — losing something with every step.' }
    }
  },

  // ============== FAMINE EVENTS ==============
  {
    id: 'evt_007',
    phase: [3, 7],
    locations: 'all',
    title: { ar: 'وصول شاحنات مساعدات نادرة', en: 'Rare Aid Trucks Arrive' },
    story: {
      ar: 'أُعلن أن شاحنتين فقط من المساعدات الغذائية ستصل اليوم للمنطقة. لكن هناك أكثر من ألف عائلة تنتظر. الحصة لن تكفي الجميع.',
      en: 'Only two aid trucks will arrive in the area today. But over a thousand families are waiting. The quota won\'t be enough for everyone.'
    },
    choices: [
      {
        text: { ar: 'اذهب مبكراً وانتظر ساعات', en: 'Go early and wait for hours' },
        consequences: {
          food: 4, water: 3,
          memberEffects: [{ target: 'player', health: -5 }],
          message: { ar: 'حصلتَ على بعض الطعام والماء. كنتَ من المحظوظين الذين وصلوا قبل نفاد المساعدات.', en: 'You got some food and water. You were lucky enough to arrive before the aid ran out.' }
        }
      },
      {
        text: { ar: 'لا تذهب — الازدحام خطير', en: 'Don\'t go — the crowd is dangerous' },
        consequences: {
          memberEffects: [{ target: 'random', hunger: 25 }],
          message: { ar: 'لم تذهب. نفدت المساعدات قبل أن يحصل الكثيرون على شيء. تُرك عائلتك بلا طعام اليوم.', en: 'You didn\'t go. Aid ran out before most got anything. Your family was left without food today.' }
        }
      }
    ]
  },

  {
    id: 'evt_008',
    phase: [3, 4, 6, 7],
    locations: 'all',
    title: { ar: 'السوق السوداء', en: 'The Black Market' },
    story: {
      ar: 'أحد الجيران يعرض عليك بيع كيس دقيق وعلب معلبات بسعر خيالي: 200 دولار. أسعار السوق ارتفعت 40 ضعفاً. لكن أطفالك جائعون منذ يومين.',
      en: 'A neighbor offers to sell you a bag of flour and canned food for $200 — 40 times the normal price. Your children have been hungry for two days.'
    },
    choices: [
      {
        text: { ar: 'ادفع. لا خيار آخر', en: 'Pay. No other choice' },
        consequences: {
          food: 5, money: -200,
          memberEffects: [{ target: 'random', hunger: -30 }],
          message: { ar: 'دفعتَ ما تبقى من مدخراتك. حصلتَ على طعام. لكن المال يتآكل بسرعة مرعبة.', en: 'You paid what\'s left of your savings. You got food. But money is disappearing at a terrifying rate.' }
        }
      },
      {
        text: { ar: 'رفض — هذا استغلال', en: 'Refuse — this is exploitation' },
        consequences: {
          memberEffects: [{ target: 'child', hunger: 30, health: -10 }],
          message: { ar: 'رفضتَ. لكن الجوع لا يرحم. الأطفال يبكون ليلاً من الألم.', en: 'You refused. But hunger is merciless. The children cry at night from pain.' }
        }
      }
    ]
  },

  {
    id: 'evt_009',
    phase: [3, 5, 7],
    locations: 'all',
    title: { ar: 'جار يطلب مشاركة الطعام', en: 'Neighbor Asks to Share Food' },
    story: {
      ar: 'طرق بابك جارك أبو محمد وهو يحمل طفلاً رضيعاً. قال: "منذ ثلاثة أيام لم يأكل أحد في بيتنا." عندك كمية طعام قليلة جداً لعائلتك.',
      en: 'Your neighbor Abu Muhammad knocked on your door carrying an infant. He said: "No one in our house has eaten for three days." You have very little food left for your own family.'
    },
    choices: [
      {
        text: { ar: 'شارك ما لديك', en: 'Share what you have' },
        consequences: {
          food: -3,
          memberEffects: [{ target: 'random', morale: 15 }],
          message: { ar: 'أعطيتَهم بعض الطعام. شكر الله بدموع في عينيه. لكن طعامك نقص. صعب.', en: 'You gave them some food. He thanked God with tears in his eyes. But your food decreased. Hard.' }
        }
      },
      {
        text: { ar: 'اعتذر — ليس لديك ما يكفي', en: 'Apologize — you don\'t have enough' },
        consequences: {
          memberEffects: [{ target: 'random', morale: -20 }],
          message: { ar: 'اعتذرتَ. أغلقتَ الباب. صوت الطفل الباكي لم يفارق أذنيك طوال الليل.', en: 'You apologized. You closed the door. The sound of the crying baby didn\'t leave your ears all night.' }
        }
      }
    ]
  },

  {
    id: 'evt_010',
    phase: [3, 7],
    locations: ['north', 'gaza'],
    title: { ar: 'طفل يبكي من الجوع', en: 'Child Crying From Hunger' },
    story: {
      ar: 'منذ أسبوعين لم يأكل الطفل وجبة كاملة. وجهه اصفرّ. ينام أكثر مما يستيقظ. يبكي لكن لا دموع — حتى الدموع نفدت.',
      en: 'For two weeks, the child hasn\'t had a full meal. His face has yellowed. He sleeps more than he wakes. He cries, but no tears — even tears have run out.'
    },
    noChoice: true,
    consequences: {
      memberEffects: [{ target: 'child', health: -20, hunger: 20 }],
      message: { ar: 'لا شيء يمكن فعله. المجاعة ليست حادثة — إنها سياسة.', en: 'Nothing can be done. Famine is not an accident — it is policy.' }
    }
  },

  // ============== CEASEFIRE EVENTS ==============
  {
    id: 'evt_011',
    phase: [5, 8],
    locations: 'all',
    title: { ar: 'إعلان هدنة', en: 'Ceasefire Announced' },
    story: {
      ar: 'أُعلن عن وقف مؤقت لإطلاق النار. في الشارع يبكي الناس من الفرحة والحزن معاً. تذكّرتَ من خسرتَهم حتى الآن. هل تعود إلى بيتك؟',
      en: 'A temporary ceasefire is announced. In the street, people cry from both joy and grief. You remember who you\'ve lost so far. Do you return home?'
    },
    choices: [
      {
        text: { ar: 'حاول العودة إلى البيت', en: 'Try to return home' },
        consequences: {
          message: { ar: 'عدتَ إلى حيك. ما رأيتَه لن تنساه. لكن على الأقل أنتم أحياء.', en: 'You returned to your neighborhood. What you saw, you will never forget. But at least you\'re alive.' }
        }
      },
      {
        text: { ar: 'ابقَ حيث أنتَ — لا تثق بالهدنة', en: 'Stay where you are — don\'t trust the ceasefire' },
        consequences: {
          memberEffects: [{ target: 'random', morale: -10 }],
          message: { ar: 'بقيتَ. وكان صوابك — انتهت الهدنة بعد أيام وعاد القصف.', en: 'You stayed. You were right — the ceasefire ended after days and bombing resumed.' }
        }
      }
    ]
  },

  {
    id: 'evt_012',
    phase: [5, 8],
    locations: 'all',
    title: { ar: 'العودة إلى البيت المدمّر', en: 'Returning to Find Home Destroyed' },
    story: {
      ar: 'في الهدنة، عدتَ إلى بيتك. وجدتَ حطاماً. الجدران مهدّمة. الصور العائلية على الأرض ممزقة. لا شيء مما تركتَه باقٍ.',
      en: 'During the ceasefire, you returned home. You found rubble. Walls collapsed. Family photos torn on the ground. Nothing you left behind remains.'
    },
    noChoice: true,
    consequences: {
      memberEffects: [{ target: 'random', morale: -30 }, { target: 'random', morale: -25 }],
      message: { ar: 'البيت هو الذاكرة. حين يُهدم البيت، تُهدم أجزاء من الروح معه.', en: 'The home is memory. When the home is destroyed, parts of the soul are destroyed with it.' }
    }
  },

  {
    id: 'evt_013',
    phase: [5, 6, 8],
    locations: 'all',
    title: { ar: 'اكتشاف جيران ماتوا', en: 'Discovering Neighbors Who Died' },
    story: {
      ar: 'في الهدنة عبرتَ إلى المبنى المجاور. وجدتَ أسرة كاملة تحت الأنقاض. كانوا جيرانك منذ سنوات. أطفالهم كانوا يلعبون مع أطفالك.',
      en: 'During the ceasefire you crossed to the adjacent building. You found an entire family under the rubble. They were your neighbors for years. Their children played with yours.'
    },
    noChoice: true,
    consequences: {
      memberEffects: [{ target: 'random', morale: -40, health: -5 }],
      message: { ar: 'لا كلمات كافية. في غزة، كل عائلة فقدت عائلة أخرى تعرفها.', en: 'No words are enough. In Gaza, every family lost another family they knew.' }
    }
  },

  // ============== DISEASE EVENTS ==============
  {
    id: 'evt_014',
    phase: [3, 4, 5, 6, 7],
    locations: 'all',
    title: { ar: 'مياه ملوثة', en: 'Contaminated Water' },
    story: {
      ar: 'شبكة المياه مقطوعة. المياه التي يجلبها الجيران من المجاري المكشوفة. أحد أفراد عائلتك بدأ يعاني من إسهال حاد وحمى.',
      en: 'The water network is cut. Water neighbors bring comes from open sewage. A family member started suffering from severe diarrhea and fever.'
    },
    choices: [
      {
        text: { ar: 'استخدم الدواء المتبقي لعلاجه', en: 'Use remaining medicine to treat them' },
        consequences: {
          medicine: -2,
          memberEffects: [{ target: 'random', health: 15, sick: false }],
          message: { ar: 'ساعد الدواء في تخفيف الأعراض. لكن مخزون الدواء ينفد.', en: 'The medicine helped reduce symptoms. But medicine supplies are running out.' }
        }
      },
      {
        text: { ar: 'لا دواء — الراحة فقط', en: 'No medicine — rest only' },
        consequences: {
          memberEffects: [{ target: 'random', sick: true, health: -15 }],
          message: { ar: 'بدون دواء تتفاقم الحالة. الجسم المنهك من الجوع لا يملك مناعة.', en: 'Without medicine the condition worsens. A body exhausted from hunger has no immunity.' }
        }
      }
    ]
  },

  {
    id: 'evt_015',
    phase: [3, 5, 6, 7],
    locations: 'all',
    title: { ar: 'نفاد الدواء الضروري', en: 'Critical Medicine Ran Out' },
    story: {
      ar: 'أحد أفراد عائلتك مريض ويحتاج دواءً يومياً. الصيدليات خالية منذ أسابيع. المستشفى الوحيد لا يملك المخزون الكافي.',
      en: 'A family member is sick and needs daily medication. Pharmacies have been empty for weeks. The only hospital doesn\'t have enough stock.'
    },
    choices: [
      {
        text: { ar: 'ابحث عن دواء في المنطقة المجاورة', en: 'Search for medicine in the neighboring area' },
        consequences: {
          medicine: 1,
          memberEffects: [{ target: 'player', health: -10 }],
          message: { ar: 'وجدتَ القليل بعد بحث مضنٍ. نجح بعضه في إبطاء تدهور الحالة.', en: 'You found a little after exhausting searches. Some of it slowed the deterioration.' }
        }
      },
      {
        text: { ar: 'لا شيء متاح', en: 'Nothing available' },
        consequences: {
          memberEffects: [{ target: 'weakest', health: -30, sick: true, causeOfDeath: 'disease' }],
          message: { ar: 'لا دواء في غزة. ما يمكن علاجه في أي بلد آخر يقتل هنا.', en: 'No medicine in Gaza. What can be treated anywhere else kills here.' }
        }
      }
    ]
  },

  // ============== ADDITIONAL EVENTS ==============
  {
    id: 'evt_016',
    phase: [1, 2, 6],
    locations: ['north', 'gaza'],
    title: { ar: 'انقطاع الكهرباء والمولد', en: 'Power and Generator Cut Out' },
    story: {
      ar: 'انقطعت الكهرباء منذ 20 يوماً. اليوم نفد الوقود من مولد الكهرباء الوحيد في البناية. الأجهزة الطبية لأحد الجيران المرضى ستتوقف.',
      en: 'Electricity has been cut for 20 days. Today the fuel ran out from the building\'s only generator. Medical devices for a sick neighbor will stop.'
    },
    choices: [
      {
        text: { ar: 'أعطهم جزءاً من وقودنا', en: 'Give them some of our fuel' },
        consequences: {
          fuel: -2,
          memberEffects: [{ target: 'random', morale: 10 }],
          message: { ar: 'أعطيتهم الوقود. عاشت المريضة ليوم آخر. نظرت إليك وقالت شيئاً لم تسمعه.', en: 'You gave them the fuel. The sick woman lived another day. She looked at you and said something you couldn\'t hear.' }
        }
      },
      {
        text: { ar: 'الوقود لعائلتنا فقط', en: 'The fuel is for our family only' },
        consequences: {
          memberEffects: [{ target: 'random', morale: -20 }],
          message: { ar: 'احتفظتَ بالوقود. ماتت المريضة في الليل. زوجها طرق بابك صباحاً ولم يقل شيئاً.', en: 'You kept the fuel. The sick woman died in the night. Her husband knocked on your door in the morning and said nothing.' }
        }
      }
    ]
  },

  {
    id: 'evt_017',
    phase: [4, 6, 7],
    locations: ['rafah', 'khanyunis', 'central'],
    title: { ar: 'قصف على خيام النازحين', en: 'Strike on Displacement Tents' },
    story: {
      ar: 'أنتم في مخيم للنازحين. في الفجر، ضربت غارة جوية الخيام المجاورة. الصراخ. الدخان. الناس يركضون. لا مكان آمن حتى في خيمة النزوح.',
      en: 'You\'re in a displacement camp. At dawn, an airstrike hit the adjacent tents. Screaming. Smoke. People running. Even a displacement tent isn\'t safe.'
    },
    noChoice: true,
    consequences: {
      food: -2, water: -2,
      memberEffects: [{ target: 'random', health: -25, causeOfDeath: 'injury' }],
      message: { ar: 'في غزة، لا يوجد مكان محدد بـ"آمن". 92% من أماكن الإيواء تعرضت للقصف.', en: 'In Gaza, no place is designated "safe." 92% of shelter locations came under fire.' }
    }
  },

  {
    id: 'evt_018',
    phase: [2, 3, 4, 7],
    locations: 'all',
    title: { ar: 'اتصال بأحد الأقارب في الخارج', en: 'Call from a Relative Abroad' },
    story: {
      ar: 'اتصل بك قريب من خارج غزة. يبكي. يقول "كيف أساعدك؟" يريد إرسال مال عبر التحويلات. لكن البنوك مغلقة وشبكة الإنترنت تنقطع كل دقيقة.',
      en: 'A relative from outside Gaza calls. They are crying. "How can I help you?" They want to send money through transfers. But banks are closed and the internet cuts every minute.'
    },
    choices: [
      {
        text: { ar: 'اشرح الوضع وحاول ترتيب تحويل', en: 'Explain the situation and try to arrange a transfer' },
        consequences: {
          money: 300,
          message: { ar: 'نجح التحويل جزئياً. وصل بعض المال عبر مسالك غير رسمية. الحياة مستمرة.', en: 'The transfer partially succeeded. Some money arrived through informal channels. Life continues.' }
        }
      },
      {
        text: { ar: 'أغلق الخط — لا يمكن الشرح', en: 'End the call — impossible to explain' },
        consequences: {
          memberEffects: [{ target: 'player', morale: -15 }],
          message: { ar: 'أغلقتَ الخط. بعض الأشياء لا يمكن شرحها لمن لا يعيشها.', en: 'You ended the call. Some things can\'t be explained to those not living it.' }
        }
      }
    ]
  },

  {
    id: 'evt_019',
    phase: [3, 6, 7],
    locations: 'all',
    title: { ar: 'قرار: ابقَ أم ارحل؟', en: 'Decision: Stay or Leave?' },
    story: {
      ar: 'تتشكل قافلة نزوح جديدة باتجاه الجنوب. يقول بعضهم أن الجنوب أكثر أماناً الآن. لكن رحلتم مرة من قبل وخسرتم كل شيء. لا تعرف ما الصواب.',
      en: 'A new displacement convoy forms heading south. Some say the south is safer now. But you\'ve left before and lost everything. You don\'t know what\'s right.'
    },
    choices: [
      {
        text: { ar: 'انضم للقافلة وارحل', en: 'Join the convoy and leave' },
        consequences: {
          displace: true,
          message: { ar: 'رحلتم مرة أخرى. المرة الثالثة أو الرابعة. لا أحد يحسب.', en: 'You left again. The third or fourth time. No one counts anymore.' }
        }
      },
      {
        text: { ar: 'ابقَ — لا تستطيع التحمّل أكثر', en: 'Stay — you can\'t bear more displacement' },
        consequences: {
          dangerIncrease: 2,
          memberEffects: [{ target: 'random', morale: 10 }],
          message: { ar: 'بقيتَ. ما زال البيت موجوداً — أو ما تبقى منه. البقاء بحد ذاته مقاومة.', en: 'You stayed. The home still exists — or what\'s left of it. Staying is itself resistance.' }
        }
      }
    ]
  },

  {
    id: 'evt_020',
    phase: [1, 2, 3, 4, 5, 6, 7, 8],
    locations: 'all',
    title: { ar: 'يوم بلا أحداث — فقط انتظار', en: 'A Day Without Events — Just Waiting' },
    story: {
      ar: 'لم يحدث شيء مميز اليوم. لا أحداث. مجرد يوم آخر من الانتظار والخوف والجوع. هذا هو أصعب نوع من الأيام.',
      en: 'Nothing special happened today. No events. Just another day of waiting, fear, and hunger. This is the hardest kind of day.'
    },
    noChoice: true,
    consequences: {
      memberEffects: [{ target: 'random', morale: -8 }],
      message: { ar: 'الحياة في غزة ليست فقط لحظات القصف. إنها أيضاً كل هذه الساعات بين القصفات.', en: 'Life in Gaza is not only the moments of bombing. It\'s also all the hours between them.' }
    }
  },

  {
    id: 'evt_021',
    phase: [3, 6, 7],
    locations: 'all',
    title: { ar: 'مقتل صحفي في الحي', en: 'Journalist Killed in the Neighborhood' },
    story: {
      ar: 'كان يوثّق الأوضاع في الحي. قُتل اليوم برصاصة قناص وهو يحمل كاميرته. قالوا إنه كان آخر شاهد على ما يحدث هنا.',
      en: 'He was documenting conditions in the neighborhood. Today he was killed by a sniper\'s bullet while holding his camera. They said he was the last witness to what happens here.'
    },
    noChoice: true,
    consequences: {
      memberEffects: [{ target: 'random', morale: -20 }],
      message: { ar: 'قُتل أكثر من 100 صحفي في غزة. الأعلى في تاريخ الصراعات الحديثة.', en: 'More than 100 journalists were killed in Gaza. The highest in modern conflict history.' }
    }
  },

  {
    id: 'evt_022',
    phase: [5, 8],
    locations: 'all',
    title: { ar: 'إفراج عن أسرى', en: 'Prisoner Exchange' },
    story: {
      ar: 'في إطار صفقة تبادل، أُطلق سراح بعض الأسرى. في الشارع فرحة مشوبة بالحزن على من لم يعودوا بعد.',
      en: 'As part of a prisoner exchange deal, some captives were released. In the streets, joy is tinged with grief for those who haven\'t returned yet.'
    },
    noChoice: true,
    consequences: {
      memberEffects: [{ target: 'random', morale: 15 }],
      message: { ar: 'لحظات الفرح في غزة نادرة ولكنها تُحيي الروح.', en: 'Moments of joy in Gaza are rare but they revive the spirit.' }
    }
  },

  {
    id: 'evt_023',
    phase: [2, 3, 4],
    locations: 'all',
    title: { ar: 'فرصة مغادرة القطاع', en: 'Chance to Leave Gaza' },
    story: {
      ar: 'فُتح معبر رفح لفترة قصيرة. يمكن مغادرة القطاع لمن لديه جواز سفر أجنبي أو تأشيرة. لكن معظم أفراد عائلتك لا يملكون هذا الخيار.',
      en: 'Rafah crossing opened briefly. Those with foreign passports or visas can leave. But most of your family doesn\'t have this option.'
    },
    choices: [
      {
        text: { ar: 'اغادر أنتَ وحدك إن كان بإمكانك', en: 'Leave by yourself if you can' },
        consequences: {
          message: { ar: 'غادرتَ. تركتَ عائلتك. هذا الخيار ليس خياراً حقيقياً.', en: 'You left. You abandoned your family. This choice is not a real choice.' }
        }
      },
      {
        text: { ar: 'لا تغادر — العائلة لا تتجزأ', en: 'Don\'t leave — family stays together' },
        consequences: {
          memberEffects: [{ target: 'random', morale: 20 }],
          message: { ar: 'بقيتَ مع عائلتك. في غزة، البقاء معاً هو كل ما تملكه.', en: 'You stayed with your family. In Gaza, staying together is all you have.' }
        }
      }
    ]
  },

  {
    id: 'evt_024',
    phase: [7, 8],
    locations: 'all',
    title: { ar: 'بعد 400 يوم', en: 'After 400 Days' },
    story: {
      ar: 'مرّت أكثر من 400 يوم. لا أحد تخيّل هذا يستمر هكذا. الجوع متواصل. القصف متواصل. والعالم ما زال يتابع.',
      en: 'More than 400 days have passed. No one imagined this would go on like this. Hunger continues. Bombing continues. And the world is still watching.'
    },
    noChoice: true,
    consequences: {
      memberEffects: [{ target: 'random', morale: -15 }, { target: 'random', hunger: 10 }],
      message: { ar: 'الصمود ليس بطولة مختارة — إنه الخيار الوحيد المتاح.', en: 'Resilience is not a chosen heroism — it is the only available option.' }
    }
  },
];

// Helper: get events for current phase and location
function getAvailableEvents(phaseId, location) {
  return EVENTS.filter(ev => {
    const phaseMatch = ev.phase.includes(phaseId);
    const locMatch = ev.locations === 'all' || ev.locations.includes(location);
    return phaseMatch && locMatch;
  });
}

// Pick a random event (weighted toward non-noChoice first)
function pickRandomEvent(phaseId, location, recentIds = []) {
  let pool = getAvailableEvents(phaseId, location);
  if (pool.length === 0) pool = EVENTS.filter(ev => ev.phase.includes(phaseId));
  if (pool.length === 0) pool = EVENTS;

  // Filter out recently seen events
  const fresh = pool.filter(ev => !recentIds.includes(ev.id));
  const candidates = fresh.length > 0 ? fresh : pool;

  return candidates[Math.floor(Math.random() * candidates.length)];
}
