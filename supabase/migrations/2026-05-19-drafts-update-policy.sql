-- ============================================================
-- 2026-05-19 マイグレーション: drafts に UPDATE RLS ポリシー追加
-- ============================================================
--
-- 背景:
-- Standard プランの「下書き再編集」機能（edited_polished_text 更新）が
-- RLS により silent fail していた。drafts には SELECT/DELETE/INSERT のみ
-- ポリシーが存在し、UPDATE は未定義だったため、RLS が拒否していた。
--
-- 実行方法:
--   1. Supabase Dashboard → SQL Editor → New query
--   2. このファイル全文を貼り付け
--   3. Run
--
-- ============================================================

-- drafts: 本人（店舗オーナー）のみ UPDATE 可
create policy "drafts_update_own" on public.drafts
  for update to authenticated using (
    exists (
      select 1 from public.stores
      where stores.id = drafts.store_id and stores.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.stores
      where stores.id = drafts.store_id and stores.user_id = auth.uid()
    )
  );

-- ============================================================
-- ロールバック用
-- ============================================================
-- drop policy "drafts_update_own" on public.drafts;
