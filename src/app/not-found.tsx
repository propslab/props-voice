import Link from "next/link";

export const metadata = {
  title: "ページが見つかりません｜Props Voice",
};

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center space-y-6">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-bold text-brand">ページが見つかりません</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          お探しのページは移動・削除された可能性があります。
          <br />
          URL に誤りがないかご確認ください。
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-brand px-6 py-3 text-sm font-medium text-brand-foreground hover:bg-brand-soft transition-colors"
        >
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}
