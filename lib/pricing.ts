export const PRICING = {
  lawn: {
    basePerSqm: 0.125,
    springFirstCutPerSqm: 0.15,
    premiumCarePerSqm: 0.175,
    minimumVisit: 27.5,
    smallGardenMinimum: 25,
    edgeTrimming: 7.5,
    grassCollectionPerSqm: 0.03,
    greenWasteRemovalSmall: 10,
    greenWasteRemovalLarge: 17.5,
    longGrassMultiplier: 1.15,
    overgrownMultiplier: 1.4,
    wetGrassMultiplier: 1.1,
    mediumTerrainMultiplier: 1.1,
    difficultTerrainMultiplier: 1.25,
    narrowAccessSurcharge: 6,
    complexAccessSurcharge: 12.5,
    travelBaseIncludedKm: 10,
    travelSurcharge: 5,
    discounts: { weekly: 0.15, biweekly: 0.1, monthly: 0.05 }
  },
  hedge: {
    basePerLinearMeter: 5,
    minimumJob: 32.5,
    wasteRemoval: 15,
    accessSurcharge: 7.5,
    heightMultipliers: { under150cm: 0.85, from150to250cm: 1.0, over250cm: 1.4 },
    densityMultipliers: { light: 0.9, normal: 1.0, dense: 1.25 },
    shapingMultipliers: { basic: 1.0, clean: 1.1, premium: 1.25 }
  },
  leaves: {
    basePerSqm: 0.11,
    minimumVisit: 25,
    mediumDensityMultiplier: 1.15,
    heavyDensityMultiplier: 1.45,
    baggingFee: 6,
    takeAwayFeeSmall: 17.5,
    takeAwayFeeLarge: 27.5,
    planDiscounts: { threeVisits: 0.08, fiveVisits: 0.12 }
  },
  pressureWashing: {
    basePerSqm: 6,
    minimumJob: 42.5,
    protectiveTreatmentPerSqm: 1.5,
    noWaterWarningFee: 0,
    limitedDrainageMultiplier: 1.1,
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
    snowPerSqm: 0.19,
    saltingPerSqm: 0.07,
    snowMinimum: 25,
    saltingMinimum: 19,
    combinedMinimum: 32.5,
    sameDayMultiplier: 1.2,
    emergencyMorningMultiplier: 1.4,
    smallBusinessMultiplier: 1.2,
    standbyMonthlyFrom: 69.5
  },
  hourly: {
    hourlyRatePerWorker: 27.5,
    minimumHours: 2,
    secondWorkerMultiplier: 2,
    wasteRemoval: 15,
    plantingHandlingFee: 10
  }
} as const;

export type BreakdownKind = "base" | "addon" | "difficulty" | "discount" | "minimum";
export type BreakdownLine = { label: string; amount: number; kind?: BreakdownKind };
export type EstimateCadence = "one-time" | "per-visit" | "monthly" | "season";
export type Estimate = {
  id: string;
  name: string;
  category: "lawn" | "hedge" | "leaves" | "pressure" | "winter" | "hourly";
  total: number;
  cadence: EstimateCadence;
  perVisit?: number;
  monthly?: number;
  deposit?: number;
  savings?: number;
  visitsPerMonth?: number;
  confidence: "High" | "Medium" | "Needs confirmation";
  included: string[];
  mayChange: string[];
  recommendation: string;
  breakdown: BreakdownLine[];
  warnings?: string[];
  note?: string;
};

export const eur = (value: number) =>
  new Intl.NumberFormat("en-LU", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.max(0, Math.round(value)));

const minimum = (value: number, min: number) => Math.max(value, min);
const sum = (lines: BreakdownLine[]) => lines.reduce((total, line) => total + line.amount, 0);

function minimumLine(current: number, min: number): BreakdownLine {
  return { label: "Minimum job adjustment", amount: Math.max(0, min - current), kind: "minimum" };
}

function visitsForFrequency(frequency: "oneTime" | "weekly" | "biweekly" | "monthly") {
  if (frequency === "weekly") return 4;
  if (frequency === "biweekly") return 2;
  if (frequency === "monthly") return 1;
  return undefined;
}

