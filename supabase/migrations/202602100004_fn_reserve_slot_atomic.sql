create or replace function reserve_slot_atomic(
  p_slot_id uuid,
  p_full_name text,
  p_email text,
  p_phone text,
  p_service_interest text default null,
  p_message text default null
)
returns table (
  booking_id uuid,
  lead_id uuid,
  slot_start timestamptz,
  slot_timezone text
)
as $reserve_slot_atomic$
declare
  v_slot booking_slots%rowtype;
  v_lead_id uuid;
  v_booking_id uuid;
begin
  select *
  into v_slot
  from booking_slots
  where id = p_slot_id
    and is_active = true
    and starts_at > now()
  for update;

  if not found then
    raise exception 'slot_not_available' using errcode = 'P0001';
  end if;

  if exists (
    select 1
    from bookings
    where slot_id = p_slot_id
      and status = 'booked'
  ) then
    raise exception 'slot_already_booked' using errcode = '23505';
  end if;

  v_lead_id := create_or_update_lead(
    p_name => p_full_name,
    p_email => p_email,
    p_phone => p_phone,
    p_source => 'booking_form',
    p_service_interest => p_service_interest,
    p_message => p_message,
    p_initial_event => 'booking_requested',
    p_actor => 'public_form'
  );

  insert into bookings (slot_id, lead_id, status)
  values (p_slot_id, v_lead_id, 'booked')
  returning id into v_booking_id;

  insert into lead_events (lead_id, event_type, note, actor)
  values (
    v_lead_id,
    'booking_confirmed',
    format('Booking created for slot %s', v_slot.starts_at),
    'system'
  );

  return query
  select v_booking_id, v_lead_id, v_slot.starts_at, v_slot.timezone;
end;
$reserve_slot_atomic$
language plpgsql
security definer
set search_path = public;
