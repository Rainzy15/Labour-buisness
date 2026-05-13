export const mockBookings = [
  { id: "BK-1042", customer: "Claire Muller", service: "Lawn care", date: "2026-05-15", time: "09:00", status: "requested", price: "€78", employee: "Unassigned" },
  { id: "BK-1041", customer: "Tom Weber", service: "Hedge care", date: "2026-05-15", time: "13:30", status: "scheduled", price: "€145", employee: "Mia" },
  { id: "BK-1040", customer: "Sofia Ribeiro", service: "Pressure washing", date: "2026-05-16", time: "10:30", status: "confirmed", price: "€210", employee: "Leo" },
  { id: "BK-1039", customer: "Residence Kirchberg", service: "Winter safety", date: "2026-05-17", time: "08:00", status: "quote_sent", price: "€139/mo", employee: "Unassigned" }
];

export const mockCustomers = [
  { id: "CU-301", name: "Claire Muller", commune: "Bertrange", lifetime: "€640", lastService: "2026-04-29", flag: "VIP" },
  { id: "CU-302", name: "Tom Weber", commune: "Luxembourg City", lifetime: "€420", lastService: "2026-05-03", flag: "Standard" },
  { id: "CU-303", name: "Sofia Ribeiro", commune: "Mamer", lifetime: "€980", lastService: "2026-05-08", flag: "Bundle lead" }
];

export const mockEmployees = [
  { id: "EM-11", name: "Mia Hoffmann", skills: "Mowing, hedges", status: "active", jobs: 18, rating: "4.8" },
  { id: "EM-12", name: "Leo Schmit", skills: "Pressure washing, winter", status: "active", jobs: 14, rating: "4.7" },
  { id: "EM-13", name: "Noah Ferreira", skills: "Robot setup, mowing", status: "active", jobs: 9, rating: "4.9" }
];

export const mockContracts = [
  { id: "CT-500", customer: "Claire Muller", title: "Summer Lawn Care Bundle", status: "active", value: "€149/mo" },
  { id: "CT-501", customer: "Residence Kirchberg", title: "Winter Safety Bundle", status: "draft", value: "€249/mo" }
];

export const mockInvoices = [
  { id: "INV-2026-001", customer: "Claire Muller", status: "paid", total: "€149", due: "2026-05-01" },
  { id: "INV-2026-002", customer: "Tom Weber", status: "sent", total: "€145", due: "2026-05-20" },
  { id: "INV-2026-003", customer: "Sofia Ribeiro", status: "overdue", total: "€210", due: "2026-05-10" }
];

export const mockEquipment = [
  { name: "Honda lawn mower", type: "Lawn mower", status: "available", note: "Ready" },
  { name: "Karcher K7", type: "Pressure washer", status: "maintenance", note: "Hose check" },
  { name: "Robot mower A", type: "Robot mower", status: "in_use", note: "Rental active" },
  { name: "Salt spreader", type: "Winter", status: "available", note: "Stored" }
];

export const mockRobotRentals = [
  { id: "RR-700", customer: "Sofia Ribeiro", plan: "Medium", monthly: "€99", status: "active", deposit: "held" },
  { id: "RR-701", customer: "Tom Weber", plan: "Small", monthly: "€79", status: "requested", deposit: "pending" }
];
