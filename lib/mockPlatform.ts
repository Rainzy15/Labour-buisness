export const mockBookings = [
  { id: "BK-1042", customer: "Claire Muller", service: "Grass care", date: "2026-05-15", time: "09:00", status: "requested", price: "€39", employee: "Unassigned" },
  { id: "BK-1041", customer: "Tom Weber", service: "Hedge care", date: "2026-05-15", time: "13:30", status: "scheduled", price: "€72", employee: "Mia" },
  { id: "BK-1040", customer: "Sofia Ribeiro", service: "Pressure washing", date: "2026-05-16", time: "10:30", status: "confirmed", price: "€105", employee: "Leo" },
  { id: "BK-1039", customer: "Residence Kirchberg", service: "Winter safety", date: "2026-05-17", time: "08:00", status: "quote_sent", price: "€69.50/mo", employee: "Unassigned" }
];

export const mockCustomers = [
  { id: "CU-301", name: "Claire Muller", commune: "Bertrange", lifetime: "€320", lastService: "2026-04-29", flag: "VIP" },
  { id: "CU-302", name: "Tom Weber", commune: "Luxembourg City", lifetime: "€210", lastService: "2026-05-03", flag: "Standard" },
  { id: "CU-303", name: "Sofia Ribeiro", commune: "Mamer", lifetime: "€490", lastService: "2026-05-08", flag: "Bundle lead" }
];

export const mockEmployees = [
  { id: "EM-11", name: "Mia Hoffmann", skills: "Mowing, hedges", status: "active", jobs: 18, rating: "4.8" },
  { id: "EM-12", name: "Leo Schmit", skills: "Pressure washing, winter", status: "active", jobs: 14, rating: "4.7" },
  { id: "EM-13", name: "Noah Ferreira", skills: "Mowing, garden tidy-up", status: "active", jobs: 9, rating: "4.9" }
];

export const mockContracts = [
  { id: "CT-500", customer: "Claire Muller", title: "Summer Grass Care Bundle", status: "active", value: "€74.50/mo" },
  { id: "CT-501", customer: "Residence Kirchberg", title: "Winter Safety Bundle", status: "draft", value: "€124.50/mo" }
];

export const mockInvoices = [
  { id: "INV-2026-001", customer: "Claire Muller", status: "paid", total: "€74.50", due: "2026-05-01" },
  { id: "INV-2026-002", customer: "Tom Weber", status: "sent", total: "€72", due: "2026-05-20" },
  { id: "INV-2026-003", customer: "Sofia Ribeiro", status: "overdue", total: "€105", due: "2026-05-10" }
];

export const mockEquipment = [
  { name: "Honda lawn mower", type: "Lawn mower", status: "available", note: "Ready" },
  { name: "Karcher K7", type: "Pressure washer", status: "maintenance", note: "Hose check" },
  { name: "Salt spreader", type: "Winter", status: "available", note: "Stored" }
];
