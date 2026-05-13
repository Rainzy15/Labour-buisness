export const PRICING = {
  lawn: {
    basePerSqm: 0.25,
    springFirstCutPerSqm: 0.3,
    minimum: 50,
    edgeTrim: 15,
    grassCollectionPerSqm: 0.05,
    greenWasteRemoval: 20,
    longGrassMultiplier: 1.15,
    overgrownMultiplier: 1.35,
    mediumTerrainMultiplier: 1.1,
    difficultTerrainMultiplier: 1.2,
    narrowAccessSurcharge: 10,
    complexAccessSurcharge: 20,
    discounts: { weekly: 0.15, biweekly: 0.1, monthly: 0.05 }
  },
  hedge: {
    basePerLinearMeter: 10,
    minimum: 60,
    wasteRemoval: 25,
    heightMultipliers: { low: 0.85, medium: 1.0, high: 1.35 },
    densityMultipliers: { light: 0.9, normal: 1.0, dense: 1.25 },
    shapingMultipliers: { basic: 1.0, clean: 1.1, premium: 1.2 }
  },
  leaves: {
    basePerSqm: 0.2,
    minimum: 45,
    mediumDensityMultiplier: 1.15,
    heavyDensityMultiplier: 1.4,
    baggingFee: 10,
    takeAwayFee: 35,
    planDiscounts: { threeVisits: 0.08, fiveVisits: 0.12 }
  },
  pressureWashing: {
    basePerSqm: 12,
    minimum: 80,
    protectiveTreatmentPerSqm: 3,
    multipliers: {
      terrace: 1.0,
      driveway: 1.05,
      stonePath: 1.0,
      facadeLower: 1.25,
      lightDirt: 0.9,
      normalDirt: 1.0,
      heavyMoss: 1.3
    }
  },
  winter: {
    snowPerSqm: 0.35,
    saltingPerSqm: 0.12,
    snowMinimum: 45,
    saltingMinimum: 35,
    combinedMinimum: 60,
    sameDayMultiplier: 1.2,
    emergencyMultiplier: 1.35,
    smallBusinessMultiplier: 1.2,
    standbyFromMonthly: 129
  },
  hourly: {
    hourlyRatePerWorker: 45,
    minimumHours: 2,
    wasteRemoval: 25,
    plantingHandlingFee: 15
  },
  robotRental: {
    smallMonthly: 69,
    mediumMonthly: 89,
    largeMonthly: 119,
    assistedSetup: 99,
    fullSetup: 249,
    delivery10to25km: 25,
    delivery25kmPlus: 45,
    monthlyMaintenance: 29,
    midSeasonCheck: 59,
    refundableDeposit: 200,
    winterStorage: 49,
    durationDiscounts: { oneMonth: 0, threeMonths: 0.05, sixMonths: 0.12, eightMonths: 0.15 }
  }
} as const;

export type BreakdownLine = { label: string; amount: number };
export type Estimate = {
  name: string;
  total: number;
  monthly?: number;
  deposit?: number;
  savings?: number;
  breakdown: BreakdownLine[];
  note?: string;
};

export const eur = (value: number) =>
  new Intl.NumberFormat("en-LU", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    Math.max(0, Math.round(value))
  );

const minimum = (value: number, min: number) => Math.max(value, min);

// Lawn formula: start with m² rate, apply grass and terrain multipliers, add flat/per-m² add-ons,
// then apply frequency discounts while preserving the minimum visit price.
export function calculateLawn(input: {
  size: number;
  frequency: "oneTime" | "weekly" | "biweekly" | "monthly";
  grass: "normal" | "long" | "overgrown";
  edge: boolean;
  collection: boolean;
  waste: boolean;
  terrain: "easy" | "medium" | "difficult";
  access: "easy" | "narrow" | "complex";
}) {
  const p = PRICING.lawn;
  let base = input.size * p.basePerSqm;
  const lines: BreakdownLine[] = [{ label: "Base mowing", amount: base }];

  if (input.grass === "long") base *= p.longGrassMultiplier;
  if (input.grass === "overgrown") base *= p.overgrownMultiplier;
  if (input.terrain === "medium") base *= p.mediumTerrainMultiplier;
  if (input.terrain === "difficult") base *= p.difficultTerrainMultiplier;

  let addOns = 0;
  if (input.edge) addOns += p.edgeTrim;
  if (input.collection) addOns += input.size * p.grassCollectionPerSqm;
  if (input.waste) addOns += p.greenWasteRemoval;
  if (input.access === "narrow") addOns += p.narrowAccessSurcharge;
  if (input.access === "complex") addOns += p.complexAccessSurcharge;

  const beforeDiscount = minimum(base + addOns, p.minimum);
  const discount =
    input.frequency === "weekly" ? p.discounts.weekly : input.frequency === "biweekly" ? p.discounts.biweekly : input.frequency === "monthly" ? p.discounts.monthly : 0;
  const total = minimum(beforeDiscount * (1 - discount), p.minimum);
  const visits = input.frequency === "weekly" ? 4.33 : input.frequency === "biweekly" ? 2.16 : input.frequency === "monthly" ? 1 : 1;

  lines.push({ label: "Difficulty and access adjustments", amount: base - input.size * p.basePerSqm });
  lines.push({ label: "Add-ons", amount: addOns });
  lines.push({ label: "Regular visit discount", amount: -beforeDiscount * discount });
  return { name: "Lawn care", total, monthly: total * visits, savings: beforeDiscount - total, breakdown: lines };
}

