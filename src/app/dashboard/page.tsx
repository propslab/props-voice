import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { QrCodeBox } from "@/components/qr-code-box";
import { CopyButton } from "@/components/copy-button";
import { UpgradeButton } from "@/components/upgrade-button";
import { PortalButton } from "@/components/portal-button";

export const metadata = {
  title: "ダッシュボード｜Props Voice",
};

const DEFAULT_MONTHLY_LIMIT = 3;
const STANDARD_MONTHLY_LIMIT = 20;
const PAST_MONTHS_FOR_CHART = 6;
const DRAFTS_LIMIT = 20;

function resolveMonthlyLimit(plan: "free" | "standard"): number {
  const raw = process.env.POLISH_MONTHLY_LIMIT;
  if (raw !== undefined && raw !== "") {
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return plan === "standard" ? STANDARD_MONTHLY_LIMIT : DEFAULT_MONTHLY_LIMIT;
}

function currentYearMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function pastYearMonths(count: number): string[] {
  const result: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push(ym);
  }
  return result;
}

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

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
  const chartMonths = pastYearMonths(PAST_MONTHS_FOR_CHART);

  const [{ data: usageRows }, { data: drafts }, { data: profile }] =
    await Promise.all([
      supabase
        .from("usage_monthly")
        .select()
        .eq("user_id", user.id)
        .in("year_month", chartMonths),
      supabase
        .from("drafts")
        .select()
        .eq("store_id", store.id)
        .order("created_at", { ascending: false })
        .limit(DRAFTS_LIMIT),
      supabase.from("profiles").select("plan").eq("id", user.id).single(),
    ]);

  const plan = (profile?.plan ?? "free") as "free" | "standard";
  const isStandard = plan === "standard";

  const usageMap = new Map<string, number>(
    usageRows?.map((row) => [row.year_month, row.count]) ?? []
  );
  const monthlyChart = chartMonths.map((ym) => ({
    ym,
    count: usageMap.get(ym) ?? 0,
  }));
  const usedCount = usageMap.get(yearMonth) ?? 0;
  const maxChartCount = Math.max(1, ...monthlyChart.map((m) => m.count));
  const totalDrafts = drafts?.length ?? 0;
  const hasAnyUsage = monthlyChart.some((m) => m.count > 0);

  const monthlyLimit = resolveMonthlyLimit(plan);
  const isUnlimited = monthlyLimit <= 0;
  const remaining = isUnlimited
    ? null
    : Math.max(0, monthlyLimit - usedCount);
  const isLimitReached = !isUnlimited && usedCount >= monthlyLimit;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const publicUrl = `${appUrl}/r/${store.slug}`;

  return (
    <main className="flex-1 px-4 py-10 sm:py-12 bg-muted/40">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1 min-w-0">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Props Voice
            </p>
            <h1 className="text-2xl font-bold text-brand">ダッシュボード</h1>
            <p className="text-sm text-muted-foreground break-all">{user.email}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/settings"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3.5 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted hover:border-foreground/30 transition-colors whitespace-nowrap"
            >
              <svg
                className="h-4 w-4 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              設定
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3.5 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted hover:border-foreground/30 transition-colors whitespace-nowrap"
              >
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                ログアウト
              </button>
            </form>
          </div>
        </header>

        {/* 店舗情報 + QRコード */}
        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">登録店舗</p>
              <h2 className="text-lg font-semibold text-foreground">
                {store.name}
              </h2>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">公開URL</p>
                <CopyButton value={publicUrl} />
              </div>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all rounded-md bg-muted px-3 py-2 text-xs text-foreground hover:bg-muted/80"
              >
                {publicUrl}
              </a>
            </div>

            <div className="space-y-3 pt-2 border-t border-border">
              {/* プランバッジ */}
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">現在のプラン</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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

              {/* 月利用カウンタ */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  今月の整文
                  {isUnlimited && "（テスト期間：無制限）"}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {usedCount}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    {isUnlimited ? "人" : `/ ${monthlyLimit} 人`}
                  </span>
                </p>
                {isUnlimited ? (
                  <p className="text-xs text-muted-foreground">
                    ローンチ前のため上限なくご利用いただけます。
                  </p>
                ) : isLimitReached ? (
                  <p className="text-xs text-rose-700">
                    今月の枠を使い切りました。来月1日にリセットされます。
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    あと {remaining} 人分整文できます。
                  </p>
                )}
              </div>

              {/* プランボタン */}
              <div className="pt-1">
                {isStandard ? <PortalButton /> : <UpgradeButton />}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <p className="text-xs text-muted-foreground mb-3">QRコード</p>
            <QrCodeBox url={publicUrl} storeName={store.name} />
          </div>
        </section>

        {/* 月の口コミ数推移グラフ */}
        <section className="rounded-lg border border-border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              月の整文数（過去 {PAST_MONTHS_FOR_CHART} ヶ月）
            </h2>
            <p className="text-xs text-muted-foreground">
              合計 {monthlyChart.reduce((sum, m) => sum + m.count, 0)} 件
            </p>
          </div>

          {hasAnyUsage ? (
            <div className="space-y-2">
              <div className="flex items-end gap-2 h-32">
                {monthlyChart.map(({ ym, count }, idx) => {
                  const heightPct = (count / maxChartCount) * 100;
                  const isCurrent = idx === monthlyChart.length - 1;
                  return (
                    <div
                      key={ym}
                      className="flex-1 flex flex-col items-center gap-1 min-w-0"
                    >
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {count > 0 ? count : ""}
                      </span>
                      <div
                        className={`w-full rounded-t transition-colors ${
                          isCurrent ? "bg-brand" : "bg-brand/40"
                        }`}
                        style={{
                          height: count > 0 ? `${Math.max(8, heightPct)}%` : "2px",
                          minHeight: count > 0 ? "8px" : "2px",
                        }}
                        aria-label={`${ym}: ${count}件`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                {monthlyChart.map(({ ym }) => {
                  const month = parseInt(ym.split("-")[1], 10);
                  return (
                    <span
                      key={ym}
                      className="flex-1 text-center text-xs text-muted-foreground tabular-nums"
                    >
                      {month}月
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              まだ整文した口コミがありません。
              <br />
              QRコードを店頭に置いて、お客様の声を集めましょう。
            </p>
          )}
        </section>

        {/* 下書き一覧 */}
        <section className="rounded-lg border border-border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              整文した口コミ
            </h2>
            <p className="text-xs text-muted-foreground">
              最新 {totalDrafts} 件 / 最大 {DRAFTS_LIMIT} 件表示
            </p>
          </div>

          {drafts && drafts.length > 0 ? (
            <ul className="divide-y divide-border">
              {drafts.map((draft) => (
                <li key={draft.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-amber-400" aria-label={`${draft.rating}つ星`}>
                      {"★".repeat(draft.rating)}
                      <span className="text-gray-300">
                        {"★".repeat(5 - draft.rating)}
                      </span>
                    </p>
                    <time
                      dateTime={draft.created_at}
                      className="text-xs text-muted-foreground tabular-nums"
                    >
                      {dateTimeFormatter.format(new Date(draft.created_at))}
                    </time>
                  </div>

                  {draft.polished_text && (
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {draft.polished_text}
                    </p>
                  )}

                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer hover:text-foreground">
                      お客様の原文を見る
                    </summary>
                    <p className="mt-2 pl-3 border-l-2 border-border whitespace-pre-wrap">
                      {draft.raw_input}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              まだ口コミが投稿されていません。
            </p>
          )}
        </section>

        <footer className="pt-6 border-t border-border space-y-2 text-center">
          <p className="text-xs text-muted-foreground">
            Props Voice は{" "}
            <a
              href="https://props-lab.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Props Lab
            </a>
            （IT 顧問業務）が提供する無料の口コミ収集ツールです。
          </p>
          <p className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              トップ
            </Link>
            {" · "}
            <Link href="/settings" className="hover:text-foreground">
              設定
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
