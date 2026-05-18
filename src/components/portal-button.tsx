"use client";

import { useState } from "react";

export function PortalButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePortal = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setError(data.error ?? "請求管理画面を開けませんでした");
        setIsLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("[portal] fetch error:", err);
      setError("通信エラーが発生しました。しばらくしてからお試しください。");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handlePortal}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3.5 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted hover:border-foreground/30 transition-colors disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin text-muted-foreground"
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
            処理中...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            請求・解約管理
          </>
        )}
      </button>
      {error && (
        <p
          role="alert"
          className="text-xs text-rose-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}
