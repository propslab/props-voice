import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings-form";
import { DeleteAccountButton } from "@/components/delete-account-button";
import { UpgradeButton } from "@/components/upgrade-button";
import { PortalButton } from "@/components/portal-button";

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

  const [{ data: store }, { data: profile }] = await Promise.all([
    supabase.from("stores").select().eq("user_id", user.id).maybeSingle(),
    supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
  ]);

  if (!store) {
    redirect("/onboarding");
  }

  const plan = profile?.plan ?? "free";
  const isStandard = plan === "standard";

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
            initialPolishStyle={store.polish_style}
            plan={plan}
          />
        </div>

        <section className="rounded-lg border border-border bg-white p-6 shadow-sm space-y-4 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                プラン管理
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {isStandard
                  ? "Standard プランをご利用中です"
                  : "現在は Free プランです"}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${
                isStandard
                  ? "bg-brand text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isStandard && (
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
                </svg>
              )}
              {isStandard ? "Standard" : "Free"}
            </span>
          </div>

          {isStandard ? (
            <div className="space-y-4">
              <div className="rounded-md bg-muted/40 px-4 py-3 text-xs text-muted-foreground space-y-1">
                <p>¥1,980 / 月（税込）</p>
                <p>請求情報の変更・解約は Stripe の請求管理画面から行えます。</p>
                <p>
                  解約後は次回更新日まで Standard 機能をご利用いただけます。
                </p>
              </div>
              <PortalButton />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border border-border bg-muted/30 p-4 space-y-3">
                <p className="text-xs font-semibold text-foreground">
                  Standard プランで使える機能
                </p>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand">✓</span>
                    <span>月 20 名分の整文（Free は 3 名）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand">✓</span>
                    <span>整文スタイル選択（フォーマル / カジュアル）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand">✓</span>
                    <span>整文した口コミの再編集</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand">✓</span>
                    <span>口コミデータの CSV 書き出し</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand">✓</span>
                    <span>★1〜3 の口コミをメール通知</span>
                  </li>
                </ul>
                <p className="text-[11px] text-muted-foreground pt-1 border-t border-border">
                  ¥1,980 / 月（税込）· いつでも解約可能
                </p>
              </div>
              <UpgradeButton />
              <p className="text-[11px] text-muted-foreground">
                決済は{" "}
                <a
                  href="https://stripe.com/jp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  Stripe
                </a>{" "}
                を通じて安全に処理されます。
              </p>
            </div>
          )}
        </section>

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
