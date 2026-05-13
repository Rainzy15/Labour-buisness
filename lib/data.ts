import {
  BadgeCheck,
  Bike,
  CalendarDays,
  Droplets,
  Flower2,
  Home,
  Leaf,
  MapPin,
  Shovel,
  Snowflake,
  Sparkles,
  Sprout,
  TreePine,
  Waves
} from "lucide-react";

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/bundles", label: "Bundles" },
  { href: "/robot-mower-rental", label: "Robot Rental" },
  { href: "/equipment", label: "Equipment" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export const areas = [
  "Luxembourg City",
  "Bertrange",
  "Strassen",
  "Mamer",
  "Hesperange",
  "Esch-sur-Alzette",
  "Differdange",
  "Dudelange",
  "Kirchberg",
  "Cloche d'Or"
];

export const trustBadges = ["Transparent pricing", "Seasonal packages", "Luxembourg-wide service", "Fast booking"];

export const seasons = [
  {
    name: "Summer",
    accent: "bg-lime/70 text-forest",
    icon: Sprout,
    price: "from €50",
    summary: "Regular mowing, hedge care, weeding, watering support, and green waste removal.",
    services: ["Lawn care", "Hedge care", "Weeding and garden tidy-up", "Watering support", "Green waste removal"]
  },
  {
    name: "Autumn",
    accent: "bg-autumn/15 text-autumn",
    icon: Leaf,
    price: "from €45",
    summary: "Leaves, pre-winter hedge trimming, terrace cleaning, and winter preparation.",
    services: ["Leaf clearing", "Hedge trimming before winter", "Pressure washing", "Gutter/terrace clean-up", "Garden preparation for winter"]
  },
  {
    name: "Winter",
    accent: "bg-winter text-forest",
    icon: Snowflake,
    price: "from €35",
    summary: "Snow clearing, salting, access path visits, driveways, and winter safety support.",
    services: ["Snow clearing", "Salting", "Access path clearing", "Driveway clearing", "Winter safety visits"]
  },
  {
    name: "Spring",
    accent: "bg-fresh/15 text-forest",
    icon: Flower2,
    price: "from €60",
    summary: "Restart the lawn, wash outdoor surfaces, shape hedges, and refresh planting.",
    services: ["Lawn care restart", "Pressure washing", "Scarifying / aeration", "Hedge shaping", "Planting and garden refresh"]
  }
];

export const serviceSections = [
  {
    title: "Summer Services",
    intro: "Keep the garden easy to enjoy during the fastest growing months.",
    items: [
      ["Lawn Care", "Regular mowing, edge trimming, optional grass collection and mulching.", "€0.25/m² base, minimum €50 per visit", Sprout],
      ["Hedge Care", "Hedge trimming, shape correction, and height/density adjustments.", "€10/linear metre base", TreePine],
      ["Weeding & Garden Tidy", "Hourly hand work for beds, borders, paths, and small clean-ups.", "€45/hour", Sparkles],
      ["Watering Support", "Short visits while clients are away in warmer periods.", "€25-45/visit", Droplets],
      ["Green Waste Removal", "Add-on collection for clippings, leaves, and trimmings.", "€15-60 depending on quantity", Leaf]
    ]
  },
  {
    title: "Autumn Services",
    intro: "Prepare the property for cold weather and heavy leaf fall.",
    items: [
      ["Leaf Clearing", "Raking, blowing, collection, bagging, or compost pile support.", "€0.20/m² base, minimum €45", Leaf],
      ["Pressure Washing", "Terraces, paths, patios, and driveways before winter grime sets in.", "€12/m² base, minimum €80", Waves],
      ["Hedge Pre-Winter Trim", "Neat final shaping before growth slows down.", "€10-15/linear metre", TreePine],
      ["Garden Winter Prep", "General hourly maintenance for beds, leaves, pots, and outdoor areas.", "€45/hour", CalendarDays]
    ]
  },
  {
    title: "Winter Services",
    intro: "Keep paths, driveways, residences, and small businesses safer in bad weather.",
    items: [
      ["Snow Clearing", "Paths, driveways, steps, entrances, and access routes.", "€0.35/m² base, minimum €45", Shovel],
      ["Salting", "Standalone or add-on salting with practical de-icing coverage.", "€0.12/m² base, minimum €35", Snowflake],
      ["Emergency Winter Visit", "Same-day and early morning visits when conditions change quickly.", "+25% same-day/emergency surcharge", BadgeCheck],
      ["Residence / Small Business Winter Safety", "Priority winter planning for shared entrances and commercial access.", "Custom quote", Home]
    ]
  },
  {
    title: "Spring Services",
    intro: "Reset the garden after winter and get it looking sharp early.",
    items: [
      ["Lawn Restart", "First mow, edge trim, and light clean-up after winter.", "€0.30/m² base, minimum €60", Flower2],
      ["Pressure Washing", "Refresh terraces, paths, stone, and outdoor surfaces.", "€12/m²", Waves],
      ["Scarifying / Aeration", "Placeholder service for deeper lawn recovery.", "€0.80/m² base, minimum €90", Sprout],
      ["Planting / Refresh", "Hourly planting help and seasonal garden refreshes.", "€45/hour", Flower2],
      ["Hedge Shaping", "Early-season structure and clean growth lines.", "€10/linear metre", TreePine]
    ]
  }
];

export const bundles = [
  {
    name: "Summer Lawn Care Bundle",
    bestFor: "Families who want a neat lawn all season.",
    includes: ["Weekly or biweekly mowing", "Edge trimming", "1 hedge tidy session", "Green waste add-on discount"],
    frequency: "Weekly or every 2 weeks",
    price: "from €149/month",
    savings: "up to 12%"
  },
  {
    name: "Full Garden Summer Bundle",
    bestFor: "Homes that need steady garden care.",
    includes: ["Lawn care", "Hedge care", "Weeding", "Green waste removal"],
    frequency: "Monthly plan",
    price: "from €249/month",
    savings: "up to 15%"
  },
  {
    name: "Autumn Clean-Up Bundle",
    bestFor: "Leaf-heavy gardens and terraces.",
    includes: ["Leaf clearing", "Hedge pre-winter trim", "Terrace/path pressure wash discount"],
    frequency: "One-off or 3 visits",
    price: "from €199",
    savings: "up to 10%"
  },
  {
    name: "Winter Safety Bundle",
    bestFor: "Homes, landlords, and small offices.",
    includes: ["Snow clearing", "Salting", "Priority visits", "Path/driveway safety"],
    frequency: "Winter standby",
    price: "from €129/month",
    savings: "custom"
  },
  {
    name: "Spring Reset Bundle",
    bestFor: "A clean restart after winter.",
    includes: ["First mow", "Lawn restart", "Pressure washing", "Hedge shaping"],
    frequency: "One-off reset",
    price: "from €229",
    savings: "up to 10%"
  },
  {
    name: "Robot Mower Season Bundle",
    bestFor: "Trying automatic mowing before buying.",
    includes: ["Robot mower rental", "Assisted setup", "Mid-season check", "Optional winter storage"],
    frequency: "Seasonal rental",
    price: "from €399/season",
    savings: "vs. €1000 upfront"
  }
];

export const equipment = [
  ["Lawn mower", "Clean, efficient mowing for lawns from small city gardens to larger family properties.", ["Lawn care"], "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=80"],
  ["Strimmer / edge trimmer", "Sharp borders around paths, fences, walls, and beds.", ["Edges", "Finishing"], "https://images.unsplash.com/photo-1599685315640-328014947a3a?auto=format&fit=crop&w=900&q=80"],
  ["Blower and rake", "Fast leaf clearing and tidy final passes.", ["Leaves", "Clean-up"], "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80"],
  ["Hedge trimmer", "Neat seasonal hedge shaping with clean lines.", ["Hedges"], "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=900&q=80"],
  ["Pressure washer", "Terraces, stone paths, driveways, and patios.", ["Pressure washing"], "https://images.unsplash.com/photo-1603708900766-2263a6b0d6ad?auto=format&fit=crop&w=900&q=80"],
  ["Snow shovel and salt spreader", "Practical winter access clearing and salting.", ["Winter"], "https://images.unsplash.com/photo-1608315398428-c6d76804838d?auto=format&fit=crop&w=900&q=80"],
  ["Robot mower kit", "Robot mower, charging station, spare blades, and setup support.", ["Robot rental"], "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=900&q=80"]
];

export const faqs = {
  Pricing: [
    ["Are prices final?", "No. Online prices are realistic estimates. A final quote depends on access, terrain, waste volume, travel distance, urgency, and exact site conditions."],
    ["Why can prices change?", "Long grass, stairs, narrow access, heavy waste, difficult slopes, and weather can all affect labour time."],
    ["Is VAT included?", "Placeholder: VAT wording can be customized depending on your legal setup."],
    ["Is there a minimum visit fee?", "Yes. Minimum fees keep short visits fair once travel, setup, and clean-up time are included."]
  ],
  "Lawn Care": [
    ["How often should I mow?", "Weekly or every two weeks works best during strong growth. Monthly can suit slower periods or lower-maintenance lawns."],
    ["Do you collect grass?", "Yes, grass collection can be added. Mulching may be available when conditions are suitable."],
    ["What if the grass is very long?", "Long or overgrown grass takes more time and may need a surcharge or staged cut."]
  ],
  Winter: [
    ["Do you offer emergency snow clearing?", "Yes, where availability allows. Same-day and early morning visits include urgency multipliers."],
    ["Is salting included?", "Salting can be booked alone or combined with snow clearing."],
    ["Do you serve private homes and residences?", "Yes. The service is suitable for homes, residences, small offices, and landlords."]
  ],
  "Robot Rental": [
    ["Is setup included?", "DIY setup is included in the base rental. Assisted or full setup can be added."],
    ["Is there a deposit?", "Yes, the placeholder deposit is €200 and is shown separately from the service price."],
    ["What lawn size works best?", "The rental calculator supports lawns from 100-1000 m²."],
    ["Can I rent only for one month?", "Yes. Longer rentals receive seasonal discounts."]
  ]
};

export const testimonials = [
  ["Claire M.", "Bertrange", "The estimate was clear before the visit and the garden looked properly finished. Very easy communication."],
  ["Tom W.", "Luxembourg City", "Booked mowing and hedge care for a rental property. Reliable, tidy, and no confusing pricing."],
  ["Sofia R.", "Mamer", "The autumn clean-up saved us a full weekend. Leaves, terrace, and edges were all handled."]
];

export const imageAlt = {
  lawn: "Freshly mowed Luxembourg garden lawn",
  hedge: "Trimmed garden hedge in a residential property",
  leaves: "Autumn leaves being cleared from a garden",
  pressure: "Clean terrace after pressure washing",
  snow: "Snow clearing on a driveway",
  robot: "Robot lawn mower working on green grass"
};

export const quickStats = [
  ["Typical lawn visit", "from €50"],
  ["Robot mower rental", "from €69/month"],
  ["Winter salting", "from €35/visit"]
];

export const process = [
  ["Choose lawn size", MapPin],
  ["Select rental duration", CalendarDays],
  ["Choose setup option", BadgeCheck],
  ["We deliver / install", Bike],
  ["You enjoy automatic mowing", Sparkles]
];
