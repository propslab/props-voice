import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings-form";
import { DeleteAccountButton } from "@/components/delete-account-button";

export const metadata = {
  title: "設定｜Props Voice",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: store } = await supabase
    .from("stores")
    .select()
    .eq("user_id", user.id)
    .maybeSingle();

  if (!store) {
    redirect("/onboarding");
  }

  return (
    <main className="flex-1 px-4 py-10 sm:py-12 bg-muted/40">
      <div className="mx-auto w-full max-w-xl space-y-6">
        <header className="space-y-1">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Props Voice
          </p>
          <h1 className="text-2xl font-bold text-brand">設定</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </header>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm sm:p-8">
          <SettingsForm
            initialName={store.name}
            initialGoogleReviewUrl={store.google_review_url}
          />
        </div>

        <section className="rounded-lg border border-border bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              危険な操作
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              アカウントを削除すると、店舗情報・QRコード・口コミ履歴がすべて消去されます。元に戻せません。
            </p>
          </div>
          <DeleteAccountButton />
        </section>

        <p className="text-center">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← ダッシュボードに戻る
          </Link>
        </p>
      </div>
    </main>
  );
}
