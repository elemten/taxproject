create or replace function create_or_update_lead(
  p_name text,
  p_email text,
  p_phone text,
  p_source lead_source,
  p_service_interest text default null,
  p_message text default null,
  p_initial_event text default null,
  p_actor text default 'system'
)
returns uuid
as $create_or_update_lead$
declare
  v_lead_id uuid;
begin
  insert into leads (name, email, phone, source, service_interest, message)
  values (trim(p_name), lower(trim(p_email)), trim(p_phone), p_source, nullif(trim(p_service_interest), ''), nullif(trim(p_message), ''))
  on conflict ((lower(email)))
  do update set
    name = excluded.name,
    phone = excluded.phone,
    source = excluded.source,
    service_interest = coalesce(excluded.service_interest, leads.service_interest),
    message = coalesce(excluded.message, leads.message),
    updated_at = now()
  returning id into v_lead_id;

  if p_initial_event is not null and length(trim(p_initial_event)) > 0 then
    insert into lead_events (lead_id, event_type, note, actor)
    values (v_lead_id, p_initial_event, nullif(trim(p_message), ''), coalesce(nullif(trim(p_actor), ''), 'system'));
  end if;

  return v_lead_id;
end;
$create_or_update_lead$
language plpgsql
security definer
set search_path = public;
