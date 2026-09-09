create extension if not exists pgcrypto;

create table if not exists public.cnpj_whitelist (
  id uuid primary key default gen_random_uuid(),
  cnpj text not null unique,
  razao_social text not null,
  nome_fantasia text,
  uf text,
  municipio text,
  capital_social numeric not null default 0,
  porte text,
  trust_score integer not null default 75 check (trust_score between 0 and 99),
  found_at timestamptz not null default now(),
  times_verified integer not null default 1,
  last_verified timestamptz not null default now()
);

create table if not exists public.cnpj_blacklist (
  id uuid primary key default gen_random_uuid(),
  cnpj text not null unique,
  reason text not null,
  added_at timestamptz not null default now()
);

create table if not exists public.cnpj_used (
  id uuid primary key default gen_random_uuid(),
  cnpj text not null unique,
  used_at timestamptz not null default now()
);

create index if not exists cnpj_whitelist_found_at_idx on public.cnpj_whitelist (found_at desc);
create index if not exists cnpj_whitelist_uf_idx on public.cnpj_whitelist (uf);
create index if not exists cnpj_whitelist_trust_score_idx on public.cnpj_whitelist (trust_score desc);
create index if not exists cnpj_blacklist_added_at_idx on public.cnpj_blacklist (added_at desc);
create index if not exists cnpj_used_used_at_idx on public.cnpj_used (used_at desc);

alter table public.cnpj_whitelist enable row level security;
alter table public.cnpj_blacklist enable row level security;
alter table public.cnpj_used enable row level security;

create policy "authenticated can read cnpj whitelist" on public.cnpj_whitelist
  for select to authenticated using (true);
create policy "authenticated can write cnpj whitelist" on public.cnpj_whitelist
  for all to authenticated using (true) with check (true);

create policy "authenticated can read cnpj blacklist" on public.cnpj_blacklist
  for select to authenticated using (true);
create policy "authenticated can write cnpj blacklist" on public.cnpj_blacklist
  for all to authenticated using (true) with check (true);

create policy "authenticated can read cnpj used" on public.cnpj_used
  for select to authenticated using (true);
create policy "authenticated can write cnpj used" on public.cnpj_used
  for all to authenticated using (true) with check (true);
