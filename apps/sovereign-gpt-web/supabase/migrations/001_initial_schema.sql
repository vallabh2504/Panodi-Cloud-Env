-- =============================================================
-- Sovereign GPT Web — Initial Schema
-- Run this once in the Supabase SQL Editor
-- Project: kerblmnjjsbgtwidefqw
-- =============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Profiles ────────────────────────────────────────────────
-- Mirrors auth.users; auto-populated by trigger on sign-up
create table if not exists public.profiles (
  id          uuid        references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

comment on table public.profiles is
  'Public user profiles, auto-created on first sign-in via trigger';

-- ─── User Preferences ────────────────────────────────────────
create table if not exists public.user_preferences (
  user_id     uuid        references public.profiles(id) on delete cascade primary key,
  theme       text        check (theme in ('dark', 'light')) default 'dark' not null,
  updated_at  timestamptz default now() not null
);

-- ─── Chats ───────────────────────────────────────────────────
create table if not exists public.chats (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references public.profiles(id) on delete cascade not null,
  title       text        default 'New Chat' not null,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

create index if not exists chats_user_id_idx    on public.chats(user_id);
create index if not exists chats_updated_at_idx on public.chats(updated_at desc);

-- ─── Messages ────────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid        default gen_random_uuid() primary key,
  chat_id     uuid        references public.chats(id) on delete cascade not null,
  user_id     uuid        references public.profiles(id) on delete cascade not null,
  role        text        check (role in ('user', 'ai')) not null,
  content     text        not null,
  created_at  timestamptz default now() not null
);

create index if not exists messages_chat_id_idx   on public.messages(chat_id);
create index if not exists messages_created_at_idx on public.messages(created_at asc);

-- ─── Row Level Security ───────────────────────────────────────

alter table public.profiles         enable row level security;
alter table public.user_preferences enable row level security;
alter table public.chats            enable row level security;
alter table public.messages         enable row level security;

-- Profiles
create policy "profiles: own read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: own update"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles: own insert"
  on public.profiles for insert
  with check (auth.uid() = id);

-- User Preferences
create policy "prefs: own all"
  on public.user_preferences for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Chats
create policy "chats: own select"
  on public.chats for select
  using (auth.uid() = user_id);

create policy "chats: own insert"
  on public.chats for insert
  with check (auth.uid() = user_id);

create policy "chats: own update"
  on public.chats for update
  using (auth.uid() = user_id);

create policy "chats: own delete"
  on public.chats for delete
  using (auth.uid() = user_id);

-- Messages
create policy "messages: own select"
  on public.messages for select
  using (auth.uid() = user_id);

create policy "messages: own insert"
  on public.messages for insert
  with check (auth.uid() = user_id);

create policy "messages: own delete"
  on public.messages for delete
  using (auth.uid() = user_id);

-- ─── Functions & Triggers ─────────────────────────────────────

-- Auto-create profile + preferences whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keep updated_at current automatically
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at      on public.profiles;
drop trigger if exists chats_updated_at         on public.chats;
drop trigger if exists user_prefs_updated_at    on public.user_preferences;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger chats_updated_at
  before update on public.chats
  for each row execute procedure public.update_updated_at();

create trigger user_prefs_updated_at
  before update on public.user_preferences
  for each row execute procedure public.update_updated_at();
