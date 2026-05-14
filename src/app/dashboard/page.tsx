import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";

export const metadata = {
  title: "ダッシュボード｜Props Voice",
};

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

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
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

        <section className="rounded-lg border border-border bg-white p-6 shadow-sm space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">登録店舗</p>
            <h2 className="text-lg font-semibold text-foreground">
              {store.name}
            </h2>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">公開URL</p>
            <code className="block break-all rounded-md bg-muted px-3 py-2 text-sm">
              {publicUrl}
            </code>
          </div>

          <p className="text-xs text-muted-foreground">
            QRコードの表示・ダウンロード、下書き一覧、月利用カウンタは Day 4 で実装予定。
          </p>
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
