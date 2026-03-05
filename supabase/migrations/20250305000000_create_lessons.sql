-- Create the lessons table (run this in Supabase Dashboard → SQL Editor)
-- Fixes: PGRST205 "Could not find the table 'public.lessons' in the schema cache"

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null default '',
  topic text not null default '',
  grade_level text not null default '',
  language text not null default 'French',
  duration integer not null default 0,
  goals text not null default '',
  lesson_plan jsonb,
  vocabulary jsonb default '[]'::jsonb,
  lesson_note text,
  is_shared boolean not null default false,
  share_slug text unique default encode(gen_random_bytes(8), 'hex'),
  step_completed integer not null default 0 check (step_completed between 0 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-set updated_at on update
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists lessons_updated_at on public.lessons;
create trigger lessons_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

-- RLS: users manage own rows; anyone can read shared lessons
alter table public.lessons enable row level security;

create policy "Users can do everything on own lessons"
  on public.lessons for all
  using (auth.uid() = user_id or user_id is null)
  with check (auth.uid() = user_id or user_id is null);

create policy "Anyone can read shared lessons"
  on public.lessons for select
  using (is_shared = true);

comment on table public.lessons is 'Lesson plans and notes for AI for Teacher app';
