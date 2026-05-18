import Link from "next/link";

export const metadata = {
  title: "利用規約｜Props Voice",
};

export default function TermsPage() {
  return (
    <main className="flex-1 px-6 py-12 sm:py-16">
      <article className="mx-auto max-w-2xl space-y-8 text-foreground">
        <header className="space-y-2">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Props Voice
          </p>
          <h1 className="text-3xl font-bold text-brand">利用規約</h1>
          <p className="text-sm text-muted-foreground">
            最終更新日：2026年5月18日
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            第1条 (サービス内容)
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Props Voice（以下「本サービス」）は、織田 隼舞（屋号：Props Lab、以下「運営者」）が提供する、
            来店客の口コミ収集・AI整文補助サービスです。店舗オーナーは本サービスを通じて、
            お客様から寄せられた感想を Google レビュー投稿用の自然な文章に整え、投稿を促進することができます。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            第2条 (利用登録)
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            メールアドレスを登録することで利用を開始できます。
            運営者は、利用希望者が以下に該当する場合、登録を拒否することがあります。
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>虚偽の情報を登録した場合</li>
            <li>過去に利用規約違反により利用停止となっている場合</li>
            <li>その他、運営者が登録を不適切と判断した場合</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            第3条 (料金プラン)
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            本サービスは以下のプランで提供されます。
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>
              <strong className="text-foreground">フリープラン</strong>：
              ¥0／月。AI 整文は月 3 名まで。基本機能を永続無料でご利用いただけます。
            </li>
            <li>
              <strong className="text-foreground">スタンダードプラン</strong>：
              ¥1,980／月（税込）。AI 整文は月 20 名まで。整文スタイル選択、下書き再編集、低評価アラート、CSV
              書き出し等の拡張機能をご利用いただけます。
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-muted-foreground">
            料金体系および機能の詳細は
            <Link
              href="/"
              className="underline hover:text-foreground mx-1"
            >
              トップページ
            </Link>
            の料金プランをご確認ください。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            第4条 (支払い・自動更新)
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>
              スタンダードプランの料金は、Stripe Inc. が提供する決済代行サービスを通じてクレジットカードで請求されます。
            </li>
            <li>初回決済日を基準に、毎月同日に自動継続課金されます。</li>
            <li>
              利用者は、ダッシュボードの「請求・解約管理」より、Stripe の請求ポータルにアクセスし、いつでも自動更新の停止（解約）を申し込むことができます。
            </li>
            <li>
              支払いが正常に完了しなかった場合、運営者は予告なくスタンダードプラン機能の提供を停止し、自動的にフリープランに移行させる場合があります。
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            第5条 (解約・プラン変更)
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>
              利用者はいつでも本サービスの利用を停止し、アカウントを削除できます。
            </li>
            <li>
              スタンダードプランをご利用中の利用者が解約された場合、次回更新日まではスタンダードプラン機能を引き続きご利用いただけます。
              次回更新日以降、自動的にフリープランへ移行します。
            </li>
            <li>
              月の途中で解約された場合でも、当該月の利用料金の日割り返金は行いません。
            </li>
            <li>
              本サービスはデジタルコンテンツに該当するため、原則として返金には応じかねます。
              ただし、運営者の責に帰すべき事由によりサービスが提供できない期間が発生した場合、個別にご連絡のうえ対応いたします。
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            第6条 (禁止事項)
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>虚偽の口コミを生成・投稿すること</li>
            <li>他人になりすまして口コミを投稿すること</li>
            <li>金銭的対価を提示して口コミを誘導すること</li>
            <li>Google のレビューポリシー、その他関係法令に違反する行為</li>
            <li>本サービスのシステムに過度な負荷をかける行為</li>
            <li>他の利用者または第三者の権利を侵害する行為</li>
            <li>本サービスを複製、模倣、改変、リバースエンジニアリングすること</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            第7条 (免責事項)
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>
              本サービスは Google レビューへの投稿を補助するものであり、Google
              アカウントの停止、レビューの削除、店舗評価の変動等について、運営者は一切の責任を負いません。
            </li>
            <li>
              AI による整文結果は完全性・正確性を保証するものではありません。投稿前に内容をご確認ください。
            </li>
            <li>
              本サービスの提供を予告なく中断・変更・終了する場合があります。
            </li>
            <li>
              本サービスの利用に関連して利用者または第三者に生じた損害について、運営者は故意または重過失による場合を除き、責任を負いません。
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            第8条 (アカウント削除後のデータ取扱い)
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            利用者がアカウント削除を申し込んだ場合、保有しているすべての登録情報（店舗情報・下書き・利用履歴）は、
            解約・削除手続き完了後 30 日間保持されたうえで、自動的に削除されます。
            この期間内に再加入された場合、データの復元が可能です。30 日経過後の復元はできません。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            第9条 (利用規約の変更)
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            運営者は、必要と判断した場合に本規約を変更することがあります。
            変更後の規約は本ページに掲載した時点で効力を生じるものとします。
            重要な変更がある場合は、利用者の登録メールアドレス宛に事前に通知する場合があります。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            第10条 (準拠法・裁判管轄)
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            本規約の解釈および本サービスの利用に関する紛争については日本法を準拠法とし、運営者の所在地を管轄する地方裁判所を第一審の専属的合意管轄裁判所とします。
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
                href="/commerce-act"
                className="underline hover:text-foreground mx-1"
              >
                特定商取引法に基づく表示
              </Link>
              ／
              <Link
                href="/privacy"
                className="underline hover:text-foreground mx-1"
              >
                プライバシーポリシー
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
