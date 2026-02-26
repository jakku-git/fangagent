-- ============================================================
-- FANG PORTAL — Full Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles ─────────────────────────────────────────────────
-- Extends Supabase auth.users
create table if not exists public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  role                  text not null default 'agent' check (role in ('agent','staff')),
  account_type          text not null default 'agent' check (account_type in ('agent','agency')),
  full_name             text,
  agency_name           text,
  phone                 text,
  licence_number        text,
  address               text,
  suburb                text,
  state                 text,
  postcode              text,
  website               text,
  bio                   text,
  profile_photo_url     text,
  agency_logo_url       text,
  billing_type          text not null default 'upfront' check (billing_type in ('upfront','credit')),
  credit_status         text not null default 'none' check (credit_status in ('none','pending','approved')),
  account_status        text not null default 'active' check (account_status in ('active','pending','suspended')),
  crm_system            text,
  crm_integration_status text not null default 'none' check (crm_integration_status in ('none','pending','connected')),
  agent_count           int,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Security-definer function to get current user's role without RLS recursion
create or replace function public.get_my_role()
returns text language sql stable security definer as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Agents can read/update their own profile; staff can access all
create policy "agent_own_profile" on public.profiles
  for all using (auth.uid() = id or public.get_my_role() = 'staff');

-- ── Reference sequences ───────────────────────────────────────
create sequence if not exists public.listing_ref_seq start 1;
create sequence if not exists public.invoice_ref_seq start 1;

-- Auto-generate FAG-YYYYMM-NNNNN on listing insert
create or replace function public.generate_listing_ref()
returns trigger language plpgsql as $$
begin
  new.listing_ref := 'FAG-' || to_char(now(), 'YYYYMM') || '-' || lpad(nextval('public.listing_ref_seq')::text, 5, '0');
  return new;
end; $$;

-- Auto-generate INV-YYYYMM-NNNNN on invoice insert
create or replace function public.generate_invoice_ref()
returns trigger language plpgsql as $$
begin
  new.invoice_ref := 'INV-' || to_char(now(), 'YYYYMM') || '-' || lpad(nextval('public.invoice_ref_seq')::text, 5, '0');
  return new;
end; $$;

