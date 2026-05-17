"use client";

import { useState, useTransition } from "react";
import { createStore } from "@/lib/store/actions";

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await createStore(formData);
      if (!result.success) {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-foreground"
        >
          店舗名
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          disabled={isPending}
          placeholder="例：あなたのお店の名前"
          className="w-full rounded-md border border-border px-3 py-2.5 text-base focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
        />
        <p className="text-xs text-muted-foreground">
          QRコードを置く看板や受付に表示される名称です。
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="google_review_url"
          className="block text-sm font-medium text-foreground"
        >
          Google レビューURL
        </label>
        <input
          id="google_review_url"
          name="google_review_url"
          type="url"
          required
          disabled={isPending}
          placeholder="https://g.page/r/.../review"
          inputMode="url"
          className="w-full rounded-md border border-border px-3 py-2.5 text-base focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
        />
        <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">取得方法</p>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Google マップで自店舗を開く</li>
            <li>「クチコミを書く」ボタンを長押し → リンクをコピー</li>
            <li>または「共有」→ レビュー投稿用リンクをコピー</li>
          </ol>
          <p className="pt-1">
            正しい形式の例:{" "}
            <code className="text-[10px]">
              https://g.page/r/.../review
            </code>{" "}
            または{" "}
            <code className="text-[10px]">
              https://search.google.com/local/writereview?placeid=...
            </code>
          </p>
          <p className="pt-1 text-[10px]">
            ※ あとから設定画面で変更できます
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand px-4 py-2.5 text-base font-medium text-brand-foreground transition-colors hover:bg-brand-soft focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "登録中..." : "QRコードを発行する"}
      </button>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
        >
          {error}
        </div>
      )}
    </form>
  );
}
