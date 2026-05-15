-- Run this in the Supabase SQL editor (Dashboard > SQL Editor)
-- Project: kerblmnjjsbgtwidefqw.supabase.co

-- daily_logs
create table if not exists daily_logs (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  data jsonb not null default '{}',
  wellness_score integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- user_settings (singleton — always id=1)
create table if not exists user_settings (
  id integer primary key default 1 check (id = 1),
  user_name text default 'Bujji',
  water_goal integer default 8,
  fiber_goal integer default 25,
  reminder_time text default '09:00',
  theme text default 'cherry',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- streak_milestones (which celebrations have fired)
create table if not exists streak_milestones (
  id uuid primary key default gen_random_uuid(),
  milestone integer not null,
  celebrated_at date not null,
  created_at timestamptz default now()
);

-- medications
create table if not exists medications (
  id text primary key,
  name text not null,
  dosage text,
  frequency text,
  notes text,
  created_at timestamptz default now()
);

-- RLS: open policies (single-user personal app, no auth)
alter table daily_logs enable row level security;
alter table user_settings enable row level security;
alter table streak_milestones enable row level security;
alter table medications enable row level security;

-- Drop existing policies if re-running
drop policy if exists "allow all" on daily_logs;
drop policy if exists "allow all" on user_settings;
drop policy if exists "allow all" on streak_milestones;
drop policy if exists "allow all" on medications;

create policy "allow all" on daily_logs for all using (true);
create policy "allow all" on user_settings for all using (true);
create policy "allow all" on streak_milestones for all using (true);
create policy "allow all" on medications for all using (true);

-- updated_at trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on daily_logs;
create trigger set_updated_at
  before update on daily_logs
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on user_settings;
create trigger set_updated_at
  before update on user_settings
  for each row execute function set_updated_at();
