import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "店舗を登録｜Props Voice",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existingStore } = await supabase
    .from("stores")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingStore) {
    redirect("/dashboard");
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-muted/40">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            ステップ 1 / 1
          </p>
          <h1 className="text-2xl font-bold text-brand">店舗情報を登録</h1>
          <p className="text-sm text-muted-foreground">
            この情報をもとに、QRコードと公開URLを自動で発行します。
          </p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm sm:p-8">
          <OnboardingForm />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          後から「設定」画面でいつでも変更できます。
        </p>
      </div>
    </main>
  );
}
