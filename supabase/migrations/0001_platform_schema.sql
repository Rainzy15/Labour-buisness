create extension if not exists pgcrypto;

create type public.user_role as enum ('customer', 'admin', 'employee', 'manager');
create type public.booking_status as enum ('requested', 'quote_sent', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rejected');
create type public.contract_status as enum ('draft', 'active', 'paused', 'cancelled', 'completed');
create type public.invoice_status as enum ('draft', 'sent', 'paid', 'overdue', 'cancelled');
create type public.equipment_status as enum ('available', 'in_use', 'maintenance', 'retired');

create table public.users_profile (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  first_name text,
  last_name text,
  email text not null,
  phone text,
  avatar_url text,
  preferred_language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users_profile(id) on delete cascade,
  customer_type text not null default 'private_homeowner',
  notes text,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  label text not null default 'Home',
  street text not null,
  postcode text,
  city text,
  commune text,
  country text not null default 'Luxembourg',
  access_notes text,
  garden_size_sqm integer,
  has_narrow_access boolean not null default false,
  has_stairs boolean not null default false,
  has_water_access boolean not null default true,
  parking_notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users_profile(id) on delete set null,
  first_name text not null,
  last_name text not null,
  phone text,
  email text,
  employment_status text not null default 'active',
  hourly_rate numeric(10,2),
  skills text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  season text,
  description text,
  base_price numeric(10,2),
  pricing_unit text,
  active boolean not null default true
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  address_id uuid references public.addresses(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  status public.booking_status not null default 'requested',
  requested_date date,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  estimated_price numeric(10,2),
  final_price numeric(10,2),
  frequency text,
  customer_notes text,
  internal_notes text,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  service_name text not null,
  quantity numeric(10,2) not null default 1,
  unit text not null default 'item',
  unit_price numeric(10,2) not null default 0,
  subtotal numeric(10,2) not null default 0,
  pricing_details_json jsonb not null default '{}'::jsonb
);

create table public.job_assignments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  assigned_by uuid references public.users_profile(id) on delete set null,
  status text not null default 'assigned',
  employee_notes text,
  before_photos text[] not null default '{}',
  after_photos text[] not null default '{}',
  completed_at timestamptz
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  address_id uuid references public.addresses(id) on delete set null,
  contract_type text not null,
  title text not null,
  status public.contract_status not null default 'draft',
  start_date date,
  end_date date,
  monthly_price numeric(10,2),
  total_contract_value numeric(10,2),
  included_services_json jsonb not null default '[]'::jsonb,
  terms text,
  signed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  contract_id uuid references public.contracts(id) on delete set null,
  invoice_number text not null unique,
  status public.invoice_status not null default 'draft',
  subtotal numeric(10,2) not null default 0,
  tax_amount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  due_date date,
  paid_at timestamptz,
  pdf_url text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  provider text not null default 'manual',
  amount numeric(10,2) not null,
  status text not null default 'pending',
  provider_payment_id text,
  paid_at timestamptz
);

create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  brand text,
  model text,
  serial_number text,
  purchase_price numeric(10,2),
  purchase_date date,
  status public.equipment_status not null default 'available',
  notes text
);

