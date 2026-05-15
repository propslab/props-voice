"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Props Voice] runtime error:", error);
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center space-y-6">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
          エラー
        </p>
        <h1 className="text-2xl font-bold text-brand">
          一時的なエラーが発生しました
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          お手数ですが、もう一度お試しください。
          <br />
          問題が続く場合は、しばらく時間をおいてからアクセスしてください。
        </p>
        {error.digest && (
          <p className="text-[10px] text-muted-foreground font-mono">
            error id: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-brand px-6 py-3 text-sm font-medium text-brand-foreground hover:bg-brand-soft transition-colors"
          >
            もう一度試す
          </button>
          <Link
            href="/"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-foreground/40 transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
