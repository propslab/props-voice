"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { updateStore } from "@/lib/store/actions";
import type { Plan, PolishStyle } from "@/lib/supabase/types";

const STYLE_OPTIONS: { value: PolishStyle; label: string; description: string }[] = [
  {
    value: "casual",
    label: "カジュアル",
    description: "親しみやすく自然な文体。飲食・美容・小売など幅広い業種向け。",
  },
  {
    value: "formal",
    label: "フォーマル",
    description: "丁寧で品のある文体。士業・宿泊・サロンなどの落ち着いた業種向け。",
  },
];

export function SettingsForm({
  initialName,
  initialGoogleReviewUrl,
  initialPolishStyle,
  plan,
}: {
  initialName: string;
  initialGoogleReviewUrl: string;
  initialPolishStyle: PolishStyle;
  plan: Plan;
}) {
  const [isPending, startTransition] = useTransition();
  const [polishStyle, setPolishStyle] = useState<PolishStyle>(initialPolishStyle);
  const [feedback, setFeedback] = useState<
    | { type: "success"; message: string }
    | { type: "error"; message: string }
    | null
  >(null);

  const isStandard = plan === "standard";

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

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="block text-sm font-medium text-foreground">
            整文スタイル
          </span>
          {!isStandard && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              <svg
                className="h-2.5 w-2.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Standard 限定
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          整文時の文体を選びます。お客様には表示されません。
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {STYLE_OPTIONS.map((option) => {
            const checked = polishStyle === option.value;
            const disabled = !isStandard || isPending;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer flex-col gap-1 rounded-md border p-3 transition-colors ${
                  checked
                    ? "border-brand bg-brand/5"
                    : "border-border bg-white hover:bg-muted/50"
                } ${disabled && !checked ? "opacity-60" : ""} ${
                  !isStandard ? "cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="polish_style"
                    value={option.value}
                    checked={checked}
                    onChange={() => setPolishStyle(option.value)}
                    disabled={disabled}
                    className="h-4 w-4 accent-brand"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                </div>
                <p className="pl-6 text-xs text-muted-foreground">
                  {option.description}
                </p>
              </label>
            );
          })}
        </div>
        {!isStandard && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Free プランでは「カジュアル」固定です。
            <Link
              href="/dashboard"
              className="ml-1 font-semibold underline hover:text-amber-700"
            >
              Standard にアップグレード
            </Link>
            すると文体を切り替えられます。
          </div>
        )}
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
