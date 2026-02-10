create or replace function check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
as $check_rate_limit$
declare
  v_now timestamptz := now();
  v_window_start timestamptz := now() - make_interval(secs => p_window_seconds);
  v_current api_rate_limits%rowtype;
begin
  if p_key is null or length(trim(p_key)) = 0 then
    return false;
  end if;

  select *
  into v_current
  from api_rate_limits
  where key = p_key
  for update;

  if not found then
    insert into api_rate_limits (key, window_start, request_count, updated_at)
    values (p_key, v_now, 1, v_now);
    return true;
  end if;

  if v_current.window_start < v_window_start then
    update api_rate_limits
    set window_start = v_now,
        request_count = 1,
        updated_at = v_now
    where key = p_key;
    return true;
  end if;

  if v_current.request_count >= p_limit then
    update api_rate_limits
    set updated_at = v_now
    where key = p_key;
    return false;
  end if;

  update api_rate_limits
  set request_count = request_count + 1,
      updated_at = v_now
  where key = p_key;

  return true;
end;
$check_rate_limit$
language plpgsql
security definer
set search_path = public;
