export const DEFAULT_SERVICES = [
  {
    name: "Lawn Care",
    category: "lawn",
    season: "Summer",
    description: "Regular mowing, edge trimming, optional grass collection, and tidy finishing.",
    base_price: 34.375,
    pricing_unit: "visit"
  },
  {
    name: "Lawn Restart",
    category: "lawn",
    season: "Spring",
    description: "First mow, edge trim, and light clean-up after winter.",
    base_price: 37.5,
    pricing_unit: "visit"
  },
  {
    name: "Scarifying / Aeration",
    category: "lawn",
    season: "Spring",
    description: "Seasonal lawn recovery placeholder for deeper spring maintenance.",
    base_price: 56.25,
    pricing_unit: "job"
  },
  {
    name: "Hedge Care",
    category: "hedge",
    season: "Summer",
    description: "Hedge trimming, shape correction, and clean finishing.",
    base_price: 40.625,
    pricing_unit: "job"
  },
  {
    name: "Hedge Pre-Winter Trim",
    category: "hedge",
    season: "Autumn",
    description: "Final hedge shaping before winter growth slows down.",
    base_price: 40.625,
    pricing_unit: "job"
  },
  {
    name: "Hedge Shaping",
    category: "hedge",
    season: "Spring",
    description: "Early-season hedge shaping and clean growth lines.",
    base_price: 40.625,
    pricing_unit: "job"
  },
  {
    name: "Weeding & Garden Tidy",
    category: "hourly",
    season: "Summer",
    description: "Hourly hand work for beds, borders, paths, and small garden clean-ups.",
    base_price: 27.5,
    pricing_unit: "hour"
  },
  {
    name: "Garden Maintenance",
    category: "hourly",
    season: "All year",
    description: "Weeding, planting, tidy-up, and minor outdoor help.",
    base_price: 27.5,
    pricing_unit: "hour"
  },
  {
    name: "Garden Winter Prep",
    category: "hourly",
    season: "Autumn",
    description: "General hourly maintenance for beds, leaves, pots, and outdoor areas before winter.",
    base_price: 27.5,
    pricing_unit: "hour"
  },
  {
    name: "Planting / Refresh",
    category: "hourly",
    season: "Spring",
    description: "Hourly planting help and seasonal garden refreshes.",
    base_price: 27.5,
    pricing_unit: "hour"
  },
  {
    name: "Watering Support",
    category: "general",
    season: "Summer",
    description: "Short watering visits while clients are away in warmer periods.",
    base_price: 17.5,
    pricing_unit: "visit"
  },
  {
    name: "Green Waste Removal",
    category: "general",
    season: "All year",
    description: "Add-on collection for clippings, leaves, and trimmings.",
    base_price: 15,
    pricing_unit: "job"
  },
  {
    name: "Leaf Clearing",
    category: "leaves",
    season: "Autumn",
    description: "Raking, blowing, collection, bagging, or compost pile support.",
    base_price: 25,
    pricing_unit: "visit"
  },
  {
    name: "Pressure Washing",
    category: "pressure",
    season: "Spring",
    description: "Terraces, driveways, stone paths, patios, and lower facade cleaning.",
    base_price: 42.5,
    pricing_unit: "job"
  },
  {
    name: "Terrace / Path Clean-Up",
    category: "pressure",
    season: "Autumn",
    description: "Outdoor surface clean-up before winter grime and moss build up.",
    base_price: 42.5,
    pricing_unit: "job"
  },
  {
    name: "Snow Clearing",
    category: "winter",
    season: "Winter",
    description: "Paths, driveways, steps, entrances, and access routes.",
    base_price: 25,
    pricing_unit: "visit"
  },
  {
    name: "Salting",
    category: "winter",
    season: "Winter",
    description: "Standalone or add-on salting with practical de-icing coverage.",
    base_price: 19,
    pricing_unit: "visit"
  },
  {
    name: "Emergency Winter Visit",
    category: "winter",
    season: "Winter",
    description: "Same-day and early morning winter visits when conditions change quickly.",
    base_price: 35,
    pricing_unit: "visit"
  },
  {
    name: "Residence / Small Business Winter Safety",
    category: "winter",
    season: "Winter",
    description: "Priority winter planning for shared entrances, residences, landlords, and small offices.",
    base_price: 69.5,
    pricing_unit: "month"
  }
] as const;
