import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { QrCodeBox } from "@/components/qr-code-box";

export const metadata = {
  title: "ダッシュボード｜Props Voice",
};

const FREE_LIMIT = 3;

function currentYearMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function DashboardPage() {
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

  const yearMonth = currentYearMonth();
  const { data: usage } = await supabase
    .from("usage_monthly")
    .select()
    .eq("user_id", user.id)
    .eq("year_month", yearMonth)
    .maybeSingle();

  const usedCount = usage?.count ?? 0;
  const remaining = Math.max(0, FREE_LIMIT - usedCount);
  const isLimitReached = usedCount >= FREE_LIMIT;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const publicUrl = `${appUrl}/r/${store.slug}`;

  return (
    <main className="flex-1 px-4 py-10 sm:py-12 bg-muted/40">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Props Voice
            </p>
            <h1 className="text-2xl font-bold text-brand">ダッシュボード</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40"
            >
              ログアウト
            </button>
          </form>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">登録店舗</p>
              <h2 className="text-lg font-semibold text-foreground">
                {store.name}
              </h2>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">公開URL</p>
              <code className="block break-all rounded-md bg-muted px-3 py-2 text-xs">
                {publicUrl}
              </code>
            </div>

            <div className="space-y-1 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">今月の整文（フリープラン）</p>
              <p className="text-2xl font-bold text-foreground">
                {usedCount}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  / {FREE_LIMIT} 人
                </span>
              </p>
              {isLimitReached ? (
                <p className="text-xs text-rose-700">
                  今月の無料枠を使い切りました。来月1日にリセットされます。
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  あと {remaining} 人分整文できます。
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <p className="text-xs text-muted-foreground mb-3">QRコード</p>
            <QrCodeBox url={publicUrl} storeName={store.name} />
          </div>
        </section>

        <p className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← トップに戻る
          </Link>
        </p>
      </div>
    </main>
  );
}
