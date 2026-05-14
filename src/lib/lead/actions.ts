"use server";

import { createServiceClient } from "@/lib/supabase/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadResult =
  | { success: true }
  | { success: false; error: string };

export async function subscribeStandardLead(
  email: string
): Promise<LeadResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
    return { success: false, error: "メールアドレスの形式が正しくありません" };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("lead_emails").insert({
    email: trimmed,
    interested_plan: "standard",
  });

  if (error) {
    console.error("[subscribeStandardLead] insert error:", error);
    return {
      success: false,
      error: "登録に失敗しました。しばらくしてからもう一度お試しください。",
    };
  }

  return { success: true };
}
