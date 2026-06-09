// family.js - Family management system

const RELATIONS = ['spouse', 'child', 'parent', 'sibling'];

function createFamilyMember(name, age, relation) {
  return {
    name,
    age: parseInt(age),
    relation,
    health: 100,
    hunger: 0,
    thirst: 0,
    morale: 100,
    status: 'alive',       // alive | critical | dead
    daysWithoutFood: 0,
    daysWithoutWater: 0,
    causeOfDeath: null,
    dayOfDeath: null,
    phaseOfDeath: null,
    sick: false,
    injured: false,
  };
}

function createPlayer(name, location, livingStandard) {
  return {
    name,
    location,            // north | gaza | central | khanyunis | rafah
    livingStandard,      // poor | middle | welloff
    health: 100,
    hunger: 0,
    thirst: 0,
    morale: 100,
    status: 'alive',
    daysWithoutFood: 0,
    daysWithoutWater: 0,
    sick: false,
    injured: false,
    relation: 'self',
    age: 35,
    causeOfDeath: null,
    dayOfDeath: null,
  };
}

const FamilyManager = {
  player: null,
  members: [],   // includes player at index 0

  init(playerName, location, livingStandard, familyData) {
    this.player = createPlayer(playerName, location, livingStandard);
    this.members = [this.player];
    for (const fd of familyData) {
      if (fd.name && fd.name.trim()) {
        this.members.push(createFamilyMember(fd.name.trim(), fd.age || 30, fd.relation || 'sibling'));
      }
    }
  },

  getAlive() {
    return this.members.filter(m => m.status !== 'dead');
  },

  getDead() {
    return this.members.filter(m => m.status === 'dead');
  },

  allDead() {
    return this.members.every(m => m.status === 'dead');
  },

  // Apply daily hunger/thirst tick
  dailyTick(resources, day, phase) {
    const deaths = [];
    const alive = this.getAlive();
    const memberCount = alive.length;

    // --- Food consumption ---
    if (resources.food > 0) {
      const foodPerPerson = resources.food / memberCount;
      // Each person needs ~1.5 units per day; partial feeding increases hunger
      const totalNeeded = memberCount * 1.5;
      const satisfied = Math.min(1, resources.food / totalNeeded);

      resources.food = Math.max(0, resources.food - totalNeeded);

      for (const m of alive) {
        if (satisfied >= 0.9) {
          m.hunger = Math.max(0, m.hunger - 10);
          m.daysWithoutFood = 0;
        } else if (satisfied >= 0.5) {
          m.hunger += 8;
          m.daysWithoutFood += 0.5;
        } else {
          m.hunger += 15;
          m.daysWithoutFood += 1;
        }
      }
    } else {
      for (const m of alive) {
        m.hunger += 18;
        m.daysWithoutFood += 1;
      }
    }

    // --- Water consumption ---
    if (resources.water > 0) {
      const totalWaterNeeded = memberCount * 1.0;
      const waterSatisfied = Math.min(1, resources.water / totalWaterNeeded);
      resources.water = Math.max(0, resources.water - totalWaterNeeded);

      for (const m of alive) {
        if (waterSatisfied >= 0.8) {
          m.thirst = Math.max(0, m.thirst - 10);
          m.daysWithoutWater = 0;
        } else {
          m.thirst += 20;
          m.daysWithoutWater += 1;
        }
      }
    } else {
      for (const m of alive) {
        m.thirst += 25;
        m.daysWithoutWater += 1;
      }
    }

    // --- Cap values ---
    for (const m of alive) {
      m.hunger = Math.min(100, m.hunger);
      m.thirst = Math.min(100, m.thirst);
    }

    // --- Health degradation from hunger/thirst ---
    for (const m of alive) {
      if (m.hunger > 75) {
        m.health -= Math.floor((m.hunger - 75) / 5) + 1;
      }
      if (m.thirst > 70) {
        m.health -= Math.floor((m.thirst - 70) / 4) + 2;
      }
      if (m.sick) {
        m.health -= 5;
        if (resources.medicine > 0) {
          resources.medicine -= 0.5;
          m.health += 3;  // partial recovery
          if (m.health >= 40) m.sick = false;
        }
      }
      m.health = Math.max(0, Math.min(100, m.health));

      // Update status
      if (m.health <= 0) {
        m.status = 'dead';
        // Determine cause
        if (m.daysWithoutWater >= 3) {
          m.causeOfDeath = 'thirst';
        } else if (m.daysWithoutFood >= 5) {
          m.causeOfDeath = 'hunger';
        } else if (m.sick) {
          m.causeOfDeath = 'disease';
        } else {
          m.causeOfDeath = 'injury';
        }
        m.dayOfDeath = day;
        m.phaseOfDeath = phase;
        deaths.push(m);
      } else if (m.health < 20) {
        m.status = 'critical';
      } else {
        m.status = 'alive';
      }
    }

    return deaths;
  },

  // Apply effect to a specific member or random alive member
  applyEffect(target, effect, day, phase) {
    let member = null;
    const alive = this.getAlive();
    if (alive.length === 0) return null;

    if (target === 'random') {
      member = alive[Math.floor(Math.random() * alive.length)];
    } else if (target === 'player') {
      member = this.player;
    } else if (target === 'child') {
      const children = alive.filter(m => m.relation === 'child' || m.age < 18);
      member = children.length ? children[Math.floor(Math.random() * children.length)] : alive[Math.floor(Math.random() * alive.length)];
    } else if (target === 'weakest') {
      member = alive.reduce((min, m) => m.health < min.health ? m : min, alive[0]);
    } else {
      member = alive[Math.floor(Math.random() * alive.length)];
    }

    if (!member) return null;

    if (effect.health !== undefined) member.health = Math.max(0, Math.min(100, member.health + effect.health));
    if (effect.hunger !== undefined) member.hunger = Math.max(0, Math.min(100, member.hunger + effect.hunger));
    if (effect.morale !== undefined) member.morale = Math.max(0, Math.min(100, member.morale + effect.morale));
    if (effect.sick) member.sick = true;

    if (member.health <= 0 && member.status !== 'dead') {
      member.status = 'dead';
      member.causeOfDeath = effect.causeOfDeath || 'injury';
      member.dayOfDeath = day;
      member.phaseOfDeath = phase;
      return member;
    }
    if (member.health < 20) member.status = 'critical';

    return null;  // no death
  },

  getLocation() {
    return this.player ? this.player.location : 'gaza';
  },

  setLocation(loc) {
    if (this.player) this.player.location = loc;
  },
};
