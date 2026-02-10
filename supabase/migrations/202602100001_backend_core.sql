create extension if not exists pgcrypto;

create type lead_source as enum ('contact_form', 'booking_form', 'manual');
create type lead_status as enum ('new', 'contacted', 'qualified', 'converted', 'closed');
create type booking_status as enum ('booked', 'cancelled', 'no_show');
create type client_status as enum ('active', 'inactive');
create type service_type as enum ('personal_tax', 'corporate_tax', 'estate', 'general');
create type notification_channel as enum ('email', 'whatsapp');
create type notification_topic as enum ('new_lead', 'new_booking');
create type notification_status as enum ('pending', 'sent', 'failed');

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  source lead_source not null default 'contact_form',
  service_interest text,
  message text,
  status lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists leads_email_lower_unique_idx on leads ((lower(email)));
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_created_at_idx on leads (created_at desc);

create table if not exists booking_slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'America/Regina',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint booking_slots_time_check check (ends_at > starts_at)
);

create index if not exists booking_slots_starts_at_idx on booking_slots (starts_at);
create index if not exists booking_slots_active_starts_idx on booking_slots (is_active, starts_at);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references booking_slots(id) on delete restrict,
  lead_id uuid not null references leads(id) on delete restrict,
  status booking_status not null default 'booked',
  booked_at timestamptz not null default now(),
  cancelled_at timestamptz,
  notes text
);

create unique index if not exists bookings_slot_active_unique_idx on bookings (slot_id) where status = 'booked';
create index if not exists bookings_lead_id_idx on bookings (lead_id);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid unique references leads(id) on delete set null,
  name text not null,
  email text,
  phone text,
  address text,
  client_status client_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_status_idx on clients (client_status);

create table if not exists client_records (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  service_type service_type not null default 'general',
  tax_year integer,
  status text not null default 'open',
  notes text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_records_client_id_idx on client_records (client_id);
create index if not exists client_records_service_type_idx on client_records (service_type);

create table if not exists lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  event_type text not null,
  note text,
  actor text not null default 'system',
  created_at timestamptz not null default now()
);

create index if not exists lead_events_lead_id_idx on lead_events (lead_id, created_at desc);

create table if not exists notification_queue (
  id uuid primary key default gen_random_uuid(),
  channel notification_channel not null,
  topic notification_topic not null,
  payload_json jsonb not null,
  status notification_status not null default 'pending',
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  last_error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists notification_queue_pending_idx
  on notification_queue (status, next_attempt_at, created_at)
  where status = 'pending';

create table if not exists api_rate_limits (
  key text primary key,
  window_start timestamptz not null,
  request_count integer not null,
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger
as $set_updated_at$
begin
  new.updated_at = now();
  return new;
end;
$set_updated_at$
language plpgsql;

drop trigger if exists set_updated_at_leads on leads;
create trigger set_updated_at_leads
before update on leads
for each row
execute function set_updated_at();

drop trigger if exists set_updated_at_clients on clients;
create trigger set_updated_at_clients
before update on clients
for each row
execute function set_updated_at();

drop trigger if exists set_updated_at_client_records on client_records;
create trigger set_updated_at_client_records
before update on client_records
for each row
execute function set_updated_at();
