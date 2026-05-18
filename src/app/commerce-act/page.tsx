import Link from "next/link";

export const metadata = {
  title: "特定商取引法に基づく表示｜Props Voice",
};

export default function CommerceActPage() {
  return (
    <main className="flex-1 px-6 py-12 sm:py-16">
      <article className="mx-auto max-w-2xl space-y-8 text-foreground">
        <header className="space-y-2">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Props Voice
          </p>
          <h1 className="text-3xl font-bold text-brand">
            特定商取引法に基づく表示
          </h1>
          <p className="text-sm text-muted-foreground">
            最終更新日：2026年5月18日
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            販売事業者
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            織田 隼舞（屋号：Props Lab）
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">所在地</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            ご請求いただいた場合、遅滞なく開示いたします。下記の連絡先までご請求ください。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">連絡先</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>電話番号：070-3611-0969</li>
            <li>
              メールアドレス：
              <a
                href="mailto:hayama@props-lab.com"
                className="underline hover:text-foreground"
              >
                hayama@props-lab.com
              </a>
            </li>
            <li>受付時間：平日10:00〜18:00（土日祝・年末年始を除く）</li>
            <li>
              連絡方法はメールを推奨。お電話の場合、不在時は折り返しのご対応となります。
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            販売価格
          </h2>
          <ul className="text-sm text-muted-foreground space-y-1 pl-2 list-disc list-inside">
            <li>フリープラン：¥0／月（永続無料）</li>
            <li>
              スタンダードプラン：¥1,980／月（税込）
              <span className="block pl-4 text-xs">
                ※ 上記には消費税が含まれています。
              </span>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            商品代金以外の必要料金
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            インターネット接続に必要な通信料はお客様のご負担となります。
            その他の手数料・登録料は発生しません。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            支払い方法
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            クレジットカード（VISA / MasterCard / JCB / American Express / Diners
            等）による決済に対応しています。決済処理は Stripe Inc. が提供する
            Stripe Checkout を介して行われ、当社はカード情報を一切取得・保管いたしません。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            支払い時期
          </h2>
          <ul className="text-sm text-muted-foreground space-y-1 pl-2 list-disc list-inside">
            <li>
              初回：Stripe Checkout でお申し込み完了時に即時決済（クレジットカードに即時請求）
            </li>
            <li>2 回目以降：毎月、初回決済日と同日に自動継続課金</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            サービス提供時期
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            決済完了後、即時にスタンダードプラン機能をご利用いただけます。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            解約・キャンセル
          </h2>
          <ul className="text-sm text-muted-foreground space-y-1 pl-2 list-disc list-inside">
            <li>
              ダッシュボードの「請求・解約管理」より、Stripe
              の請求ポータルを経由していつでも解約のお申し込みが可能です。
            </li>
            <li>
              解約お申し込み後、次回更新日までは引き続きスタンダードプラン機能をご利用いただけます。
              次回更新日以降、自動的にフリープランへ移行します。
            </li>
            <li>
              月の途中で解約された場合でも、当該月の利用料金の日割り返金は行いません。
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            返品・返金
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            本サービスはデジタルコンテンツに該当するため、原則として返金には応じかねます。
            ただし、当社の責に帰すべき事由によりサービスが提供できない期間が発生した場合や、
            当社が認める不可抗力等が発生した場合は、個別にご連絡のうえ対応いたします。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            動作環境
          </h2>
          <ul className="text-sm text-muted-foreground space-y-1 pl-2 list-disc list-inside">
            <li>
              モダンブラウザ（最新版の Google Chrome / Safari / Firefox / Microsoft Edge）
            </li>
            <li>インターネット接続環境</li>
            <li>
              来店客向け QR コード読み取り画面はスマートフォン（iOS Safari / Android Chrome 最新版）に最適化
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            個人情報の取扱い
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            お客様の個人情報の取扱いについては
            <Link
              href="/privacy"
              className="underline hover:text-foreground mx-1"
            >
              プライバシーポリシー
            </Link>
            をご確認ください。
          </p>
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
