create type integration_job_type as enum (
  'create_zoom_meeting',
  'send_client_confirmation',
  'process_whatsapp_media',
  'ensure_folder'
);

create type integration_job_status as enum ('pending', 'running', 'succeeded', 'failed');
create type external_folder_entity_type as enum ('client', 'prospect_phone');

create table if not exists integration_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type integration_job_type not null,
  payload_json jsonb not null default '{}'::jsonb,
  idempotency_key text,
  status integration_job_status not null default 'pending',
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  locked_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create unique index if not exists integration_jobs_idempotency_key_unique_idx
  on integration_jobs (idempotency_key)
  where idempotency_key is not null;

create index if not exists integration_jobs_pending_idx
  on integration_jobs (status, next_attempt_at, created_at)
  where status = 'pending';

create table if not exists external_folders (
  id uuid primary key default gen_random_uuid(),
  entity_type external_folder_entity_type not null,
  entity_id uuid references clients(id) on delete cascade,
  phone_key text,
  provider text not null default 'google_drive',
  provider_folder_id text not null,
  path_label text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint external_folders_entity_check check (
    (entity_type = 'client' and entity_id is not null and phone_key is null)
    or
    (entity_type = 'prospect_phone' and entity_id is null and phone_key is not null)
  )
);

create unique index if not exists external_folders_active_client_unique_idx
  on external_folders (entity_type, entity_id)
  where is_active = true and entity_id is not null;

create unique index if not exists external_folders_active_phone_unique_idx
  on external_folders (entity_type, phone_key)
  where is_active = true and phone_key is not null;

create unique index if not exists external_folders_provider_folder_unique_idx
  on external_folders (provider, provider_folder_id);

create table if not exists booking_meetings (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings(id) on delete cascade,
  provider text not null default 'zoom',
  meeting_id text not null,
  join_url text not null,
  start_url text,
  status text not null default 'scheduled',
  scheduled_start timestamptz,
  timezone text,
  raw_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists booking_meetings_provider_idx on booking_meetings (provider);

create table if not exists ingested_documents (
  id uuid primary key default gen_random_uuid(),
  message_id text not null,
  media_id text not null,
  sender_phone text not null,
  sender_phone_key text not null,
  media_type text not null,
  mime_type text,
  file_name text,
  size_bytes bigint,
  provider text not null default 'whatsapp',
  external_folder_id uuid references external_folders(id) on delete set null,
  provider_file_id text,
  status text not null default 'stored',
  raw_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists ingested_documents_message_id_unique_idx on ingested_documents (message_id);
create unique index if not exists ingested_documents_media_id_unique_idx on ingested_documents (media_id);
create index if not exists ingested_documents_sender_phone_key_idx on ingested_documents (sender_phone_key, created_at desc);

alter table integration_jobs enable row level security;
alter table external_folders enable row level security;
alter table booking_meetings enable row level security;
alter table ingested_documents enable row level security;

drop policy if exists "integration_jobs_service_role_only" on integration_jobs;
create policy "integration_jobs_service_role_only" on integration_jobs
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "external_folders_service_role_only" on external_folders;
create policy "external_folders_service_role_only" on external_folders
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "booking_meetings_service_role_only" on booking_meetings;
create policy "booking_meetings_service_role_only" on booking_meetings
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "ingested_documents_service_role_only" on ingested_documents;
create policy "ingested_documents_service_role_only" on ingested_documents
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop trigger if exists set_updated_at_integration_jobs on integration_jobs;
create trigger set_updated_at_integration_jobs
before update on integration_jobs
for each row
execute function set_updated_at();

drop trigger if exists set_updated_at_external_folders on external_folders;
create trigger set_updated_at_external_folders
before update on external_folders
for each row
execute function set_updated_at();

drop trigger if exists set_updated_at_booking_meetings on booking_meetings;
create trigger set_updated_at_booking_meetings
before update on booking_meetings
for each row
execute function set_updated_at();
