insert into public.services (name, category, season, description, base_price, pricing_unit, active) values
('Lawn Care', 'lawn', 'Summer', 'Regular mowing, edges, and optional collection.', 55, 'visit', true),
('Hedge Care', 'hedge', 'Summer', 'Hedge trimming and shaping.', 65, 'job', true),
('Leaf Clearing', 'leaves', 'Autumn', 'Raking, blowing, bagging, and take-away options.', 50, 'visit', true),
('Pressure Washing', 'pressure', 'Spring', 'Terraces, driveways, paths, and lower facade cleaning.', 85, 'job', true),
('Winter Safety', 'winter', 'Winter', 'Snow clearing, salting, and standby visits.', 139, 'month', true),
('Robot Mower Rental', 'robot', 'Summer', 'Seasonal robot mower rental with setup options.', 79, 'month', true),
('Garden Maintenance', 'hourly', 'All year', 'Weeding, planting, tidy-up, and minor outdoor help.', 55, 'hour', true);

insert into public.equipment (name, type, brand, model, serial_number, purchase_price, purchase_date, status, notes) values
('Honda lawn mower', 'lawn_mower', 'Honda', 'HRX', 'LLC-MOW-001', 950, '2026-02-20', 'available', 'Primary mowing unit'),
('Stihl hedge trimmer', 'hedge_trimmer', 'Stihl', 'HS 45', 'LLC-HDG-001', 320, '2026-02-21', 'available', 'Hedge care kit'),
('Karcher pressure washer', 'pressure_washer', 'Karcher', 'K7', 'LLC-PRS-001', 480, '2026-03-01', 'maintenance', 'Needs hose check'),
('Robot mower A', 'robot_mower', 'Husqvarna', 'Automower 310', 'LLC-RBT-001', 1000, '2026-03-10', 'in_use', 'Assigned to test rental');

-- Real customer/employee seed rows need auth.users ids first.
-- Use the dashboard after creating users, or copy auth user ids into an additional local seed script.
