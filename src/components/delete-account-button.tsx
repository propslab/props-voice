"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/lib/auth/actions";

const CONFIRM_TEXT = "削除";

export function DeleteAccountButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteAccount();
      // 成功時は redirect が走るので、ここに来た場合は失敗のみ
      if (result && !result.success) {
        setError(result.error);
      }
    });
  };

  if (!showConfirm) {
    return (
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="rounded-md border border-rose-200 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 transition-colors"
      >
        アカウントを削除する
      </button>
    );
  }

  return (
    <div className="space-y-4 rounded-md border border-rose-200 bg-rose-50/50 p-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-rose-900">
          本当にアカウントを削除しますか？
        </p>
        <ul className="text-xs text-rose-800 list-disc list-inside space-y-1">
          <li>店舗情報・QRコード・公開URL がすべて無効になります</li>
          <li>整文した口コミの履歴がすべて削除されます</li>
          <li>この操作は取り消せません</li>
        </ul>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirm"
          className="block text-xs font-medium text-rose-900"
        >
          確認のため「{CONFIRM_TEXT}」と入力してください
        </label>
        <input
          id="confirm"
          type="text"
          value={confirmInput}
          onChange={(event) => setConfirmInput(event.target.value)}
          disabled={isPending}
          className="w-full rounded-md border border-rose-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:opacity-50"
          autoComplete="off"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending || confirmInput !== CONFIRM_TEXT}
          className="flex-1 rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "削除中..." : "完全に削除する"}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowConfirm(false);
            setConfirmInput("");
            setError(null);
          }}
          disabled={isPending}
          className="rounded-md border border-border bg-white px-4 py-2 text-sm text-foreground hover:border-foreground/40 disabled:opacity-50"
        >
          キャンセル
        </button>
      </div>

      {error && (
        <p role="alert" className="text-xs text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}
