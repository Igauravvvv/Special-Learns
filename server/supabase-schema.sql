-- ==============================================================================
-- Special Learns Institute — Supabase Enrolment Storage Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- Create the enrolments table
create table if not exists public.enrolments (
  id text primary key,
  name text not null,
  email text,
  phone text,
  course text,
  interest text,
  message text,
  source text default 'website',
  status text default 'new',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  raw_data jsonb
);

-- Also create an alias/view or table for 'enquiries' if desired
create or replace view public.enquiries as
  select * from public.enrolments;

-- Performance indexes
create index if not exists idx_enrolments_created_at on public.enrolments(created_at desc);
create index if not exists idx_enrolments_status on public.enrolments(status);
create index if not exists idx_enrolments_course on public.enrolments(course);

-- Enable Row Level Security (RLS)
alter table public.enrolments enable row level security;

-- Policy: Allow inserts from authenticated users or service role
create policy "Allow service role full access"
  on public.enrolments
  for all
  using (true)
  with check (true);

-- Policy: Allow insert from anon/public website forms
create policy "Allow public inserts for course enrolment"
  on public.enrolments
  for insert
  with check (true);