// Hedge formula: linear metres are multiplied by height, density, and shaping precision.
// Waste removal is a flat add-on and every hedge job respects the minimum job price.
export function calculateHedge(input: {
  length: number;
  height: "low" | "medium" | "high";
  density: "light" | "normal" | "dense";
  shaping: "basic" | "clean" | "premium";
  waste: boolean;
}) {
  const p = PRICING.hedge;
  const base = input.length * p.basePerLinearMeter;
  let adjusted = base * p.heightMultipliers[input.height] * p.densityMultipliers[input.density] * p.shapingMultipliers[input.shaping];
  const waste = input.waste ? p.wasteRemoval : 0;
  const total = minimum(adjusted + waste, p.minimum);
  return {
    name: "Hedge care",
    total,
    breakdown: [
      { label: "Linear metres", amount: base },
      { label: "Height, density, shaping", amount: adjusted - base },
      { label: "Waste removal", amount: waste }
    ]
  };
}

// Leaf formula: area price is adjusted by density, removal option, visit count, and autumn plan discount.
export function calculateLeaves(input: {
  area: number;
  density: "light" | "medium" | "heavy";
  removal: "bags" | "takeAway" | "compost";
  frequency: "oneTime" | "threeVisits" | "fiveVisits";
}) {
  const p = PRICING.leaves;
  let base = input.area * p.basePerSqm;
  if (input.density === "medium") base *= p.mediumDensityMultiplier;
  if (input.density === "heavy") base *= p.heavyDensityMultiplier;
  const removal = input.removal === "takeAway" ? p.takeAwayFee : input.removal === "bags" ? p.baggingFee : 0;
  const visits = input.frequency === "threeVisits" ? 3 : input.frequency === "fiveVisits" ? 5 : 1;
  const discount = input.frequency === "threeVisits" ? p.planDiscounts.threeVisits : input.frequency === "fiveVisits" ? p.planDiscounts.fiveVisits : 0;
  const before = minimum(base + removal, p.minimum) * visits;
  const total = before * (1 - discount);
  return {
    name: "Leaf clearing",
    total,
    savings: before - total,
    breakdown: [
      { label: "Leaf clearing", amount: base * visits },
      { label: "Removal option", amount: removal * visits },
      { label: "Autumn plan discount", amount: -before * discount }
    ]
  };
}

// Pressure washing formula: surface area uses the base m² rate, then surface and dirt multipliers apply.
// Protective treatment is a separate per-m² add-on.
export function calculatePressure(input: {
  area: number;
  surface: "terrace" | "driveway" | "stonePath" | "facadeLower";
  dirt: "lightDirt" | "normalDirt" | "heavyMoss";
  treatment: boolean;
}) {
  const p = PRICING.pressureWashing;
  const base = input.area * p.basePerSqm;
  const adjusted = base * p.multipliers[input.surface] * p.multipliers[input.dirt];
  const treatment = input.treatment ? input.area * p.protectiveTreatmentPerSqm : 0;
  return {
    name: "Pressure washing",
    total: minimum(adjusted + treatment, p.minimum),
    breakdown: [
      { label: "Surface cleaning", amount: base },
      { label: "Surface and dirt adjustment", amount: adjusted - base },
      { label: "Protective treatment", amount: treatment }
    ]
  };
}

