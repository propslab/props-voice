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
            最終更新日：2026年5月14日
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">第1条 (サービス内容)</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Props Voice（以下「本サービス」）は、Props Lab（以下「運営者」）が提供する、
            来店客の口コミ収集・AI整文補助サービスです。店舗オーナーは本サービスを通じて、
            お客様から寄せられた感想を Google レビュー投稿用の自然な文章に整え、
            投稿を促進することができます。本サービスは無料でご利用いただけます。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">第2条 (利用登録)</h2>
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
          <h2 className="text-lg font-semibold text-foreground">第3条 (禁止事項)</h2>
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
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">第4条 (免責事項)</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>
              本サービスは Google レビューへの投稿を補助するものであり、Google
              アカウントの停止、レビューの削除、店舗評価の変動等について、運営者は一切の責任を負いません。
            </li>
            <li>
              AI による整文結果は完全性・正確性を保証するものではありません。
              投稿前に内容をご確認ください。
            </li>
            <li>
              本サービスの提供を予告なく中断・変更・終了する場合があります。
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">第5条 (解約)</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            利用者はいつでも本サービスの利用を停止し、アカウントを削除できます。
            アカウント削除をご希望の場合は、設定画面または下記の連絡先までご連絡ください。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">第6条 (利用規約の変更)</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            運営者は、必要と判断した場合に本規約を変更することがあります。
            変更後の規約は本ページに掲載した時点で効力を生じるものとします。
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
