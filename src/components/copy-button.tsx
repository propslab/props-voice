"use client";

import { useState, useTransition } from "react";

export function CopyButton({
  value,
  label = "コピー",
  copiedLabel = "コピーしました",
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // クリップボード API 不可（古いブラウザ・iframe など）
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className="whitespace-nowrap rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
