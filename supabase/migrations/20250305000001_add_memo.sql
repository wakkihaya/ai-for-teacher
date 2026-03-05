-- Add memo column to lessons table
alter table public.lessons add column if not exists memo text;
