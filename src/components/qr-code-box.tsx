"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export function QrCodeBox({
  url,
  storeName,
}: {
  url: string;
  storeName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const safeName = storeName.replace(/[^\w\d぀-ヿ一-鿿-]/g, "_");
    link.download = `props-voice-${safeName || "qr"}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="flex justify-center bg-white p-5 rounded-md border border-border"
      >
        <QRCodeCanvas
          value={url}
          size={220}
          level="M"
          marginSize={2}
        />
      </div>
      <button
        type="button"
        onClick={handleDownload}
        className="w-full rounded-md border border-border px-3 py-2 text-sm text-foreground hover:border-foreground/40"
      >
        QRコード（PNG）をダウンロード
      </button>
      <p className="text-xs text-muted-foreground">
        印刷推奨サイズ: A6（10.5 × 14.8 cm）または A5。受付・テーブル POP に貼ってご利用ください。
      </p>
    </div>
  );
}
