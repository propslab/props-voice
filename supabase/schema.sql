-- ============================================================
-- Props Voice MVP Schema
-- Supabase SQL Editor で実行する
-- ============================================================

-- ============================================================
-- 1. テーブル定義
-- ============================================================

-- profiles: auth.users を拡張
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'standard')),
  created_at timestamptz not null default now()
);

-- stores: 1ユーザー1店舗（MVP制約）
create table public.stores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  google_review_url text not null,
  slug text not null unique check (char_length(slug) between 4 and 50),
  created_at timestamptz not null default now()
);

create index stores_user_id_idx on public.stores(user_id);
create index stores_slug_idx on public.stores(slug);

-- drafts: 客の生入力 + AI整文後のテキスト
create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  raw_input text not null check (char_length(raw_input) between 1 and 500),
  polished_text text check (char_length(polished_text) <= 1000),
  created_at timestamptz not null default now()
);

create index drafts_store_id_idx on public.drafts(store_id, created_at desc);

-- usage_monthly: フリープラン月3人制限のカウンタ
create table public.usage_monthly (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  year_month text not null check (year_month ~ '^\d{4}-\d{2}$'),
  count int not null default 0 check (count >= 0),
  unique (user_id, year_month)
);

create index usage_monthly_lookup_idx on public.usage_monthly(user_id, year_month);

-- lead_emails: スタンダードプラン「通知を受け取る」用リード
create table public.lead_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  interested_plan text not null default 'standard' check (interested_plan in ('standard')),
  created_at timestamptz not null default now()
);

create index lead_emails_email_idx on public.lead_emails(email);

-- ============================================================
-- 2. サインアップ時に profiles を自動作成するトリガー
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 3. Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.drafts enable row level security;
alter table public.usage_monthly enable row level security;
alter table public.lead_emails enable row level security;

-- --- profiles: 本人のみ参照・更新可 ---
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- --- stores: 本人がCRUD、anonはslug経由でSELECTのみ可（/r/[slug]） ---
create policy "stores_select_own" on public.stores
  for select to authenticated using (auth.uid() = user_id);
create policy "stores_insert_own" on public.stores
  for insert to authenticated with check (auth.uid() = user_id);
create policy "stores_update_own" on public.stores
  for update to authenticated using (auth.uid() = user_id);
create policy "stores_delete_own" on public.stores
  for delete to authenticated using (auth.uid() = user_id);

-- anon は店舗情報の SELECT のみ可（公開URL `/r/[slug]` 表示用）
create policy "stores_select_anon" on public.stores
  for select to anon using (true);

-- --- drafts: 本人がSELECT/DELETE、anonがINSERTのみ可 ---
create policy "drafts_select_own" on public.drafts
  for select to authenticated using (
    exists (
      select 1 from public.stores
      where stores.id = drafts.store_id and stores.user_id = auth.uid()
    )
  );

create policy "drafts_delete_own" on public.drafts
  for delete to authenticated using (
    exists (
      select 1 from public.stores
      where stores.id = drafts.store_id and stores.user_id = auth.uid()
    )
  );

-- 客（anon）が口コミ投稿
create policy "drafts_insert_anon" on public.drafts
  for insert to anon with check (true);
create policy "drafts_insert_authenticated" on public.drafts
  for insert to authenticated with check (true);

-- --- usage_monthly: 本人のみSELECT、INSERT/UPDATEはService Role経由のみ ---
create policy "usage_monthly_select_own" on public.usage_monthly
  for select to authenticated using (auth.uid() = user_id);

-- --- lead_emails: 誰でもINSERTのみ可（SELECTはService Roleのみ） ---
create policy "lead_emails_insert_anyone" on public.lead_emails
  for insert with check (true);
