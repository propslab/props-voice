"use client";

import { useState, useTransition } from "react";
import { polishDraft } from "@/lib/review/actions";

type Phase = "input" | "polished" | "done";

const MAX_INPUT = 200;

const RATING_LABELS: Record<number, string> = {
  1: "不満",
  2: "やや不満",
  3: "ふつう",
  4: "良い",
  5: "とても良い",
};

export function ReviewFlow({ slug }: { slug: string }) {
  const [phase, setPhase] = useState<Phase>("input");
  const [rating, setRating] = useState(0);
  const [rawInput, setRawInput] = useState("");
  const [rawSnapshot, setRawSnapshot] = useState("");
  const [polished, setPolished] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [retryUsed, setRetryUsed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const runPolish = (isRetry: boolean) => {
    setError(null);
    const snapshot = rawInput;
    startTransition(async () => {
      const result = await polishDraft(slug, rating, rawInput);
      if (result.success) {
        setRawSnapshot(snapshot);
        setPolished(result.polished);
        setGoogleUrl(result.googleReviewUrl);
        setPhase("polished");
      } else {
        setError(result.error);
        if (isRetry) setRetryUsed(true);
      }
    });
  };

  const handlePolish = () => runPolish(false);
  const handleRetry = () => runPolish(true);

  const handleSubmit = async () => {
    try {
      await navigator.clipboard.writeText(polished);
    } catch {
      // clipboard 失敗時も Google を開く（手動コピーしてもらう）
    }
    window.open(googleUrl, "_blank", "noopener,noreferrer");
    setPhase("done");
  };

  if (phase === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center space-y-4 shadow-lg shadow-emerald-100/40">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
          <svg
            className="h-8 w-8 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <p className="text-lg font-bold text-foreground">
            ありがとうございました
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            整えた文章をコピーし、
            <br />
            Google レビューを別タブで開きました。
          </p>
        </div>
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
          <svg
            className="h-3.5 w-3.5 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <p className="text-xs text-muted-foreground">
            投稿欄に貼り付けてください
          </p>
        </div>
      </div>
    );
  }

  if (phase === "polished") {
    return (
      <div className="space-y-5">
        {/* Before（原文） */}
        <div className="rounded-2xl border border-border bg-white/95 backdrop-blur p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-[11px] tracking-wider uppercase text-muted-foreground font-medium">
              <span className="block h-1 w-3 bg-muted-foreground/40 rounded-full" />
              Original
            </p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-wrap">
            {rawSnapshot}
          </p>
        </div>

        {/* 変身の矢印 */}
        <div className="flex items-center justify-center -my-2">
          <div className="flex flex-col items-center gap-1">
            <svg
              className="h-6 w-6 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
            <p className="text-[10px] tracking-wider uppercase text-accent font-semibold">
              AI Polished
            </p>
          </div>
        </div>

        {/* After（整文） */}
        <div className="rounded-2xl border-2 border-brand bg-white p-5 space-y-3 shadow-lg shadow-brand/10">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-[11px] tracking-wider uppercase text-brand font-semibold">
              <span className="block h-1.5 w-1.5 rounded-full bg-accent" />
              Polished
            </p>
            <p className="text-[10px] text-muted-foreground">
              編集できます
            </p>
          </div>
          <textarea
            value={polished}
            onChange={(event) => setPolished(event.target.value)}
            rows={7}
            className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-[15px] leading-relaxed resize-y focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!polished.trim()}
          className="group relative w-full overflow-hidden rounded-xl bg-brand px-4 py-4 text-base font-semibold text-brand-foreground hover:bg-brand-soft active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:opacity-50 min-h-[56px] shadow-md shadow-brand/20"
        >
          <span className="relative inline-flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            コピーして Google に投稿
          </span>
        </button>

        <p className="text-center text-xs text-muted-foreground">
          気になる部分は直接修正できます
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-7 space-y-6 shadow-xl shadow-brand/5">
        {/* 評価 */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-foreground">
              あなたの体験は？
            </p>
            <p className="text-[11px] text-muted-foreground">
              タップで選択
            </p>
          </div>
          <div
            className="flex items-center justify-between gap-1 px-1"
            role="radiogroup"
          >
            {[1, 2, 3, 4, 5].map((n) => {
              const active = rating >= n;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n}つ星`}
                  onClick={() => setRating(n)}
                  disabled={isPending}
                  className={`group relative flex h-14 w-14 items-center justify-center text-[2.75rem] leading-none transition-all duration-150 active:scale-90 disabled:opacity-50 ${
                    active
                      ? "text-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.4)]"
                      : "text-gray-200 hover:text-amber-200"
                  }`}
                >
                  ★
                </button>
              );
            })}
          </div>
          <div className="h-5 text-center">
            {rating > 0 && (
              <p className="inline-block rounded-full bg-amber-50 px-3 py-0.5 text-xs font-medium text-amber-700">
                {RATING_LABELS[rating]}
              </p>
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* 一言 */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="raw_input"
              className="text-sm font-semibold text-foreground"
            >
              一言メッセージ
            </label>
            <p className="text-[11px] text-muted-foreground tabular-nums">
              {rawInput.length} / {MAX_INPUT}
            </p>
          </div>
          <textarea
            id="raw_input"
            value={rawInput}
            onChange={(event) =>
              setRawInput(event.target.value.slice(0, MAX_INPUT))
            }
            disabled={isPending}
            rows={5}
            placeholder="「丁寧でした」「席が広い」など、思ったことを一言で大丈夫です。"
            className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-[15px] leading-relaxed resize-none focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-colors disabled:opacity-50"
          />
          <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <span className="block h-1 w-1 rounded-full bg-accent" />
            AIが自然な口コミ文に整えます。内容は変えません。
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePolish}
        disabled={isPending || rating === 0 || !rawInput.trim()}
        className="group relative w-full overflow-hidden rounded-xl bg-accent px-4 py-4 text-base font-semibold text-accent-foreground hover:bg-accent-soft active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:opacity-40 min-h-[56px] shadow-lg shadow-accent/30"
      >
        <span className="relative inline-flex items-center justify-center gap-2">
          {isPending ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              整えています...
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
              </svg>
              AIに整えてもらう
            </>
          )}
        </span>
      </button>

      {error && (
        <div className="space-y-2">
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 flex items-start gap-2"
          >
            <svg
              className="h-4 w-4 mt-0.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </div>
          {!retryUsed && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={isPending || rating === 0 || !rawInput.trim()}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-foreground hover:bg-muted active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "整えています..." : "もう一度整える"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
