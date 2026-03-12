create extension if not exists "uuid-ossp";
create extension if not exists postgis;

create table packages (
    id uuid primary key default uuid_generate_v4(),
    code text unique not null,
    title text,
    description text,
    qr_slug text unique not null,
    is_active boolean default true,
    created_at timestamptz default now()
);
create index idx_packages_slug on packages(qr_slug);

create table package_scans (
    id uuid primary key default uuid_generate_v4(),
    package_id uuid not null references packages(id) on delete cascade,
    latitude numeric not null,
    longitude numeric not null,
    province text,
    district text,
    message text,
    image_path text,
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