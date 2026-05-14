import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー｜Props Voice",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 px-6 py-12 sm:py-16">
      <article className="mx-auto max-w-2xl space-y-8 text-foreground">
        <header className="space-y-2">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Props Voice
          </p>
          <h1 className="text-3xl font-bold text-brand">プライバシーポリシー</h1>
          <p className="text-sm text-muted-foreground">
            最終更新日：2026年5月14日
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">取得する個人情報</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Props Voice（以下「本サービス」）では、以下の情報を取得します。
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>店舗オーナーのメールアドレス（認証目的）</li>
            <li>登録された店舗名</li>
            <li>登録された Google レビューURL</li>
            <li>客が QR コード経由で入力したコメント文と評価（★1-5）</li>
            <li>AI 整文後のテキスト</li>
            <li>利用状況（整文回数、月次集計）</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">利用目的</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>本サービスの提供（口コミ整文・QR コード発行・管理画面表示）</li>
            <li>利用規約に違反する行為への対応</li>
            <li>本サービスの改善・統計分析</li>
            <li>利用者への重要なお知らせ（規約改定・サービス変更等）</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">第三者提供</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            本サービスは、機能提供のために以下の外部サービスを利用しています。
            これらのサービスへの情報送信は、本サービスの提供に必要な範囲に限定されます。
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>
              <strong className="text-foreground">Anthropic（Claude API）</strong>:
              AI整文のため、客の入力テキストと評価情報を送信します。
            </li>
            <li>
              <strong className="text-foreground">Supabase</strong>:
              データベースおよび認証基盤としてホスティングしています。
            </li>
            <li>
              <strong className="text-foreground">Vercel</strong>:
              アプリケーションのホスティングを行っています。
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-muted-foreground">
            上記以外への第三者提供は、法令に基づく場合を除き、原則として行いません。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">削除・開示請求</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            ご自身の個人情報の開示・訂正・削除をご希望の場合は、登録メールアドレスから運営者までご連絡ください。
            アカウント削除をご希望の場合、保有しているすべての登録情報（店舗情報・下書き・利用履歴）を削除いたします。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Cookie の利用</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            本サービスは認証セッションの維持のために Cookie を使用します。
            ブラウザの設定で Cookie を無効化することは可能ですが、その場合本サービスをご利用いただけません。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">運営者情報</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>運営者: はやま（Props Lab）</li>
            <li>
              Props Lab:{" "}
              <a
                href="https://props-lab.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                props-lab.com
              </a>
            </li>
          </ul>
        </section>

        <p className="pt-8 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← トップに戻る
          </Link>
        </p>
      </article>
    </main>
  );
}
