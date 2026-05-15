import Link from "next/link";

export const metadata = {
  title: "店舗が見つかりません｜Props Voice",
};

export default function StoreNotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16 bg-muted/40">
      <div className="max-w-md text-center space-y-6">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
          店舗が見つかりません
        </p>
        <h1 className="text-2xl font-bold text-brand">
          この QR コードは現在ご利用いただけません
        </h1>
        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p>
            店舗のサービス終了、または URL の入力ミスの可能性があります。
          </p>
          <p>お手数ですが、店舗スタッフへお声がけください。</p>
        </div>
        <Link
          href="/"
          className="inline-block rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-foreground/40 transition-colors"
        >
          Props Voice について
        </Link>
      </div>
    </main>
  );
}
