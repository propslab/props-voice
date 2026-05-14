"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export async function signInWithMagicLink(
  email: string
): Promise<ActionResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, error: "メールアドレスの形式が正しくありません" };
  }

  const supabase = await createClient();
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: "送信に失敗しました。しばらくしてからもう一度お試しください。",
    };
  }

  return {
    success: true,
    message: `${trimmed} 宛にログイン用リンクを送信しました。メールをご確認ください。`,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