-- ── Listings ──────────────────────────────────────────────────
create table if not exists public.listings (
  id                uuid primary key default uuid_generate_v4(),
  listing_ref       text unique,
  agent_id          uuid not null references public.profiles(id) on delete cascade,
  package           text not null check (package in ('Essential','Premium','Premium+')),
  status            text not null default 'pending_payment' check (status in (
                      'draft','pending_payment','pending_review','in_progress','live','completed','cancelled')),
  address           text not null,
  suburb            text not null,
  state             text not null,
  postcode          text not null,
  price             text not null,
  bedrooms          int not null default 0,
  bathrooms         int not null default 0,
  parking           int not null default 0,
  property_type     text default 'House' check (property_type in (
                      'House','Apartment','Townhouse','Villa','Land','Rural','Commercial','Other')),
  land_size         text,
  features          text[],
  description       text,
  open_home_times   text,
  auction_date      text,
  vendor_instructions text,
  agent_notes       text,
  listing_url       text,
  -- Staff-entered campaign links
  fang_url          text,
  red_note_url      text,
  wechat_url        text,
  -- Performance (pulled from links or entered by staff)
  views             int not null default 0,
  enquiries         int not null default 0,
  saves             int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.listings enable row level security;

create policy "listings_access" on public.listings
  for all using (agent_id = auth.uid() or public.get_my_role() = 'staff');

-- ── Listing Photos ────────────────────────────────────────────
create table if not exists public.listing_photos (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  url         text not null,
  created_at  timestamptz not null default now()
);

alter table public.listing_photos enable row level security;

create policy "photos_access" on public.listing_photos
  for all using (
    exists (select 1 from public.listings l where l.id = listing_id and l.agent_id = auth.uid())
    or public.get_my_role() = 'staff'
  );

-- ── Invoices ──────────────────────────────────────────────────
create table if not exists public.invoices (
  id            uuid primary key default uuid_generate_v4(),
  invoice_ref   text unique,
  listing_id    uuid not null references public.listings(id) on delete cascade,
  agent_id      uuid not null references public.profiles(id) on delete cascade,
  package       text not null,
  address       text not null,
  amount        int not null,
  status        text not null default 'unpaid' check (status in ('unpaid','remittance_uploaded','paid','overdue')),
  due_date      date not null,
  paid_at       timestamptz,
  created_at    timestamptz not null default now()
);

alter table public.invoices enable row level security;

create policy "invoices_access" on public.invoices
  for all using (agent_id = auth.uid() or public.get_my_role() = 'staff');

-- ── Remittance Advice ─────────────────────────────────────────
create table if not exists public.remittances (
  id            uuid primary key default uuid_generate_v4(),
  invoice_id    uuid not null references public.invoices(id) on delete cascade,
  agent_id      uuid not null references public.profiles(id) on delete cascade,
  file_url      text not null,
  file_name     text not null,
  notes         text,
  created_at    timestamptz not null default now()
);

alter table public.remittances enable row level security;

create policy "remittances_access" on public.remittances
  for all using (agent_id = auth.uid() or public.get_my_role() = 'staff');

-- ── CRM Integration Requests ──────────────────────────────────
create table if not exists public.crm_requests (
  id          uuid primary key default uuid_generate_v4(),
  agent_id    uuid not null references public.profiles(id) on delete cascade,
  crm_system  text not null,
  notes       text,
  status      text not null default 'pending' check (status in ('pending','in_progress','connected','rejected')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.crm_requests enable row level security;

create policy "crm_requests_access" on public.crm_requests
  for all using (agent_id = auth.uid() or public.get_my_role() = 'staff');

-- ── Credit Applications ───────────────────────────────────────
create table if not exists public.credit_applications (
  id              uuid primary key default uuid_generate_v4(),
  agent_id        uuid not null references public.profiles(id) on delete cascade,
  status          text not null default 'pending' check (status in ('pending','approved','rejected')),
  monthly_limit   int,
  notes           text,
  file_url        text,
  file_name       text,
  submitted_at    timestamptz not null default now(),
  reviewed_at     timestamptz
);

alter table public.credit_applications enable row level security;

create policy "credit_applications_access" on public.credit_applications
  for all using (agent_id = auth.uid() or public.get_my_role() = 'staff');

-- ── Listing Requests (edit / withdrawal) ─────────────────────
create table if not exists public.listing_requests (
  id            uuid primary key default uuid_generate_v4(),
  listing_id    uuid not null references public.listings(id) on delete cascade,
  agent_id      uuid not null references public.profiles(id) on delete cascade,
  type          text not null check (type in ('edit','withdrawal')),
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  message       text not null,
  staff_notes   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.listing_requests enable row level security;

create policy "listing_requests_access" on public.listing_requests
  for all using (agent_id = auth.uid() or public.get_my_role() = 'staff');

create trigger listing_requests_updated_at before update on public.listing_requests
  for each row execute function public.handle_updated_at();

-- ── Storage Buckets ───────────────────────────────────────────
-- Run these separately in Supabase Storage or via dashboard:
-- 1. Create bucket: "profile-assets"   (public: true)
-- 2. Create bucket: "listing-photos"   (public: true)
-- 3. Create bucket: "remittance"       (public: false)

-- ── Updated_at trigger ────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger listings_updated_at before update on public.listings
  for each row execute function public.handle_updated_at();

create trigger set_listing_ref before insert on public.listings
  for each row execute function public.generate_listing_ref();

create trigger set_invoice_ref before insert on public.invoices
  for each row execute function public.generate_invoice_ref();

create trigger crm_requests_updated_at before update on public.crm_requests
  for each row execute function public.handle_updated_at();

-- ── Auto-create profile on signup ─────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'agent'),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
