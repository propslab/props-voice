import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-xl text-center space-y-8">
        <div className="space-y-4">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Props Lab
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-brand leading-tight">
            Props Voice
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            QRを置くだけで、来店客の声が
            <br className="hidden sm:inline" />
            Google レビューとして積み上がる、
            <br className="hidden sm:inline" />
            無料の口コミ収集ツール。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="w-full sm:w-auto rounded-md bg-brand px-6 py-3 text-sm font-medium text-brand-foreground hover:bg-brand-soft"
          >
            今すぐ無料で始める
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-foreground/40"
          >
            ログイン
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          現在準備中。Day 5 で本ランディングを公開予定。
        </p>
      </div>
    </main>
  );
}
