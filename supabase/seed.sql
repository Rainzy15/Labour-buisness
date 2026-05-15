insert into public.services (name, category, season, description, base_price, pricing_unit, active)
select *
from (values
  ('Lawn Care', 'lawn', 'Summer', 'Regular mowing, edge trimming, optional grass collection, and tidy finishing.', 27.5, 'visit', true),
  ('Lawn Restart', 'lawn', 'Spring', 'First mow, edge trim, and light clean-up after winter.', 30, 'visit', true),
  ('Scarifying / Aeration', 'lawn', 'Spring', 'Seasonal lawn recovery placeholder for deeper spring maintenance.', 45, 'job', true),
  ('Hedge Care', 'hedge', 'Summer', 'Hedge trimming, shape correction, and clean finishing.', 32.5, 'job', true),
  ('Hedge Pre-Winter Trim', 'hedge', 'Autumn', 'Final hedge shaping before winter growth slows down.', 32.5, 'job', true),
  ('Hedge Shaping', 'hedge', 'Spring', 'Early-season hedge shaping and clean growth lines.', 32.5, 'job', true),
  ('Weeding & Garden Tidy', 'hourly', 'Summer', 'Hourly hand work for beds, borders, paths, and small garden clean-ups.', 27.5, 'hour', true),
  ('Garden Maintenance', 'hourly', 'All year', 'Weeding, planting, tidy-up, and minor outdoor help.', 27.5, 'hour', true),
  ('Garden Winter Prep', 'hourly', 'Autumn', 'General hourly maintenance for beds, leaves, pots, and outdoor areas before winter.', 27.5, 'hour', true),
  ('Planting / Refresh', 'hourly', 'Spring', 'Hourly planting help and seasonal garden refreshes.', 27.5, 'hour', true),
  ('Watering Support', 'general', 'Summer', 'Short watering visits while clients are away in warmer periods.', 17.5, 'visit', true),
  ('Green Waste Removal', 'general', 'All year', 'Add-on collection for clippings, leaves, and trimmings.', 15, 'job', true),
  ('Leaf Clearing', 'leaves', 'Autumn', 'Raking, blowing, collection, bagging, or compost pile support.', 25, 'visit', true),
  ('Pressure Washing', 'pressure', 'Spring', 'Terraces, driveways, stone paths, patios, and lower facade cleaning.', 42.5, 'job', true),
  ('Terrace / Path Clean-Up', 'pressure', 'Autumn', 'Outdoor surface clean-up before winter grime and moss build up.', 42.5, 'job', true),
  ('Snow Clearing', 'winter', 'Winter', 'Paths, driveways, steps, entrances, and access routes.', 25, 'visit', true),
  ('Salting', 'winter', 'Winter', 'Standalone or add-on salting with practical de-icing coverage.', 19, 'visit', true),
  ('Emergency Winter Visit', 'winter', 'Winter', 'Same-day and early morning winter visits when conditions change quickly.', 35, 'visit', true),
  ('Residence / Small Business Winter Safety', 'winter', 'Winter', 'Priority winter planning for shared entrances, residences, landlords, and small offices.', 69.5, 'month', true)
) as defaults(name, category, season, description, base_price, pricing_unit, active)
where not exists (
  select 1
  from public.services existing
  where existing.name = defaults.name
);

insert into public.equipment (name, type, brand, model, serial_number, purchase_price, purchase_date, status, notes)
select *
from (values
  ('Honda lawn mower', 'lawn_mower', 'Honda', 'HRX', 'LLC-MOW-001', 950, '2026-02-20', 'available', 'Primary mowing unit'),
  ('Stihl hedge trimmer', 'hedge_trimmer', 'Stihl', 'HS 45', 'LLC-HDG-001', 320, '2026-02-21', 'available', 'Hedge care kit'),
  ('Karcher pressure washer', 'pressure_washer', 'Karcher', 'K7', 'LLC-PRS-001', 480, '2026-03-01', 'maintenance', 'Needs hose check')
) as defaults(name, type, brand, model, serial_number, purchase_price, purchase_date, status, notes)
where not exists (
  select 1
  from public.equipment existing
  where existing.serial_number = defaults.serial_number
);

-- Real customer/employee seed rows need auth.users ids first.
-- Use the dashboard after creating users, or copy auth user ids into an additional local seed script.