export function calculateLawn(input: {
  size: number;
  season?: "spring" | "summer" | "autumn";
  frequency: "oneTime" | "weekly" | "biweekly" | "monthly";
  grass: "normal" | "long" | "overgrown" | "wet";
  edge: boolean;
  collection: boolean;
  waste: boolean;
  terrain: "easy" | "medium" | "difficult";
  access: "easy" | "narrow" | "complex";
  travel: "near" | "mid" | "far";
  care: "basic" | "standard" | "premium";
}) {
  const p = PRICING.lawn;
  const rate = input.care === "premium" ? p.premiumCarePerSqm : input.season === "spring" ? p.springFirstCutPerSqm : p.basePerSqm;
  const base = input.size * rate;
  const lines: BreakdownLine[] = [{ label: `${input.size} m² lawn care`, amount: base, kind: "base" }];

  const grassMultiplier = input.grass === "long" ? p.longGrassMultiplier : input.grass === "overgrown" ? p.overgrownMultiplier : input.grass === "wet" ? p.wetGrassMultiplier : 1;
  const terrainMultiplier = input.terrain === "medium" ? p.mediumTerrainMultiplier : input.terrain === "difficult" ? p.difficultTerrainMultiplier : 1;
  const difficultyBase = base * grassMultiplier * terrainMultiplier;
  lines.push({ label: "Grass and terrain adjustment", amount: difficultyBase - base, kind: "difficulty" });

  const edge = input.edge || input.care === "standard" || input.care === "premium" ? p.edgeTrimming : 0;
  const collection = input.collection || input.care === "premium" ? input.size * p.grassCollectionPerSqm : 0;
  const waste = input.waste ? (input.size > 500 ? p.greenWasteRemovalLarge : p.greenWasteRemovalSmall) : 0;
  const access = input.access === "narrow" ? p.narrowAccessSurcharge : input.access === "complex" ? p.complexAccessSurcharge : 0;
  const travel = input.travel === "mid" ? p.travelSurcharge : input.travel === "far" ? p.travelSurcharge * 2 : 0;
  lines.push({ label: "Add-ons and access", amount: edge + collection + waste + access + travel, kind: "addon" });

  const beforeMinimum = sum(lines);
  lines.push(minimumLine(beforeMinimum, input.size < 100 ? p.smallGardenMinimum : p.minimumVisit));
  const beforeDiscount = sum(lines);
  const discountRate = input.frequency === "weekly" ? p.discounts.weekly : input.frequency === "biweekly" ? p.discounts.biweekly : input.frequency === "monthly" ? p.discounts.monthly : 0;
  lines.push({ label: "Regular visit discount", amount: -beforeDiscount * discountRate, kind: "discount" });

  const perVisit = sum(lines);
  const visits = visitsForFrequency(input.frequency);
  return {
    id: "lawn",
    name: "Lawn care",
    category: "lawn",
    total: perVisit,
    cadence: input.frequency === "oneTime" ? "per-visit" : "per-visit",
    perVisit,
    monthly: visits ? perVisit * visits : undefined,
    visitsPerMonth: visits,
    savings: beforeDiscount * discountRate,
    confidence: input.access === "complex" || input.grass === "overgrown" ? "Medium" : "High",
    included: input.care === "premium" ? ["Mowing", "Edge trimming", "Grass collection", "Visual clean-up"] : input.care === "standard" ? ["Mowing", "Edge trimming"] : ["Mowing"],
    mayChange: ["Very steep terrain", "Hidden obstacles", "Waste volume", "Exact parking/access"],
    recommendation: input.frequency === "oneTime" ? "Biweekly visits usually keep Luxembourg lawns neat with 10% savings." : "Recurring lawn care is the best value for steady summer growth.",
    breakdown: lines,
    warnings: input.grass === "overgrown" ? ["Overgrown lawns may need a staged first cut."] : undefined
  } satisfies Estimate;
}

