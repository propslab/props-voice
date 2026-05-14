"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { polishWithClaude } from "@/lib/anthropic/polish";

const MAX_INPUT_LENGTH = 200;
const MAX_POLISHED_LENGTH = 1000;
const DEFAULT_MONTHLY_LIMIT = 3;

// `POLISH_MONTHLY_LIMIT` 環境変数で月の整文上限を制御。
// - 未設定または "3" 等の正の数値 → その人数で制限
// - "0" または負の数値 → 無制限（ローンチ前テスト用）
function resolveMonthlyLimit(): number {
  const raw = process.env.POLISH_MONTHLY_LIMIT;
  if (raw === undefined || raw === "") return DEFAULT_MONTHLY_LIMIT;
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) return DEFAULT_MONTHLY_LIMIT;
  return parsed;
}

export type PolishResult =
  | { success: true; polished: string; googleReviewUrl: string }
  | { success: false; error: string };

function currentYearMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function polishDraft(
  slug: string,
  rating: number,
  rawInput: string
): Promise<PolishResult> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, error: "評価を選択してください" };
  }
  const cleaned = rawInput.trim();
  if (!cleaned) {
    return { success: false, error: "一言を入力してください" };
  }
  if (cleaned.length > MAX_INPUT_LENGTH) {
    return {
      success: false,
      error: `${MAX_INPUT_LENGTH}文字以内で入力してください`,
    };
  }

  const supabase = createServiceClient();

  const { data: store } = await supabase
    .from("stores")
    .select()
    .eq("slug", slug)
    .maybeSingle();

  if (!store) {
    return { success: false, error: "店舗が見つかりません" };
  }

  const yearMonth = currentYearMonth();
  const { data: usage } = await supabase
    .from("usage_monthly")
    .select()
    .eq("user_id", store.user_id)
    .eq("year_month", yearMonth)
    .maybeSingle();

  const currentCount = usage?.count ?? 0;
  const monthlyLimit = resolveMonthlyLimit();
  if (monthlyLimit > 0 && currentCount >= monthlyLimit) {
    return {
      success: false,
      error: `今月の整文枠（${monthlyLimit}名分）を使い切りました。来月1日にリセットされます。`,
    };
  }

  let polished: string;
  try {
    polished = await polishWithClaude(store.name, rating, cleaned);
  } catch (e) {
    console.error("[polishDraft] Claude error:", e);
    return {
      success: false,
      error: "AI整文中にエラーが発生しました。しばらくしてからもう一度お試しください。",
    };
  }

  if (polished.length > MAX_POLISHED_LENGTH) {
    polished = polished.slice(0, MAX_POLISHED_LENGTH);
  }

  if (usage) {
    await supabase
      .from("usage_monthly")
      .update({ count: currentCount + 1 })
      .eq("id", usage.id);
  } else {
    await supabase.from("usage_monthly").insert({
      user_id: store.user_id,
      year_month: yearMonth,
      count: 1,
    });
  }

  await supabase.from("drafts").insert({
    store_id: store.id,
    rating,
    raw_input: cleaned,
    polished_text: polished,
  });

  return {
    success: true,
    polished,
    googleReviewUrl: store.google_review_url,
  };
}
