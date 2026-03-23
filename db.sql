create extension if not exists "uuid-ossp";
create extension if not exists postgis;

create table packages (
    id uuid primary key default uuid_generate_v4(),
    code text unique not null,
    title text,
    description text,
    qr_slug text unique not null,
    is_active boolean default true,
    sponsor_name text,
    sponsor_logo text,
    sponsor_url text,
    created_at timestamptz default now()
);
create index idx_packages_slug on packages(qr_slug);

create table subscribers (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    created_at timestamptz default now()
);
create index idx_subscribers_email on subscribers(email);

-- Abonelik: yalnızca anon insert (okuma/güncelleme yok). API route anon key kullanır.
alter table subscribers enable row level security;

create policy "subscribers_anon_insert_only"
on subscribers
for insert
to anon
with check (true);

create policy "subscribers_authenticated_select"
on subscribers
for select
to authenticated
using (true);

create type package_scan_status as enum (
    'pending',
    'approved',
    'rejected',
    'hidden'
);

create table package_scans (
    id uuid primary key default uuid_generate_v4(),
    package_id uuid not null references packages(id) on delete cascade,
    latitude numeric not null,
    longitude numeric not null,
    province text,
    district text,
    message text,
    image_path text,
    status package_scan_status not null default 'pending',
    created_at timestamptz default now()
);
create index idx_package_scans_package on package_scans(package_id);
create index idx_package_scans_created_at on package_scans(created_at);

create table news (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    slug text unique not null,
    content text not null,
    cover_image text,
    is_active boolean default true,
    published_at timestamptz,
    created_at timestamptz default now()
);
create index idx_news_is_active on news(is_active);
create index idx_news_slug on news(slug);

create table blogs (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    slug text unique not null,
    content text not null,
    cover_image text,
    is_active boolean default true,
    published_at timestamptz,
    created_at timestamptz default now()
);
create index idx_blogs_is_active on blogs(is_active);
create index idx_blogs_slug on blogs(slug);

create table settings (
    key text primary key,
    value text not null
);
insert into settings (key, value) values ('qr_base_url', '');

create table subscribers (
    id uuid primary key default uuid_generate_v4(),
    email text not null unique,
    created_at timestamptz default now(),
);
create index idx_subscribers_email on subscribers(email);

create policy "Allow all uploads"
on storage.objects
for insert
to anon, authenticated
with check (true);

create policy "Allow public read"
on storage.objects
for select
to anon, authenticated
using (true);

create policy "Allow delete"
on storage.objects
for delete
to anon, authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true);


insert into packages (code, qr_slug, title)
values
('0001','0001','Demo Paket 1'),
('0002','0002','Demo Paket 2');

-- Mevcut veritabanında subscribers zaten varsa ve RLS yoksa (Supabase SQL Editor):
-- alter table subscribers enable row level security;
-- create policy "subscribers_anon_insert_only" on subscribers for insert to anon with check (true);
-- Admin panelinde listelemek için (yalnızca giriş yapmış kullanıcılar):
-- create policy "subscribers_authenticated_select" on subscribers for select to authenticated using (true);

-- Mevcut veritabanına sponsor + subscribers eklemek için (Supabase SQL Editor'da çalıştırın):
-- alter table packages add column if not exists sponsor_name text;
-- alter table packages add column if not exists sponsor_logo text;
-- alter table packages add column if not exists sponsor_url text;
-- create table if not exists subscribers (id uuid primary key default uuid_generate_v4(), email text unique not null, created_at timestamptz default now());
-- create index if not exists idx_subscribers_email on subscribers(email);

-- Örnek sponsorlu kitap (logo public/sponsors altındaki dosya adıyla):
-- update packages set sponsor_name = 'Özdilek', sponsor_logo = 'sponsors/ozdilek-logo.webp', sponsor_url = 'https://www.ozdilek.com.tr' where code = '0001';
-- update packages set sponsor_name = 'Opet', sponsor_logo = 'sponsors/Opet-Logo.png', sponsor_url = 'https://www.opet.com.tr' where code = '0002';







create type explore_category as enum (
    'gitmelisin',
    'kalmalisin',
    'gormelisin',
    'almalisin',
    'tatmalisin'
);


create type explore_status as enum (
    'draft',
    'published',
    'removed'
);


create table explore_contents (
    id uuid primary key default uuid_generate_v4(),

    title text not null,
    slug text not null unique,

    description text, -- kısa açıklama
    content text, -- markdown içerik

    category explore_category not null,

    cover_image text, -- supabase storage path

    status explore_status default 'draft',

    published_at timestamptz,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);


create index idx_explore_status on explore_contents(status);

create index idx_explore_category on explore_contents(category);

create index idx_explore_published_at 
on explore_contents(published_at desc);


create or replace function update_updated_at_column()
returns trigger as $$
begin
   new.updated_at = now();
   return new;
end;
$$ language 'plpgsql';

create trigger update_explore_updated_at
before update on explore_contents
for each row
execute procedure update_updated_at_column();

alter table explore_contents enable row level security;

create policy "explore_public_published_select"
on explore_contents
for select
to anon, authenticated
using (status = 'published');

create policy "explore_admin_full_access"
on explore_contents
for all
to authenticated
using (true)
with check (true);


