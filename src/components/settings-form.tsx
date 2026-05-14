"use client";

import { useState, useTransition } from "react";
import { updateStore } from "@/lib/store/actions";

export function SettingsForm({
  initialName,
  initialGoogleReviewUrl,
}: {
  initialName: string;
  initialGoogleReviewUrl: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    | { type: "success"; message: string }
    | { type: "error"; message: string }
    | null
  >(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateStore(formData);
      if (result.success) {
        setFeedback({ type: "success", message: "保存しました" });
      } else {
        setFeedback({ type: "error", message: result.error });
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
          defaultValue={initialName}
          disabled={isPending}
          className="w-full rounded-md border border-border px-3 py-2.5 text-base focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
        />
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
          defaultValue={initialGoogleReviewUrl}
          disabled={isPending}
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
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand px-4 py-2.5 text-base font-medium text-brand-foreground transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "保存中..." : "保存する"}
      </button>

      {feedback && (
        <div
          role="status"
          className={`rounded-md border px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </form>
  );
}
