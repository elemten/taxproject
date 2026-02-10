create or replace function convert_lead_to_client(
  p_lead_id uuid,
  p_address text default null,
  p_actor text default 'admin'
)
returns uuid
as $convert_lead_to_client$
declare
  v_lead leads%rowtype;
  v_client_id uuid;
begin
  select *
  into v_lead
  from leads
  where id = p_lead_id
  for update;

  if not found then
    raise exception 'lead_not_found' using errcode = 'P0002';
  end if;

  insert into clients (lead_id, name, email, phone, address, client_status)
  values (v_lead.id, v_lead.name, v_lead.email, v_lead.phone, nullif(trim(p_address), ''), 'active')
  on conflict (lead_id)
  do update set
    name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    address = coalesce(excluded.address, clients.address),
    updated_at = now()
  returning id into v_client_id;

  update leads
  set status = 'converted',
      updated_at = now()
  where id = v_lead.id;

  insert into lead_events (lead_id, event_type, note, actor)
  values (v_lead.id, 'lead_converted', format('Lead converted to client %s', v_client_id), coalesce(nullif(trim(p_actor), ''), 'admin'));

  return v_client_id;
end;
$convert_lead_to_client$
language plpgsql
security definer
set search_path = public;
