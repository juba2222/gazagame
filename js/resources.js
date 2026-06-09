// resources.js - Resource management

const INITIAL_RESOURCES = {
  poor:   { food: 3,  water: 5,  money: 200,  medicine: 1, fuel: 0 },
  middle: { food: 7,  water: 10, money: 800,  medicine: 3, fuel: 2 },
  welloff:{ food: 15, water: 20, money: 3000, medicine: 8, fuel: 5 },
};

const ResourceManager = {
  food: 0,
  water: 0,
  money: 0,
  medicine: 0,
  fuel: 0,

  init(livingStandard) {
    const base = INITIAL_RESOURCES[livingStandard] || INITIAL_RESOURCES.middle;
    this.food     = base.food;
    this.water    = base.water;
    this.money    = base.money;
    this.medicine = base.medicine;
    this.fuel     = base.fuel;
  },

  apply(delta) {
    if (delta.food     !== undefined) this.food     = Math.max(0, this.food     + delta.food);
    if (delta.water    !== undefined) this.water    = Math.max(0, this.water    + delta.water);
    if (delta.money    !== undefined) this.money    = Math.max(0, this.money    + delta.money);
    if (delta.medicine !== undefined) this.medicine = Math.max(0, this.medicine + delta.medicine);
    if (delta.fuel     !== undefined) this.fuel     = Math.max(0, this.fuel     + delta.fuel);
  },

  // Forced displacement: lose most possessions
  displacementLoss() {
    this.food     = Math.floor(this.food     * 0.3);
    this.water    = Math.floor(this.water    * 0.4);
    this.money    = Math.floor(this.money    * 0.5);
    this.medicine = Math.floor(this.medicine * 0.4);
    this.fuel     = 0;
  },

  snapshot() {
    return { food: this.food, water: this.water, money: this.money, medicine: this.medicine, fuel: this.fuel };
  },

  isCritical() {
    return this.food <= 1 || this.water <= 1;
  },

  getDisplayValue(key) {
    const v = this[key];
    if (typeof v !== 'number') return '0';
    return key === 'money' ? v.toLocaleString() : Math.floor(v).toString();
  },
};
