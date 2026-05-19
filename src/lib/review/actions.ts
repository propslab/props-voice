"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { polishWithClaude, PolishRefusedError } from "@/lib/anthropic/polish";
import { sendLowRatingAlert } from "@/lib/email/resend";
import type { PolishStyle, Plan } from "@/lib/supabase/types";

const LOW_RATING_THRESHOLD = 3;

const MAX_INPUT_LENGTH = 200;
const MAX_POLISHED_LENGTH = 1000;
const DEFAULT_MONTHLY_LIMIT = 3;
const STANDARD_MONTHLY_LIMIT = 20;

// `POLISH_MONTHLY_LIMIT` 環境変数で月の整文上限を上書き（ローンチ前テスト用）。
// - 未設定 → plan ごとのデフォルト（Free=3 / Standard=20）
// - "0" や負の数値 → 無制限
// - 正の数値 → その値を上限として全プランに適用
function resolveMonthlyLimit(plan: Plan): number {
  const raw = process.env.POLISH_MONTHLY_LIMIT;
  if (raw !== undefined && raw !== "") {
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return plan === "standard" ? STANDARD_MONTHLY_LIMIT : DEFAULT_MONTHLY_LIMIT;
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, email")
    .eq("id", store.user_id)
    .maybeSingle();

  const plan: Plan = profile?.plan ?? "free";
  // Free プランは casual に強制。Standard のみ store.polish_style を尊重。
  const style: PolishStyle = plan === "standard" ? store.polish_style : "casual";

  const yearMonth = currentYearMonth();
  const { data: usage } = await supabase
    .from("usage_monthly")
    .select()
    .eq("user_id", store.user_id)
    .eq("year_month", yearMonth)
    .maybeSingle();

  const currentCount = usage?.count ?? 0;
  const monthlyLimit = resolveMonthlyLimit(plan);
  if (monthlyLimit > 0 && currentCount >= monthlyLimit) {
    return {
      success: false,
      error: `今月の整文枠（${monthlyLimit}名分）を使い切りました。来月1日にリセットされます。`,
    };
  }

  let polished: string;
  try {
    polished = await polishWithClaude(store.name, rating, cleaned, style);
  } catch (e) {
    if (e instanceof PolishRefusedError) {
      // 来店客に「もう一度整える」を促す。カウントは消費しない。
      return {
        success: false,
        error: "AI が整文しきれませんでした。少し言葉を変えてもう一度お試しください。",
      };
    }
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

  // Standard プランかつ ★1-3 のときオーナーに低評価アラートを送信。
  // 送信失敗は polishDraft の成功判定に影響させない（fire-and-forget 寄り）。
  if (plan === "standard" && rating <= LOW_RATING_THRESHOLD && profile?.email) {
    await sendLowRatingAlert({
      to: profile.email,
      storeName: store.name,
      rating,
      rawInput: cleaned,
      polished,
    });
  }

  return {
    success: true,
    polished,
    googleReviewUrl: store.google_review_url,
  };
}

export type UpdateDraftResult =
  | { success: true; editedText: string; editedAt: string }
  | { success: false; error: string };

// Standard プラン限定: 過去の整文結果を再編集する。
// 元の polished_text は不変。編集結果は edited_polished_text に上書き保存。
export async function updateDraft(
  draftId: string,
  editedText: string
): Promise<UpdateDraftResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "ログインが必要です" };
  }

  const cleaned = editedText.trim();
  if (!cleaned) {
    return { success: false, error: "本文を入力してください" };
  }
  if (cleaned.length > MAX_POLISHED_LENGTH) {
    return {
      success: false,
      error: `${MAX_POLISHED_LENGTH}文字以内で入力してください`,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.plan !== "standard") {
    return {
      success: false,
      error: "Standard プランで利用可能な機能です",
    };
  }

  // 店舗オーナー本人であることを確認（drafts → store → user_id）
  const { data: draft } = await supabase
    .from("drafts")
    .select("id, store_id")
    .eq("id", draftId)
    .maybeSingle();

  if (!draft) {
    return { success: false, error: "対象の口コミが見つかりません" };
  }

  const { data: ownerStore } = await supabase
    .from("stores")
    .select("id")
    .eq("id", draft.store_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!ownerStore) {
    return { success: false, error: "この口コミを編集する権限がありません" };
  }

  const editedAt = new Date().toISOString();
  const { error } = await supabase
    .from("drafts")
    .update({ edited_polished_text: cleaned, edited_at: editedAt })
    .eq("id", draft.id);

  if (error) {
    return {
      success: false,
      error: `更新に失敗しました: ${error.message}`,
    };
  }

  revalidatePath("/dashboard");
  return { success: true, editedText: cleaned, editedAt };
}
