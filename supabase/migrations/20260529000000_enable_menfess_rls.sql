alter table if exists public.menfess enable row level security;

revoke all on table public.menfess from anon;
revoke all on table public.menfess from authenticated;

grant select, insert, update, delete on table public.menfess to service_role;

-- Menfess access is intended to go through server actions that use the
-- service role key. No direct client policies are granted here.