export function calculateHedge(input: {
  length: number;
  height: "under150cm" | "from150to250cm" | "over250cm";
  density: "light" | "normal" | "dense";
  shaping: "basic" | "clean" | "premium";
  waste: boolean;
  access: "easy" | "complex";
}) {
  const p = PRICING.hedge;
  const base = input.length * p.basePerLinearMeter;
  const adjusted = base * p.heightMultipliers[input.height] * p.densityMultipliers[input.density] * p.shapingMultipliers[input.shaping];
  const lines: BreakdownLine[] = [
    { label: `${input.length} linear metres`, amount: base, kind: "base" },
    { label: "Height, density, shaping", amount: adjusted - base, kind: "difficulty" },
    { label: "Waste and access", amount: (input.waste ? p.wasteRemoval : 0) + (input.access === "complex" ? p.accessSurcharge : 0), kind: "addon" }
  ];
  lines.push(minimumLine(sum(lines), p.minimumJob));
  const total = sum(lines);
  return {
    id: "hedge",
    name: "Hedge care",
    category: "hedge",
    total,
    cadence: "one-time",
    confidence: input.height === "over250cm" ? "Needs confirmation" : "Medium",
    included: ["Hedge trimming", "Shape correction", "Clean working area"],
    mayChange: ["Height over 2.5m", "Dense old growth", "Ladder/safety access", "Waste volume"],
    recommendation: "Pair hedge care with lawn service for a Summer Garden Bundle suggestion.",
    breakdown: lines,
    warnings: input.height === "over250cm" ? ["Hedges over 2.5m may require special equipment or quote confirmation."] : undefined,
    note: `Estimated working time: ${Math.max(1, Math.ceil(input.length / 12))}-${Math.max(2, Math.ceil(input.length / 8))} hours.`
  } satisfies Estimate;
}

export function calculateLeaves(input: {
  area: number;
  density: "light" | "medium" | "heavy";
  removal: "bags" | "takeAway" | "compost";
  frequency: "oneTime" | "threeVisits" | "fiveVisits";
}) {
  const p = PRICING.leaves;
  const densityMultiplier = input.density === "medium" ? p.mediumDensityMultiplier : input.density === "heavy" ? p.heavyDensityMultiplier : 1;
  const base = input.area * p.basePerSqm * densityMultiplier;
  const removal = input.removal === "takeAway" ? (input.area > 600 ? p.takeAwayFeeLarge : p.takeAwayFeeSmall) : input.removal === "bags" ? p.baggingFee : 0;
  const visits = input.frequency === "threeVisits" ? 3 : input.frequency === "fiveVisits" ? 5 : 1;
  const discountRate = input.frequency === "threeVisits" ? p.planDiscounts.threeVisits : input.frequency === "fiveVisits" ? p.planDiscounts.fiveVisits : 0;
  const perVisit = minimum(base + removal, p.minimumVisit);
  const beforeDiscount = perVisit * visits;
  const discount = beforeDiscount * discountRate;
  return {
    id: "leaves",
    name: "Leaf clearing",
    category: "leaves",
    total: beforeDiscount - discount,
    cadence: input.frequency === "oneTime" ? "one-time" : "season",
    perVisit,
    savings: discount,
    confidence: input.density === "heavy" ? "Medium" : "High",
    included: ["Leaf blowing/raking", "Collection into agreed area", input.removal === "takeAway" ? "Green waste take-away" : input.removal === "bags" ? "Bagging" : "Compost pile on property"],
    mayChange: ["Wet compacted leaves", "Large tree volume", "Difficult disposal access"],
    recommendation: input.frequency === "oneTime" ? "A 3-visit autumn plan avoids heavy build-up and saves 8%." : "Autumn plans keep paths and lawns safer through peak leaf fall.",
    breakdown: [
      { label: `${input.area} m² leaf clearing`, amount: base * visits, kind: "base" },
      { label: "Waste handling", amount: removal * visits, kind: "addon" },
      { label: "Autumn plan discount", amount: -discount, kind: "discount" }
    ]
  } satisfies Estimate;
}

export function calculatePressure(input: {
  area: number;
  surface: "terrace" | "driveway" | "stonePath" | "facadeLower";
  dirt: "lightDirt" | "normalDirt" | "heavyMoss";
  treatment: boolean;
  water: "available" | "notAvailable";
  drainage: "easy" | "limited";
}) {
  const p = PRICING.pressureWashing;
  const base = input.area * p.basePerSqm;
  let adjusted = base * p.multipliers[input.surface] * p.multipliers[input.dirt];
  if (input.drainage === "limited") adjusted *= p.limitedDrainageMultiplier;
  const treatment = input.treatment ? input.area * p.protectiveTreatmentPerSqm : 0;
  const lines: BreakdownLine[] = [
    { label: `${input.area} m² surface cleaning`, amount: base, kind: "base" },
    { label: "Surface, dirt, drainage adjustment", amount: adjusted - base, kind: "difficulty" },
    { label: "Protective treatment", amount: treatment, kind: "addon" }
  ];
  lines.push(minimumLine(sum(lines), p.minimumJob));
  return {
    id: "pressure",
    name: "Pressure washing",
    category: "pressure",
    total: sum(lines),
    cadence: "one-time",
    confidence: input.water === "notAvailable" ? "Needs confirmation" : "High",
    included: ["Surface wash", "Edge rinse", "Basic site clean-up"],
    mayChange: ["No water access", "Poor drainage", "Heavy moss/algae", "Fragile stone"],
    recommendation: "Pressure washing pairs well with Spring Reset or Autumn Clean-Up bundles.",
    warnings: input.water === "notAvailable" ? ["Requires confirmation before booking because water access is not available."] : undefined,
    breakdown: lines
  } satisfies Estimate;
}

