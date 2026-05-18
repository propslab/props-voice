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
          <h1 className="text-3xl font-bold text-brand">
            プライバシーポリシー
          </h1>
          <p className="text-sm text-muted-foreground">
            最終更新日：2026年5月18日
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            取得する個人情報
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Props Voice（以下「本サービス」）では、以下の情報を取得します。
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>店舗オーナーのメールアドレス（認証目的）</li>
            <li>登録された店舗名</li>
            <li>登録された Google レビュー URL</li>
            <li>客が QR コード経由で入力したコメント文と評価（★1-5）</li>
            <li>AI 整文後のテキスト</li>
            <li>利用状況（整文回数、月次集計）</li>
            <li>
              スタンダードプラン契約者：Stripe 顧客 ID、Stripe サブスクリプション ID（カード番号自体は取得しません）
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            利用目的
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>本サービスの提供（口コミ整文・QR コード発行・管理画面表示）</li>
            <li>料金プランの管理および決済の実施</li>
            <li>利用規約に違反する行為への対応</li>
            <li>本サービスの改善・統計分析</li>
            <li>利用者への重要なお知らせ（規約改定・サービス変更等）</li>
            <li>低評価通知メールの送信（スタンダードプラン）</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            決済情報の取扱い
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            スタンダードプランのお支払いに必要なクレジットカード番号、有効期限、CVC
            等の情報は、Stripe Inc. が運営する Stripe Checkout が直接受け取り、Stripe の
            PCI DSS Level 1 準拠インフラ上で処理・保管されます。
            本サービスは Stripe のサーバーから返却される顧客 ID とサブスクリプション
            ID のみを保管し、クレジットカード情報そのものは一切保管・参照いたしません。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            第三者提供（業務委託）
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            本サービスは、機能提供のために以下の外部サービスを利用しています。
            これらのサービスへの情報送信は、本サービスの提供に必要な範囲に限定されます。
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground pl-2">
            <li>
              <strong className="text-foreground">Stripe Inc.</strong>：
              クレジットカード決済処理。決済情報（カード番号・有効期限・CVC・請求先住所等）を Stripe
              に直接送信し、本サービスは Stripe が発行する顧客 ID・サブスクリプション ID のみ取得します。
            </li>
            <li>
              <strong className="text-foreground">Anthropic, PBC（Claude API）</strong>：
              AI 整文のため、客の入力テキストと評価情報を送信します。
            </li>
            <li>
              <strong className="text-foreground">Supabase Inc.</strong>：
              データベースおよび認証基盤としてホスティングしています。
            </li>
            <li>
              <strong className="text-foreground">Vercel Inc.</strong>：
              アプリケーションのホスティングを行っています。
            </li>
            <li>
              <strong className="text-foreground">Resend Inc.</strong>：
              認証用 OTP メールおよび低評価アラートメールの送信に利用しています。
            </li>
            <li>
              <strong className="text-foreground">Cloudflare Inc.</strong>：
              ドメインの DNS 管理に利用しています。
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-muted-foreground">
            上記以外への第三者提供は、法令に基づく場合を除き、原則として行いません。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            データの保管・削除
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>
              アカウントが有効な期間中は、登録情報・口コミ履歴・利用統計を保持します。
            </li>
            <li>
              アカウント削除をお申し込みいただいた場合、保有しているすべての登録情報を 30 日間保持後、自動的に削除します。
              この期間内に再加入された場合、データの復元が可能です。
            </li>
            <li>
              Stripe 上の顧客情報・決済履歴は Stripe のポリシーに基づき、当社の管理外で保管・削除されます。
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            削除・開示請求
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            ご自身の個人情報の開示・訂正・削除をご希望の場合は、登録メールアドレスから運営者（hayama@props-lab.com）までご連絡ください。
            アカウント削除をご希望の場合は設定画面からも実行できます。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Cookie の利用
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            本サービスは認証セッションの維持のために Cookie を使用します。
            ブラウザの設定で Cookie を無効化することは可能ですが、その場合本サービスをご利用いただけません。
            Stripe Checkout 利用時には Stripe が独自の Cookie を設定する場合があります。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            運営者情報
          </h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>運営者：織田 隼舞（屋号：Props Lab）</li>
            <li>連絡先：070-3611-0969 ／ hayama@props-lab.com</li>
            <li>
              関連リンク：
              <Link
                href="/terms"
                className="underline hover:text-foreground mx-1"
              >
                利用規約
              </Link>
              ／
              <Link
                href="/commerce-act"
                className="underline hover:text-foreground mx-1"
              >
                特定商取引法に基づく表示
              </Link>
            </li>
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
