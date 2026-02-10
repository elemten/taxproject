alter table leads enable row level security;
alter table booking_slots enable row level security;
alter table bookings enable row level security;
alter table clients enable row level security;
alter table client_records enable row level security;
alter table lead_events enable row level security;
alter table notification_queue enable row level security;
alter table api_rate_limits enable row level security;

drop policy if exists "leads_service_role_only" on leads;
create policy "leads_service_role_only" on leads for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "booking_slots_service_role_only" on booking_slots;
create policy "booking_slots_service_role_only" on booking_slots for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "bookings_service_role_only" on bookings;
create policy "bookings_service_role_only" on bookings for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "clients_service_role_only" on clients;
create policy "clients_service_role_only" on clients for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "client_records_service_role_only" on client_records;
create policy "client_records_service_role_only" on client_records for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "lead_events_service_role_only" on lead_events;
create policy "lead_events_service_role_only" on lead_events for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "notification_queue_service_role_only" on notification_queue;
create policy "notification_queue_service_role_only" on notification_queue for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "api_rate_limits_service_role_only" on api_rate_limits;
create policy "api_rate_limits_service_role_only" on api_rate_limits for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