export function calculateWinter(input: {
  area: number;
  service: "snow" | "salting" | "combined";
  timing: "planned" | "sameDay" | "emergency";
  property: "pathway" | "driveway" | "residence" | "business";
  contract: "oneTime" | "standby";
}) {
  const p = PRICING.winter;
  if (input.contract === "standby") {
    return {
      id: "winter",
      name: "Winter safety standby",
      category: "winter",
      total: p.standbyMonthlyFrom,
      monthly: p.standbyMonthlyFrom,
      cadence: "monthly",
      confidence: "Medium",
      included: ["Priority winter planning", "2 planned checks/month", "Snow and salting readiness"],
      mayChange: ["Snowfall frequency", "Emergency timing", "Salt volume", "Commercial access requirements"],
      recommendation: "Winter standby is best for residences, landlords, and small offices needing reliable access.",
      breakdown: [{ label: "Standby contract from", amount: p.standbyMonthlyFrom, kind: "base" }],
      note: "Extra visits are calculated separately. Winter services are weather-dependent."
    } satisfies Estimate;
  }

  const rate = input.service === "snow" ? p.snowPerSqm : input.service === "salting" ? p.saltingPerSqm : p.snowPerSqm + p.saltingPerSqm;
  const min = input.service === "snow" ? p.snowMinimum : input.service === "salting" ? p.saltingMinimum : p.combinedMinimum;
  let adjusted = minimum(input.area * rate, min);
  const beforeTiming = adjusted;
  if (input.timing === "sameDay") adjusted *= p.sameDayMultiplier;
  if (input.timing === "emergency") adjusted *= p.emergencyMorningMultiplier;
  if (input.property === "business") adjusted *= p.smallBusinessMultiplier;

  return {
    id: "winter",
    name: "Snow clearing and salting",
    category: "winter",
    total: adjusted,
    perVisit: adjusted,
    cadence: "per-visit",
    confidence: "Medium",
    included: [input.service === "combined" ? "Snow clearing and salting" : input.service === "snow" ? "Snow clearing" : "Salting", "Access path focus", "Weather-dependent visit"],
    mayChange: ["Fresh snowfall amount", "Ice thickness", "Emergency timing", "Salt required"],
    recommendation: input.service === "combined" ? "Snow clearing plus salting qualifies for the Winter Safety Bundle suggestion." : "Combined snow clearing and salting is safer for repeated winter access.",
    breakdown: [
      { label: `${input.area} m² winter service`, amount: beforeTiming, kind: "base" },
      { label: "Urgency and property adjustment", amount: adjusted - beforeTiming, kind: "difficulty" }
    ],
    note: "Winter services are weather-dependent."
  } satisfies Estimate;
}

export function calculateHourly(input: {
  hours: number;
  workers: 1 | 2;
  service: "weeding" | "planting" | "tidy" | "help" | "mixed";
  waste: boolean;
  materials: boolean;
}) {
  const p = PRICING.hourly;
  const hours = Math.max(input.hours, p.minimumHours);
  const base = hours * input.workers * p.hourlyRatePerWorker;
  const waste = input.waste ? p.wasteRemoval : 0;
  const materials = input.materials || input.service === "planting" ? p.plantingHandlingFee : 0;
  return {
    id: "hourly",
    name: "Hourly garden work",
    category: "hourly",
    total: base + waste + materials,
    cadence: "one-time",
    confidence: "Medium",
    included: [`${hours} labour hours minimum`, `${input.workers} worker${input.workers > 1 ? "s" : ""}`, "General garden support"],
    mayChange: ["Materials cost", "Green waste volume", "Scope discovered on site"],
    recommendation: "Hourly work is best for mixed garden tidy-up, planting help, and small outdoor tasks.",
    breakdown: [
      { label: "Labour", amount: base, kind: "base" },
      { label: "Waste removal", amount: waste, kind: "addon" },
      { label: "Materials handling", amount: materials, kind: "addon" }
    ]
  } satisfies Estimate;
}
