-- ============================================================
-- 2026-05-17 マイグレーション: Stripe 連携 + Standard 機能
-- 戦略変更（3段ファネル）に伴うスキーマ拡張
-- ============================================================
--
-- 実行方法:
--   1. Supabase Dashboard を開く
--   2. 左メニュー → SQL Editor → New query
--   3. このファイル全文を貼り付け
--   4. Run（または Cmd/Ctrl + Enter）
--
-- ロールバック（万一の場合）:
--   このファイル末尾のコメントアウトされた DROP 文を参考に。
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 1. profiles に Stripe 関連カラムを追加
-- ─────────────────────────────────────────────────────────────
-- plan カラムは既に存在（'free' / 'standard'）。
-- ここでは Stripe との連携に必要な ID 群を追加する。

alter table public.profiles
  add column if not exists stripe_customer_id text unique,
  add column if not exists stripe_subscription_id text unique,
  add column if not exists plan_updated_at timestamptz;


-- ─────────────────────────────────────────────────────────────
-- 2. stores に整文スタイル選択を追加（Standard プラン機能）
-- ─────────────────────────────────────────────────────────────
-- Free プランは casual のみ。Standard プランは formal も選択可。
-- ただし DB レベルで制限せず、アプリケーション層（Server Action）で判定する。

alter table public.stores
  add column if not exists polish_style text not null default 'casual'
    check (polish_style in ('formal', 'casual'));


-- ─────────────────────────────────────────────────────────────
-- 3. drafts に再編集機能を追加（Standard プラン機能）
-- ─────────────────────────────────────────────────────────────
-- 元の polished_text は不変。
-- Standard ユーザーが編集した結果は edited_polished_text に保存。

alter table public.drafts
  add column if not exists edited_polished_text text
    check (edited_polished_text is null or char_length(edited_polished_text) <= 1000),
  add column if not exists edited_at timestamptz;


-- ─────────────────────────────────────────────────────────────
-- 4. インデックス追加（Stripe Webhook 検索高速化）
-- ─────────────────────────────────────────────────────────────

create index if not exists profiles_stripe_customer_id_idx
  on public.profiles(stripe_customer_id)
  where stripe_customer_id is not null;

create index if not exists profiles_stripe_subscription_id_idx
  on public.profiles(stripe_subscription_id)
  where stripe_subscription_id is not null;


-- ─────────────────────────────────────────────────────────────
-- 5. RLS ポリシーは既存のものを継承（追加変更なし）
-- ─────────────────────────────────────────────────────────────
-- profiles_select_own / profiles_update_own は既に作成済。
-- stripe_customer_id / stripe_subscription_id / plan_updated_at も
-- 同じポリシーの下で本人だけがアクセス可能。
--
-- アプリ側で Stripe Webhook 経由の更新は Service Role キーで行うため、
-- RLS を回避できる（service_role 経由なら RLS スキップ）。


-- ============================================================
-- ロールバック用 SQL（コメントアウト、万一の場合に使用）
-- ============================================================
-- alter table public.profiles
--   drop column if exists stripe_customer_id,
--   drop column if exists stripe_subscription_id,
--   drop column if exists plan_updated_at;
-- alter table public.stores drop column if exists polish_style;
-- alter table public.drafts
--   drop column if exists edited_polished_text,
--   drop column if exists edited_at;
-- drop index if exists profiles_stripe_customer_id_idx;
-- drop index if exists profiles_stripe_subscription_id_idx;
