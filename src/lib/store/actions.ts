"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "./slug";
import type { PolishStyle } from "@/lib/supabase/types";

const STORE_NAME_MAX = 100;
const MAX_SLUG_RETRIES = 5;
const POLISH_STYLES: readonly PolishStyle[] = ["casual", "formal"] as const;

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export type CreateStoreResult =
  | { success: true }
  | { success: false; error: string };

export async function createStore(
  formData: FormData
): Promise<CreateStoreResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "ログインが必要です" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const googleReviewUrl = String(
    formData.get("google_review_url") ?? ""
  ).trim();

  if (!name || name.length > STORE_NAME_MAX) {
    return {
      success: false,
      error: "店舗名を入力してください（100文字以内）",
    };
  }

  if (!isValidUrl(googleReviewUrl)) {
    return {
      success: false,
      error:
        "Google レビューURLが正しくありません。https:// から始まる完全なURLを入力してください。",
    };
  }

  const { data: existingStore } = await supabase
    .from("stores")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingStore) {
    return {
      success: false,
      error:
        "すでに店舗が登録されています。フリープランでは1店舗まで管理できます。",
    };
  }

  let slug = generateSlug(name);
  for (let attempt = 0; attempt < MAX_SLUG_RETRIES; attempt++) {
    const { data: clash } = await supabase
      .from("stores")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!clash) break;
    slug = generateSlug(name);
  }

  const { error } = await supabase.from("stores").insert({
    user_id: user.id,
    name,
    google_review_url: googleReviewUrl,
    slug,
  });

  if (error) {
    return {
      success: false,
      error: `保存に失敗しました: ${error.message}`,
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export type UpdateStoreResult =
  | { success: true }
  | { success: false; error: string };

export async function updateStore(
  formData: FormData
): Promise<UpdateStoreResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "ログインが必要です" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const googleReviewUrl = String(
    formData.get("google_review_url") ?? ""
  ).trim();
  const polishStyleRaw = String(formData.get("polish_style") ?? "").trim();

  if (!name || name.length > STORE_NAME_MAX) {
    return {
      success: false,
      error: "店舗名を入力してください（100文字以内）",
    };
  }

  if (!isValidUrl(googleReviewUrl)) {
    return {
      success: false,
      error:
        "Google レビューURLが正しくありません。https:// から始まる完全なURLを入力してください。",
    };
  }

  const update: {
    name: string;
    google_review_url: string;
    polish_style?: PolishStyle;
  } = { name, google_review_url: googleReviewUrl };

  // polish_style は Standard プランのみ反映。Free はサーバ側で無視。
  if (polishStyleRaw && POLISH_STYLES.includes(polishStyleRaw as PolishStyle)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.plan === "standard") {
      update.polish_style = polishStyleRaw as PolishStyle;
    }
  }

  const { error } = await supabase
    .from("stores")
    .update(update)
    .eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      error: `更新に失敗しました: ${error.message}`,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { success: true };
}
