"use client";

import { useState, useTransition } from "react";
import { polishDraft } from "@/lib/review/actions";

type Phase = "input" | "polished" | "done";

const MAX_INPUT = 200;

export function ReviewFlow({ slug }: { slug: string }) {
  const [phase, setPhase] = useState<Phase>("input");
  const [rating, setRating] = useState(0);
  const [rawInput, setRawInput] = useState("");
  const [polished, setPolished] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePolish = () => {
    setError(null);
    startTransition(async () => {
      const result = await polishDraft(slug, rating, rawInput);
      if (result.success) {
        setPolished(result.polished);
        setGoogleUrl(result.googleReviewUrl);
        setPhase("polished");
      } else {
        setError(result.error);
      }
    });
  };

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
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
        <p className="text-lg font-medium text-emerald-900">
          ありがとうございました！
        </p>
        <p className="text-sm text-emerald-800">
          整えた文章をクリップボードにコピーし、Google レビュー投稿ページを別タブで開きました。
        </p>
        <p className="text-xs text-emerald-700">
          投稿欄に貼り付け（Ctrl + V / 長押し → 貼り付け）してください。
        </p>
      </div>
    );
  }

  if (phase === "polished") {
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-white p-5 shadow-sm space-y-3">
          <p className="text-xs text-muted-foreground">
            整えた文章（必要なら編集できます）
          </p>
          <textarea
            value={polished}
            onChange={(event) => setPolished(event.target.value)}
            rows={7}
            className="w-full rounded-md border border-border px-3 py-2 text-base resize-y focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!polished.trim()}
          className="w-full rounded-md bg-brand px-4 py-3 text-base font-medium text-brand-foreground hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          コピーして Google に投稿
        </button>

        <button
          type="button"
          onClick={() => setPhase("input")}
          className="block w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          書き直す
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-white p-5 shadow-sm space-y-5">
        <div className="space-y-2">
          <p className="block text-sm font-medium text-foreground">評価</p>
          <div className="flex justify-center gap-1" role="radiogroup">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n}つ星`}
                onClick={() => setRating(n)}
                disabled={isPending}
                className={`text-5xl px-2 transition-colors disabled:opacity-50 ${
                  rating >= n ? "text-amber-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="raw_input"
            className="block text-sm font-medium text-foreground"
          >
            一言（{MAX_INPUT}文字以内）
          </label>
          <textarea
            id="raw_input"
            value={rawInput}
            onChange={(event) =>
              setRawInput(event.target.value.slice(0, MAX_INPUT))
            }
            disabled={isPending}
            rows={5}
            placeholder="気軽に書いてください。AIが自然な文章に整えます。"
            className="w-full rounded-md border border-border px-3 py-2 text-base resize-none focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
          />
          <p className="text-right text-xs text-muted-foreground">
            {rawInput.length} / {MAX_INPUT}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePolish}
        disabled={isPending || rating === 0 || !rawInput.trim()}
        className="w-full rounded-md bg-brand px-4 py-3 text-base font-medium text-brand-foreground hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "整えています..." : "AIに整えてもらう"}
      </button>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
        >
          {error}
        </div>
      )}
    </div>
  );
}
