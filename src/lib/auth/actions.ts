"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function requestEmailOtp(email: string): Promise<ActionResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
    return { success: false, error: "メールアドレスの形式が正しくありません" };
  }

  const supabase = await createClient();
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${appUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error("[requestEmailOtp] Supabase error:", {
      message: error.message,
      status: error.status,
      code: error.code,
      name: error.name,
    });
    if (error.code === "over_email_send_rate_limit") {
      const secondsMatch = error.message.match(/(\d+)\s*seconds?/i);
      if (secondsMatch) {
        return {
          success: false,
          error: `セキュリティのため、${secondsMatch[1]}秒ほど待ってからもう一度お試しください。`,
        };
      }
      return {
        success: false,
        error:
          "短時間に送信が集中しています。1時間ほど時間をおいてからもう一度お試しください。",
      };
    }
    return {
      success: false,
      error: "送信に失敗しました。しばらくしてからもう一度お試しください。",
    };
  }

  return {
    success: true,
    message: `${trimmed} 宛に8桁のコードを送信しました。メールをご確認ください。`,
  };
}

export async function verifyEmailOtp(
  email: string,
  token: string
): Promise<ActionResult> {
  const trimmedEmail = email.trim().toLowerCase();
  const cleanToken = token.replace(/\D/g, "");

  if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
    return { success: false, error: "メールアドレスの形式が正しくありません" };
  }

  if (cleanToken.length < 6 || cleanToken.length > 8) {
    return {
      success: false,
      error: "コードは6〜8桁の数字で入力してください",
    };
  }

  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email: trimmedEmail,
    token: cleanToken,
    type: "email",
  });

  if (verifyError) {
    return {
      success: false,
      error:
        "コードが正しくないか、期限切れです。新しいコードを送信してもう一度お試しください。",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "認証に失敗しました。もう一度お試しください。",
    };
  }

  const { data: store } = await supabase
    .from("stores")
    .select()
    .eq("user_id", user.id)
    .maybeSingle();

  revalidatePath("/", "layout");
  redirect(store ? "/dashboard" : "/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
