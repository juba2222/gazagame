// resources.js - Financial model for Gaza war simulation

const FINANCIAL_CLASSES = {
  poor:        { nameAr: 'فقير',  nameEn: 'Poor',         salary: 300,  savings: 0,     debtLimit: 100,   descAr: 'راتب $300/شهر · مدخرات $0',       descEn: '$300/mo · $0 savings' },
  middle:      { nameAr: 'متوسط', nameEn: 'Middle Class', salary: 800,  savings: 1500,  debtLimit: 500,   descAr: 'راتب $800/شهر · مدخرات $1,500',    descEn: '$800/mo · $1,500 savings' },
  comfortable: { nameAr: 'ميسور', nameEn: 'Comfortable',  salary: 2000, savings: 10000, debtLimit: 2000,  descAr: 'راتب $2,000/شهر · مدخرات $10,000', descEn: '$2,000/mo · $10,000 savings' },
  rich:        { nameAr: 'غني',   nameEn: 'Wealthy',      salary: 5000, savings: 50000, debtLimit: 10000, descAr: 'راتب $5,000/شهر · مدخرات $50,000', descEn: '$5,000/mo · $50,000 savings' },
};

const ResourceManager = {
  financialClass: 'middle',
  baseSalary: 0,
  savings: 0,
  debtLimit: 0,
  debt: 0,
  workHours: 8,
  workActive: true,
  salaryPenalty: 0,          // fraction (0.10 = 10% cut, accumulated)
  activeMonthlyBurdens: [],  // [{id, amount, labelAr, labelEn}]
  monthlyDeathHazard: 0,     // accumulated probability from working
  jobMultiplier: 1.0,
  workRiskLevel: 'low',

  init(financialClass, jobMultiplier) {
    const fc = FINANCIAL_CLASSES[financialClass] || FINANCIAL_CLASSES.middle;
    this.financialClass = financialClass;
    this.baseSalary = fc.salary;
    this.savings = fc.savings;
    this.debtLimit = fc.debtLimit;
    this.debt = 0;
    this.workHours = 8;
    this.workActive = true;
    this.salaryPenalty = 0;
    this.activeMonthlyBurdens = [];
    this.monthlyDeathHazard = 0;
    this.jobMultiplier = jobMultiplier || 1.0;
  },

  effectiveSalary() {
    if (!this.workActive) return 0;
    return Math.round(this.baseSalary * this.jobMultiplier * (1 - this.salaryPenalty));
  },

  totalMonthlyBurden() {
    return this.activeMonthlyBurdens.reduce((s, b) => s + b.amount, 0);
  },

  canAfford(amount) {
    const available = this.savings + Math.max(0, this.debtLimit - this.debt);
    return available >= amount;
  },

  pay(amount) {
    if (amount <= 0) return true;
    if (amount <= this.savings) {
      this.savings -= amount;
      return true;
    }
    const fromSavings = this.savings;
    this.savings = 0;
    const fromDebt = amount - fromSavings;
    if (this.debt + fromDebt <= this.debtLimit) {
      this.debt += fromDebt;
      return true;
    }
    // Can't fully pay — max out debt
    this.debt = this.debtLimit;
    return false;
  },

  receive(amount) {
    if (amount <= 0) return;
    // First pay off debt, then add to savings
    if (this.debt > 0) {
      const payoff = Math.min(this.debt, amount);
      this.debt -= payoff;
      amount -= payoff;
    }
    this.savings += amount;
  },

  addMonthlyBurden(id, amount, labelAr, labelEn) {
    const existing = this.activeMonthlyBurdens.find(b => b.id === id);
    if (existing) {
      existing.amount = amount;
    } else {
      this.activeMonthlyBurdens.push({ id, amount, labelAr, labelEn });
    }
  },

  removeMonthlyBurden(id) {
    this.activeMonthlyBurdens = this.activeMonthlyBurdens.filter(b => b.id !== id);
  },

  addSalaryPenalty(fraction) {
    this.salaryPenalty = Math.min(0.95, this.salaryPenalty + fraction);
  },

  restoreSalary(fraction) {
    this.salaryPenalty = Math.max(0, this.salaryPenalty - fraction);
  },

  processMonth() {
    const earned = this.effectiveSalary();
    this.receive(earned);
    const burden = this.totalMonthlyBurden();
    const paid = this.pay(burden);
    return { earned, burden, paid };
  },

  isBankrupt() {
    return this.savings <= 0 && this.debt >= this.debtLimit;
  },

  snapshot() {
    return {
      savings: this.savings,
      debt: this.debt,
      debtLimit: this.debtLimit,
      salary: this.effectiveSalary(),
      burden: this.totalMonthlyBurden(),
      workHours: this.workActive ? this.workHours : 0,
    };
  },
};
