-- Lean MVP cleanup: remove queue/cron/rate-limit DB objects.

drop function if exists check_rate_limit(text, integer, integer);

drop table if exists notification_queue;
drop table if exists api_rate_limits;

drop type if exists notification_status;
drop type if exists notification_topic;
drop type if exists notification_channel;