// Winter formula: snow and salting use separate m² rates and minimums.
// Timing and small-business multipliers account for urgency and site expectations.
export function calculateWinter(input: {
  area: number;
  service: "snow" | "salting" | "combined";
  timing: "planned" | "sameDay" | "emergency";
  surface: "pathway" | "driveway" | "residence" | "business";
  contract: "oneTime" | "standby";
}) {
  const p = PRICING.winter;
  if (input.contract === "standby") {
    return {
      name: "Winter standby",
      total: p.standbyFromMonthly,
      monthly: p.standbyFromMonthly,
      note: "Includes 2 planned visits/month. Extra visits calculated separately.",
      breakdown: [{ label: "Standby contract from", amount: p.standbyFromMonthly }]
    };
  }
  let raw = input.service === "snow" ? input.area * p.snowPerSqm : input.service === "salting" ? input.area * p.saltingPerSqm : input.area * (p.snowPerSqm + p.saltingPerSqm);
  const min = input.service === "snow" ? p.snowMinimum : input.service === "salting" ? p.saltingMinimum : p.combinedMinimum;
  raw = minimum(raw, min);
  if (input.timing === "sameDay") raw *= p.sameDayMultiplier;
  if (input.timing === "emergency") raw *= p.emergencyMultiplier;
  if (input.surface === "business") raw *= p.smallBusinessMultiplier;
  return {
    name: "Winter snow and salting",
    total: raw,
    note: "Winter services are weather-dependent.",
    breakdown: [
      { label: "Snow/salting service", amount: minimum(input.area * (input.service === "combined" ? p.snowPerSqm + p.saltingPerSqm : input.service === "snow" ? p.snowPerSqm : p.saltingPerSqm), min) },
      { label: "Timing and site adjustment", amount: raw - min }
    ]
  };
}

// Hourly formula: bookings are charged by worker-hour with a two-hour minimum,
// plus optional waste removal and a placeholder planting handling fee.
export function calculateHourly(input: { hours: number; workers: 1 | 2; service: "weeding" | "planting" | "tidy" | "help" | "mixed"; waste: boolean }) {
  const p = PRICING.hourly;
  const hours = Math.max(input.hours, p.minimumHours);
  const base = hours * input.workers * p.hourlyRatePerWorker;
  const planting = input.service === "planting" ? p.plantingHandlingFee : 0;
  const waste = input.waste ? p.wasteRemoval : 0;
  return {
    name: "General hourly garden help",
    total: base + planting + waste,
    breakdown: [
      { label: "Labour", amount: base },
      { label: "Materials handling", amount: planting },
      { label: "Waste removal", amount: waste }
    ]
  };
}

// Robot rental formula: choose monthly tier by lawn size, multiply by duration,
// apply duration discount, then add setup, delivery, maintenance, and storage.
// The refundable deposit is shown separately so it does not inflate service revenue.
export function calculateRobot(input: {
  size: number;
  duration: "oneMonth" | "threeMonths" | "sixMonths" | "eightMonths";
  setup: "diy" | "assisted" | "full";
  maintenance: "none" | "monthly" | "midSeason";
  delivery: "near" | "mid" | "far";
  deposit: boolean;
  storage: boolean;
}) {
  const p = PRICING.robotRental;
  const months = input.duration === "oneMonth" ? 1 : input.duration === "threeMonths" ? 3 : input.duration === "sixMonths" ? 6 : 8;
  const monthly = input.size <= 300 ? p.smallMonthly : input.size <= 600 ? p.mediumMonthly : p.largeMonthly;
  const discount = p.durationDiscounts[input.duration];
  const rental = monthly * months * (1 - discount);
  const setup = input.setup === "assisted" ? p.assistedSetup : input.setup === "full" ? p.fullSetup : 0;
  const delivery = input.delivery === "mid" ? p.delivery10to25km : input.delivery === "far" ? p.delivery25kmPlus : 0;
  const maintenance = input.maintenance === "monthly" ? p.monthlyMaintenance * months : input.maintenance === "midSeason" ? p.midSeasonCheck : 0;
  const storage = input.storage ? p.winterStorage : 0;
  const total = rental + setup + delivery + maintenance + storage;
  return {
    name: "Robot mower rental",
    total,
    monthly,
    deposit: input.deposit ? p.refundableDeposit : undefined,
    savings: 1000 - total,
    breakdown: [
      { label: "Rental period", amount: rental },
      { label: "Setup", amount: setup },
      { label: "Delivery", amount: delivery },
      { label: "Maintenance", amount: maintenance },
      { label: "Winter storage", amount: storage },
      { label: "Duration discount", amount: -(monthly * months * discount) }
    ]
  };
}
