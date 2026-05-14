import Link from "next/link";
import { LeadEmailForm } from "@/components/lead-email-form";

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "QRコードを置く",
    description:
      "店内の受付やレジ横にQRコードを掲示。お会計の前後など、自然なタイミングで読んでもらいます。",
  },
  {
    num: "02",
    title: "お客様が一言だけ書く",
    description:
      "評価★1-5と短いコメントを入力。「丁寧」「席が広い」など、思ったことを書いてもらうだけでOK。",
  },
  {
    num: "03",
    title: "AIが自然な文章に整える",
    description:
      "一言を Google レビュー投稿用の自然な日本語に変換。書き慣れていないお客様もスムーズに投稿できます。",
  },
  {
    num: "04",
    title: "Google レビューへ投稿",
    description:
      "整った文章をコピー&Googleマップを開く。お客様の口コミがそのまま Google に積み上がります。",
  },
];

const USE_CASES = [
  { icon: "✂️", label: "美容院・サロン" },
  { icon: "🍴", label: "飲食店・カフェ" },
  { icon: "💆", label: "整体・マッサージ" },
  { icon: "✨", label: "エステ・ネイル" },
  { icon: "🦷", label: "歯科・クリニック" },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="px-6 pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Props Lab presents
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-brand leading-[1.2]">
            QRを置くだけで、
            <br />
            来店客の声が
            <br className="sm:hidden" />
            Google レビューになる。
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            お客様の一言を AI が自然な口コミ文に整え、
            <br className="hidden sm:inline" />
            Google マップへの投稿をスムーズに案内する、
            <br className="hidden sm:inline" />
            無料の口コミ収集ツール。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto rounded-md bg-brand px-8 py-3 text-base font-medium text-brand-foreground hover:bg-brand-soft transition-colors"
            >
              今すぐ無料で始める
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-md border border-border px-8 py-3 text-base font-medium text-foreground hover:border-foreground/40 transition-colors"
            >
              ログイン
            </Link>
          </div>

          <p className="text-xs text-muted-foreground pt-2">
            クレジットカード不要。メールアドレスだけで5秒で始められます。
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="px-6 py-12 sm:py-16 border-y border-border bg-muted/40">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
            こんな店舗で使えます
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {USE_CASES.map((useCase) => (
              <li
                key={useCase.label}
                className="rounded-lg bg-white border border-border px-4 py-5 text-center"
              >
                <p className="text-3xl mb-2" aria-hidden>
                  {useCase.icon}
                </p>
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {useCase.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center space-y-2 mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              How it works
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand">
              使い方は4ステップ
            </h2>
          </div>

          <ol className="grid gap-6 sm:grid-cols-2">
            {HOW_IT_WORKS.map((step) => (
              <li
                key={step.num}
                className="rounded-lg border border-border bg-white p-6 space-y-3"
              >
                <p className="text-sm font-mono text-brand">{step.num}</p>
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 sm:py-20 bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-3xl">
          <div className="text-center space-y-2 mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Pricing
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand">料金プラン</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Free */}
            <div className="rounded-lg border-2 border-brand bg-white p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-brand uppercase tracking-wider">
                  Free
                </p>
                <h3 className="text-2xl font-bold text-foreground">
                  フリープラン
                </h3>
                <p className="text-3xl font-bold text-foreground">
                  ¥0
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}/ 月
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">ずっと無料</p>
              </div>

              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>AI整文サポート 月3人まで</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>店舗管理 1店舗</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>QRコード自動生成（PNGダウンロード可）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>口コミ数推移グラフ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>下書き履歴の表示</span>
                </li>
              </ul>

              <Link
                href="/signup"
                className="block w-full rounded-md bg-brand px-4 py-2.5 text-center text-sm font-medium text-brand-foreground hover:bg-brand-soft transition-colors"
              >
                今すぐ無料で始める
              </Link>
            </div>

            {/* Standard (Coming Soon) */}
            <div className="rounded-lg border border-border bg-white p-6 space-y-4 opacity-90">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Standard
                </p>
                <h3 className="text-2xl font-bold text-foreground">
                  スタンダードプラン
                </h3>
                <p className="text-3xl font-bold text-foreground">
                  ¥1,980
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}/ 月
                  </span>
                </p>
                <p className="text-xs text-amber-700 font-medium">近日公開</p>
              </div>

              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">○</span>
                  <span>AI整文サポート 月20人まで</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">○</span>
                  <span>整文スタイル選択（フォーマル / カジュアル）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">○</span>
                  <span>下書き履歴の再編集</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">○</span>
                  <span>低評価アラート通知</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">○</span>
                  <span>口コミデータ CSV 書き出し</span>
                </li>
              </ul>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  公開時にメールでお知らせします
                </p>
                <LeadEmailForm />
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8 max-w-xl mx-auto">
            より本格的な集客改善や口コミ運用が必要な店舗様は、
            <a
              href="https://props-lab.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              Props Lab のIT顧問契約
            </a>
            （月額¥8,000〜）でご相談いただけます。
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand">
            お客様の声を、もっと簡単に。
          </h2>
          <p className="text-base text-muted-foreground">
            登録は1分、明日からすぐ使えます。
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-md bg-brand px-8 py-3 text-base font-medium text-brand-foreground hover:bg-brand-soft transition-colors"
          >
            今すぐ無料で始める
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-border bg-muted/40">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://props-lab.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Props Lab
            </a>
          </p>
          <nav className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground">
              利用規約
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              プライバシーポリシー
            </Link>
            <Link href="/login" className="hover:text-foreground">
              ログイン
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
