// family.js - Family management system for Gaza war simulation

const RELATIONS = ['spouse', 'child', 'parent', 'sibling'];

function createFamilyMember(name, age, relation) {
  return {
    name,
    age: parseInt(age) || 30,
    relation,
    health: 100,
    morale: 100,
    status: 'alive',       // alive | critical | dead
    causeOfDeath: null,
    monthOfDeath: null,
    injured: false,        // true if lost a limb (permanent health -60)
  };
}

function createPlayer(name, location, financialClass, profession) {
  return {
    name,
    location,            // north | gaza | central | khanyunis | rafah
    financialClass,      // poor | middle | comfortable | rich
    profession: profession || '',
    health: 100,
    morale: 100,
    status: 'alive',
    injured: false,
    captured: false,
    relation: 'self',
    age: 35,
    causeOfDeath: null,
    monthOfDeath: null,
  };
}

const FamilyManager = {
  player: null,
  members: [],   // includes player at index 0
  job: '',
  profession: '',

  init(playerName, location, financialClass, familyData, profession) {
    this.player = createPlayer(playerName, location, financialClass, profession || '');
    this.job = profession || '';
    this.profession = profession || '';
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

  getChildrenCount() {
    return this.members.filter(m => m.status !== 'dead' && (m.relation === 'child' || m.age < 12)).length;
  },

  hasChildren() {
    return this.getChildrenCount() > 0;
  },

  getWeakest() {
    const alive = this.getAlive();
    if (!alive.length) return null;
    return alive.reduce((min, m) => m.health < min.health ? m : min, alive[0]);
  },

  getLocation() {
    return this.player ? this.player.location : 'gaza';
  },

  setLocation(loc) {
    if (this.player) this.player.location = loc;
  },

  // Apply health/morale effect to all alive members
  applyToAll(effect, month) {
    const alive = this.getAlive();
    const deaths = [];
    for (const m of alive) {
      if (effect.health !== undefined) {
        m.health = Math.max(0, Math.min(100, m.health + effect.health));
      }
      if (effect.morale !== undefined) {
        m.morale = Math.max(0, Math.min(100, m.morale + effect.morale));
      }
      this._checkDeath(m, effect.causeOfDeath || 'injury', month, deaths);
    }
    return deaths;
  },

  // Apply effect to all children only
  applyToChildren(effect, month) {
    const children = this.getAlive().filter(m => m.relation === 'child' || m.age < 12);
    const deaths = [];
    for (const m of children) {
      if (effect.health !== undefined) {
        m.health = Math.max(0, Math.min(100, m.health + effect.health));
      }
      if (effect.morale !== undefined) {
        m.morale = Math.max(0, Math.min(100, m.morale + effect.morale));
      }
      this._checkDeath(m, effect.causeOfDeath || 'starvation', month, deaths);
    }
    return deaths;
  },

  // Apply effect to a specific member or random alive member
  applyEffect(target, effect, month) {
    let member = null;
    const alive = this.getAlive();
    if (alive.length === 0) return null;

    if (target === 'random') {
      member = alive[Math.floor(Math.random() * alive.length)];
    } else if (target === 'player') {
      member = this.player;
    } else if (target === 'child') {
      const children = alive.filter(m => m.relation === 'child' || m.age < 18);
      member = children.length
        ? children[Math.floor(Math.random() * children.length)]
        : alive[Math.floor(Math.random() * alive.length)];
    } else if (target === 'weakest') {
      member = this.getWeakest();
    } else {
      member = alive[Math.floor(Math.random() * alive.length)];
    }

    if (!member) return null;

    if (effect.health !== undefined) {
      member.health = Math.max(0, Math.min(100, member.health + effect.health));
    }
    if (effect.morale !== undefined) {
      member.morale = Math.max(0, Math.min(100, member.morale + effect.morale));
    }
    if (effect.injure) {
      member.injured = true;
      member.health = Math.max(0, member.health - 60);
    }
    if (effect.captured && target === 'player' && this.player) {
      this.player.captured = true;
      this.player.health = Math.max(0, this.player.health - 40);
    }

    const deaths = [];
    this._checkDeath(member, effect.causeOfDeath || 'injury', month, deaths);
    return deaths.length > 0 ? deaths[0] : null;
  },

  _checkDeath(member, cause, month, deaths) {
    if (member.health <= 0 && member.status !== 'dead') {
      member.status = 'dead';
      member.causeOfDeath = cause;
      member.monthOfDeath = month;
      if (deaths) deaths.push(member);
    } else if (member.health < 20) {
      member.status = 'critical';
    } else if (member.status === 'critical' && member.health >= 20) {
      member.status = 'alive';
    }
  },

  // Monthly health tick — apply bankruptcy health drain, etc.
  monthlyTick(month, isBankrupt) {
    const deaths = [];
    const alive = this.getAlive();
    for (const m of alive) {
      if (isBankrupt) {
        m.health = Math.max(0, m.health - 10);
      }
      this._checkDeath(m, 'starvation', month, deaths);
    }
    return deaths;
  },
};
