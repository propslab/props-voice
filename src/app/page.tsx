import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { LeadEmailForm } from "@/components/lead-email-form";

const NAV_ITEMS = [
  { label: "機能紹介", href: "#features" },
  { label: "使い方", href: "#how-it-works" },
  { label: "料金プラン", href: "#pricing" },
  { label: "よくあるご質問", href: "#faq" },
];

const PAINS = [
  {
    icon: "💬",
    title: "「クチコミを書いてください」が言いづらい",
    description: "お客様にお願いするのが心理的に重く、聞きそびれてしまう。",
  },
  {
    icon: "📱",
    title: "書き慣れていないお客様には負担",
    description: "投稿フォームが長く、文章を考える時間がなくて諦められる。",
  },
  {
    icon: "💰",
    title: "口コミ管理ツールは月額が高い",
    description: "個人店や小規模店舗には手が出ないサービスが多い。",
  },
  {
    icon: "📍",
    title: "Google マップで埋もれる",
    description: "口コミ数が伸びず、新規のお客様の検索に出てこない。",
  },
];

const USE_CASES = [
  { icon: "✂️", label: "美容院・サロン" },
  { icon: "🍴", label: "飲食店・カフェ" },
  { icon: "💆", label: "整体・マッサージ" },
  { icon: "✨", label: "エステ・ネイル" },
  { icon: "🦷", label: "歯科・クリニック" },
];

const STEPS = [
  {
    num: "01",
    title: "QRコードを置く",
    description:
      "ダッシュボードから印刷用のQR画像をダウンロード。受付やテーブルに置くだけで準備完了。",
  },
  {
    num: "02",
    title: "お客様が一言だけ書く",
    description:
      "評価★と短いコメントを入力。「丁寧」「席が広い」など思ったことを一言書いてもらいます。",
  },
  {
    num: "03",
    title: "AIが自然な文章に整える",
    description:
      "一言をGoogleレビュー用の自然な日本語に変換。表現だけを整え、内容は変えません。",
  },
  {
    num: "04",
    title: "Googleレビューへ投稿",
    description:
      "整った文章をコピーしてGoogleマップを開きます。お客様は貼り付けて投稿するだけ。",
  },
];

const REASONS = [
  {
    num: "01",
    title: "完全無料、クレジットカード不要",
    description:
      "メールアドレス1つで今すぐ始められます。隠れた課金はありません。",
  },
  {
    num: "02",
    title: "お客様の負担が、ほぼゼロ",
    description:
      "書き慣れていないお客様でも、評価★と一言だけで完結。AIが後を引き受けます。",
  },
  {
    num: "03",
    title: "新規来店に直結する Google レビュー",
    description:
      "SNSや独自プラットフォームではなく、検索でヒットするGoogleマップに口コミが積み上がります。",
  },
  {
    num: "04",
    title: "運営はIT顧問業のProps Lab",
    description:
      "日々お店の業務改善を支援するProps Labが運営。商用利用に耐えるインフラと使いやすさを両立。",
  },
];

const FAQS = [
  {
    q: "本当に無料で使えますか？広告は表示されますか？",
    a: "はい、フリープランは無料でご利用いただけます。広告表示もありません。AI整文は月3人までの制限がありますが、来月1日にリセットされます。",
  },
  {
    q: "お客様の入力した内容は何に使われますか？",
    a: "AI整文のためAnthropic（Claude API）に送信し、整文結果と一緒にデータベースに保存します。第三者の広告などには一切利用しません。詳しくはプライバシーポリシーをご覧ください。",
  },
  {
    q: "AIが書いた内容と、お客様の本音が違っていたらどうなりますか？",
    a: "AI整文後はお客様自身が画面で確認・編集できます。投稿前に内容をチェックし、必要なら手直ししたうえでGoogleレビューに貼り付ける流れです。",
  },
  {
    q: "Googleのポリシー違反になりませんか？",
    a: "Props Voiceは「お客様の入力を整える補助」のみを行います。自動投稿はせず、対価誘導もしません。投稿は必ずお客様自身の操作で行われます。",
  },
  {
    q: "スマートフォン以外でも使えますか？",
    a: "お客様の入力画面はスマホ最適化されていますが、タブレット・PCでも動作します。店舗オーナー様の管理画面は端末を問いません。",
  },
];

