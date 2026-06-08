create extension if not exists pgcrypto;

create table if not exists public.menfess (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  "from" text,
  "to" text,
  created_at timestamptz not null default now()
);

alter table public.menfess enable row level security;

revoke all on table public.menfess from anon;
revoke all on table public.menfess from authenticated;

drop policy if exists "Public can read menfess" on public.menfess;
drop policy if exists "Public can create menfess" on public.menfess;

grant select (id, message, "from", "to", created_at) on table public.menfess to anon;
grant insert (message, "from", "to") on table public.menfess to anon;
grant select (id, message, "from", "to", created_at) on table public.menfess to authenticated;
grant insert (message, "from", "to") on table public.menfess to authenticated;
grant select, insert, update, delete on table public.menfess to service_role;

create policy "Public can read menfess"
on public.menfess
for select
to anon, authenticated
using (true);

create policy "Public can create menfess"
on public.menfess
for insert
to anon, authenticated
with check (
  length(btrim(message)) between 1 and 2000
  and ("from" is null or length("from") <= 100)
  and ("to" is null or length("to") <= 100)
);

-- Public access is intentionally limited to read and create. Updates and
-- deletes remain unavailable to anon/authenticated roles.

notify pgrst, 'reload schema';