create table public.robot_rentals (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  address_id uuid references public.addresses(id) on delete set null,
  equipment_id uuid references public.equipment(id) on delete set null,
  contract_id uuid references public.contracts(id) on delete set null,
  lawn_size_sqm integer,
  rental_start date,
  rental_end date,
  monthly_price numeric(10,2),
  setup_type text,
  maintenance_plan text,
  deposit_amount numeric(10,2) not null default 200,
  deposit_status text not null default 'pending',
  status text not null default 'requested',
  notes text
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  sender_type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users_profile(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users_profile(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_users_profile_auth_user_id on public.users_profile(auth_user_id);
create index idx_customers_user_id on public.customers(user_id);
create index idx_addresses_customer_id on public.addresses(customer_id);
create index idx_bookings_customer_id on public.bookings(customer_id);
create index idx_bookings_status on public.bookings(status);
create index idx_job_assignments_employee_id on public.job_assignments(employee_id);
create index idx_contracts_customer_id on public.contracts(customer_id);
create index idx_invoices_customer_id on public.invoices(customer_id);
create index idx_robot_rentals_customer_id on public.robot_rentals(customer_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_users_profile_updated_at before update on public.users_profile
for each row execute function public.touch_updated_at();

create trigger touch_bookings_updated_at before update on public.bookings
for each row execute function public.touch_updated_at();

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.users_profile where auth_user_id = auth.uid()
$$;

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users_profile where auth_user_id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role() in ('admin', 'manager')
$$;

create or replace function public.owns_customer(target_customer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.customers c
    where c.id = target_customer_id
      and c.user_id = public.current_profile_id()
  )
$$;

create or replace function public.employee_can_access_assignment(target_employee_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.employees e
    where e.id = target_employee_id
      and e.user_id = public.current_profile_id()
  )
$$;

alter table public.users_profile enable row level security;
alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.employees enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_items enable row level security;
alter table public.job_assignments enable row level security;
alter table public.contracts enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.equipment enable row level security;
alter table public.robot_rentals enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles own or admin read" on public.users_profile for select using (auth_user_id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.users_profile for update using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
create policy "profiles admin all" on public.users_profile for all using (public.is_admin()) with check (public.is_admin());

create policy "customers own or admin read" on public.customers for select using (public.owns_customer(id) or public.is_admin());
create policy "customers own insert" on public.customers for insert with check (user_id = public.current_profile_id() or public.is_admin());
create policy "customers admin all" on public.customers for all using (public.is_admin()) with check (public.is_admin());

create policy "addresses owner or admin read" on public.addresses for select using (public.owns_customer(customer_id) or public.is_admin());
create policy "addresses owner insert" on public.addresses for insert with check (public.owns_customer(customer_id) or public.is_admin());
create policy "addresses owner update" on public.addresses for update using (public.owns_customer(customer_id) or public.is_admin()) with check (public.owns_customer(customer_id) or public.is_admin());
create policy "addresses owner delete" on public.addresses for delete using (public.owns_customer(customer_id) or public.is_admin());

create policy "employees self or admin read" on public.employees for select using (user_id = public.current_profile_id() or public.is_admin());
create policy "employees admin all" on public.employees for all using (public.is_admin()) with check (public.is_admin());

create policy "services public read active" on public.services for select using (active = true or public.is_admin());
create policy "services admin all" on public.services for all using (public.is_admin()) with check (public.is_admin());

create policy "bookings owner employee admin read" on public.bookings for select using (
  public.owns_customer(customer_id)
  or public.is_admin()
  or exists (
    select 1 from public.job_assignments ja
    join public.employees e on e.id = ja.employee_id
    where ja.booking_id = bookings.id and e.user_id = public.current_profile_id()
  )
);
create policy "bookings owner insert" on public.bookings for insert with check (public.owns_customer(customer_id) or public.is_admin());
create policy "bookings owner cancel or admin update" on public.bookings for update using (public.owns_customer(customer_id) or public.is_admin()) with check (public.owns_customer(customer_id) or public.is_admin());
create policy "bookings admin delete" on public.bookings for delete using (public.is_admin());

create policy "booking items via booking access" on public.booking_items for select using (
  exists (select 1 from public.bookings b where b.id = booking_id and (public.owns_customer(b.customer_id) or public.is_admin()))
);
create policy "booking items admin all" on public.booking_items for all using (public.is_admin()) with check (public.is_admin());

create policy "job assignments employee or admin read" on public.job_assignments for select using (public.employee_can_access_assignment(employee_id) or public.is_admin());
create policy "job assignments employee update own status" on public.job_assignments for update using (public.employee_can_access_assignment(employee_id) or public.is_admin()) with check (public.employee_can_access_assignment(employee_id) or public.is_admin());
create policy "job assignments admin all" on public.job_assignments for all using (public.is_admin()) with check (public.is_admin());

create policy "contracts owner or admin read" on public.contracts for select using (public.owns_customer(customer_id) or public.is_admin());
create policy "contracts admin all" on public.contracts for all using (public.is_admin()) with check (public.is_admin());

create policy "invoices owner or admin read" on public.invoices for select using (public.owns_customer(customer_id) or public.is_admin());
create policy "invoices admin all" on public.invoices for all using (public.is_admin()) with check (public.is_admin());

create policy "payments via invoice owner or admin read" on public.payments for select using (
  public.is_admin() or exists (select 1 from public.invoices i where i.id = invoice_id and public.owns_customer(i.customer_id))
);
create policy "payments admin all" on public.payments for all using (public.is_admin()) with check (public.is_admin());

create policy "equipment employee admin read" on public.equipment for select using (public.current_role() in ('employee', 'admin', 'manager'));
create policy "equipment admin all" on public.equipment for all using (public.is_admin()) with check (public.is_admin());

create policy "robot rentals owner or admin read" on public.robot_rentals for select using (public.owns_customer(customer_id) or public.is_admin());
create policy "robot rentals admin all" on public.robot_rentals for all using (public.is_admin()) with check (public.is_admin());

create policy "messages owner or admin read" on public.messages for select using (public.owns_customer(customer_id) or public.is_admin());
create policy "messages owner insert" on public.messages for insert with check (public.owns_customer(customer_id) or public.is_admin());
create policy "messages admin all" on public.messages for all using (public.is_admin()) with check (public.is_admin());

create policy "notifications own read" on public.notifications for select using (user_id = public.current_profile_id() or public.is_admin());
create policy "notifications own update" on public.notifications for update using (user_id = public.current_profile_id() or public.is_admin()) with check (user_id = public.current_profile_id() or public.is_admin());
create policy "notifications admin insert" on public.notifications for insert with check (public.is_admin());

create policy "audit logs admin read" on public.audit_logs for select using (public.is_admin());
create policy "audit logs admin insert" on public.audit_logs for insert with check (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users_profile (auth_user_id, email, first_name, last_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'first_name', split_part(coalesce(new.raw_user_meta_data->>'full_name', ''), ' ', 1)),
    coalesce(new.raw_user_meta_data->>'last_name', nullif(regexp_replace(coalesce(new.raw_user_meta_data->>'full_name', ''), '^[^ ]+ ?', ''), '')),
    'customer'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