export default function Home() {
  return (
    <div className="flex-1">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-brand text-lg">
            Props Voice
          </Link>
          <ul className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/login"
            className="rounded-md border border-border px-4 py-1.5 text-sm text-foreground hover:border-foreground/40 transition-colors"
          >
            ログイン
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
          <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
            {/* 左：コピー */}
            <div className="space-y-6">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Props Lab presents
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-brand leading-[1.2]">
                お客様の「ありがとう」が、
                <br />
                Google レビューに変わる。
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                来店時にQRを読んでもらうだけ。
                <br className="hidden sm:inline" />
                お客様の一言をAIが自然な口コミ文に整え、
                <br className="hidden sm:inline" />
                Googleマップへの投稿までスムーズに案内します。
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto rounded-md bg-accent px-8 py-3.5 text-center text-base font-semibold text-accent-foreground hover:bg-accent-soft transition-colors shadow-sm"
                >
                  今すぐ無料で始める
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto rounded-md border border-border px-8 py-3.5 text-center text-base font-medium text-foreground hover:border-foreground/40 transition-colors"
                >
                  使い方を見る
                </a>
              </div>

              <p className="text-xs text-muted-foreground">
                クレジットカード不要。メールアドレスだけで5分後には店頭に置けます。
              </p>
            </div>

            {/* 右：擬似モック */}
            <div className="relative">
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {/* スマホ風カード1: QR */}
                <div className="rounded-2xl border border-border bg-white p-3 shadow-sm space-y-2 aspect-[9/16] flex flex-col">
                  <p className="text-[10px] text-muted-foreground text-center">
                    店頭の QR コード
                  </p>
                  <div className="flex-1 flex items-center justify-center bg-white">
                    <QRCodeSVG
                      value="https://voice.props-lab.com/signup"
                      size={64}
                      level="M"
                      marginSize={1}
                      bgColor="#ffffff"
                      fgColor="#1f2d40"
                      className="w-full h-auto max-w-[96px]"
                    />
                  </div>
                  <p className="text-[8px] text-center text-muted-foreground">
                    スマホで読み取る
                  </p>
                </div>

                {/* スマホ風カード2: フォーム */}
                <div className="rounded-2xl border border-border bg-white p-3 shadow-sm space-y-2 aspect-[9/16]">
                  <p className="text-[10px] text-center font-semibold text-brand">
                    お声をお聞かせください
                  </p>
                  <div className="flex justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={`text-lg ${n <= 4 ? "text-amber-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="rounded-md bg-muted h-12 p-1">
                    <p className="text-[8px] text-muted-foreground">
                      丁寧でした
                    </p>
                  </div>
                  <div className="rounded-md bg-accent/90 text-[8px] text-white py-1 text-center">
                    AIに整えてもらう
                  </div>
                </div>

                {/* スマホ風カード3: 整文結果 */}
                <div className="rounded-2xl border border-border bg-white p-3 shadow-sm space-y-2 aspect-[9/16]">
                  <p className="text-[10px] text-muted-foreground">整文結果</p>
                  <div className="rounded-md bg-muted/60 h-16 p-1.5">
                    <p className="text-[8px] leading-tight text-foreground">
                      スタッフの方の対応がとても丁寧で、安心して施術を受けられました...
                    </p>
                  </div>
                  <div className="rounded-md bg-accent/90 text-[8px] text-white py-1 text-center">
                    Google に投稿
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px]">★★★★★</span>
                  </div>
                </div>
              </div>

              {/* 下のメトリクスカード */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                  <p className="text-[10px] text-muted-foreground">
                    今月の口コミ数
                  </p>
                  <p className="text-2xl font-bold text-brand">+47</p>
                  <div className="mt-1 flex items-end gap-0.5 h-6">
                    {[3, 5, 4, 7, 6, 8, 9].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-brand/60 rounded-sm"
                        style={{ height: `${h * 8}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                  <p className="text-[10px] text-muted-foreground">
                    平均評価
                  </p>
                  <p className="text-2xl font-bold text-brand">4.7</p>
                  <p className="text-[10px] text-amber-400">★★★★★</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pain section */}
        <section id="features" className="px-4 sm:px-6 py-16 sm:py-20 bg-muted/40 border-y border-border">
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-2 mb-10">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Pain points
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand">
                こんなお悩み、ありませんか？
              </h2>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PAINS.map((pain) => (
                <li
                  key={pain.title}
                  className="rounded-lg bg-white border border-border p-5 space-y-2"
                >
                  <p className="text-3xl" aria-hidden>
                    {pain.icon}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground leading-snug">
                    {pain.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pain.description}
                  </p>
                </li>
              ))}
            </ul>

            <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
              Props Voice は、「言いづらさ・書きづらさ」を、QRとAIで解消する
              <strong className="text-foreground font-semibold">無料ツール</strong>
              です。
            </p>
          </div>
        </section>

        {/* Use Cases */}
        <section className="px-4 sm:px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
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
        <section
          id="how-it-works"
          className="px-4 sm:px-6 py-16 sm:py-20 bg-muted/40 border-y border-border"
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-2 mb-12">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                How it works
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand">
                使い方は4ステップ
              </h2>
            </div>

            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <li
                  key={step.num}
                  className="rounded-lg border border-border bg-white p-5 space-y-3"
                >
                  <p className="text-sm font-mono text-accent font-semibold">
                    {step.num}
                  </p>
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why Props Voice */}
        <section className="px-4 sm:px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-2 mb-12">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Why Props Voice
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand">
                Props Voice を選ぶ理由
              </h2>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {REASONS.map((reason) => (
                <li key={reason.num} className="space-y-2">
                  <p className="text-sm font-mono text-accent font-semibold">
                    {reason.num}
                  </p>
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {reason.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing — 3 columns */}
        <section
          id="pricing"
          className="px-4 sm:px-6 py-16 sm:py-20 bg-muted/40 border-y border-border"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-2 mb-10">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Pricing
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand">
                料金プラン
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {/* Free */}
              <div className="rounded-lg border-2 border-brand bg-white p-6 space-y-4 flex flex-col">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-brand uppercase tracking-wider">
                    Free
                  </p>
                  <h3 className="text-xl font-bold text-foreground">
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

                <ul className="space-y-2 text-sm text-foreground flex-1">
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
                    <span>QRコード自動生成（PNG ダウンロード可）</span>
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
                  className="block w-full rounded-md bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-foreground hover:bg-accent-soft transition-colors"
                >
                  今すぐ無料で始める
                </Link>
              </div>

              {/* Standard */}
              <div className="rounded-lg border border-border bg-white p-6 space-y-4 flex flex-col">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Standard
                  </p>
                  <h3 className="text-xl font-bold text-foreground">
                    スタンダードプラン
                  </h3>
                  <p className="text-3xl font-bold text-foreground">
                    ¥1,980
                    <span className="text-base font-normal text-muted-foreground">
                      {" "}/ 月
                    </span>
                  </p>
                </div>

                <ul className="space-y-2 text-sm text-foreground flex-1">
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
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-4 sm:px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="text-center space-y-2 mb-10">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                FAQ
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand">
                よくあるご質問
              </h2>
            </div>

            <ul className="space-y-3">
              {FAQS.map((faq) => (
                <li key={faq.q}>
                  <details className="group rounded-lg border border-border bg-white p-5 [&_summary]:list-none">
                    <summary className="flex cursor-pointer items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        Q. {faq.q}
                      </h3>
                      <span className="shrink-0 text-muted-foreground group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Final CTA — dark */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 bg-brand text-brand-foreground">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              今日のお客様の声を、明日の集客に。
            </h2>
            <p className="text-base text-white/80">
              登録は1分。QRコードはダウンロードしたその日から使えます。
            </p>
            <Link
              href="/signup"
              className="inline-block rounded-md bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground hover:bg-accent-soft transition-colors shadow-sm"
            >
              今すぐ無料で始める
            </Link>
            <p className="text-xs text-white/60">
              クレジットカード不要 / ずっと無料 / メールアドレスのみで開始
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-10 border-t border-border bg-muted/40">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="font-bold text-brand">Props Voice</p>
              <span className="text-xs text-muted-foreground">
                by{" "}
                <a
                  href="https://props-lab.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Props Lab
                </a>
              </span>
            </div>
            <nav className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground">
                利用規約
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                プライバシーポリシー
              </Link>
              <Link href="/login" className="hover:text-foreground">
                ログイン
              </Link>
              <a
                href="https://props-lab.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                Props Lab について
              </a>
            </nav>
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            © {new Date().getFullYear()} Props Lab
          </p>
        </div>
      </footer>
    </div>
  );
}
