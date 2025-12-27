-- Create system_logs table for audit trail
create table if not exists system_logs (
  id bigint generated always as identity primary key,
  event_type text not null,
  description text not null,
  meta jsonb,
  created_at timestamptz default now()
);

-- Index for faster querying by type
create index if not exists system_logs_event_type_idx on system_logs (event_type);
