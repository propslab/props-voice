"use client";

import { useEffect, useState, useTransition } from "react";
import { updateDraft } from "@/lib/review/actions";

const MAX_LEN = 1000;

export type DraftItem = {
  id: string;
  rating: number;
  raw_input: string;
  polished_text: string | null;
  edited_polished_text: string | null;
  edited_at: string | null;
  createdAtLabel: string;
};

export function DraftList({
  drafts,
  isStandard,
}: {
  drafts: DraftItem[];
  isStandard: boolean;
}) {
  const [items, setItems] = useState(drafts);

  // 親（dashboard）が revalidatePath 後に新しい drafts を渡してきたら同期する。
  // 楽観更新と DB を反映した sever 再レンダ後の値、両方の整合が取れる。
  useEffect(() => {
    setItems(drafts);
  }, [drafts]);

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        まだ口コミが投稿されていません。
      </p>
    );
  }

  const applyEdit = (id: string, editedText: string, editedAt: string) => {
    setItems((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, edited_polished_text: editedText, edited_at: editedAt }
          : d
      )
    );
  };

  return (
    <ul className="divide-y divide-border">
      {items.map((draft) => (
        <DraftRow
          key={draft.id}
          draft={draft}
          isStandard={isStandard}
          onSaved={(text, at) => applyEdit(draft.id, text, at)}
        />
      ))}
    </ul>
  );
}

function DraftRow({
  draft,
  isStandard,
  onSaved,
}: {
  draft: DraftItem;
  isStandard: boolean;
  onSaved: (editedText: string, editedAt: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const displayed = draft.edited_polished_text ?? draft.polished_text ?? "";
  const [text, setText] = useState(displayed);

  const startEdit = () => {
    setText(displayed);
    setError(null);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const save = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("本文を入力してください");
      return;
    }
    if (trimmed.length > MAX_LEN) {
      setError(`${MAX_LEN}文字以内で入力してください`);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updateDraft(draft.id, trimmed);
      if (result.success) {
        onSaved(result.editedText, result.editedAt);
        setIsEditing(false);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <li className="py-4 first:pt-0 last:pb-0 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-amber-400" aria-label={`${draft.rating}つ星`}>
          {"★".repeat(draft.rating)}
          <span className="text-gray-300">
            {"★".repeat(5 - draft.rating)}
          </span>
        </p>
        <div className="flex items-center gap-2">
          {draft.edited_at && !isEditing && (
            <span className="text-[10px] text-muted-foreground">
              編集済
            </span>
          )}
          <time className="text-xs text-muted-foreground tabular-nums">
            {draft.createdAtLabel}
          </time>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_LEN}
            rows={5}
            disabled={isPending}
            className="w-full rounded-md border border-border px-3 py-2 text-sm leading-relaxed focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
          />
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground tabular-nums">
              {text.length} / {MAX_LEN}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                disabled={isPending}
                className="rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={save}
                disabled={isPending}
                className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground hover:bg-brand-soft disabled:opacity-50"
              >
                {isPending ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
          {error && (
            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-800">
              {error}
            </p>
          )}
        </div>
      ) : (
        <>
          {displayed && (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {displayed}
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                お客様の原文を見る
              </summary>
              <p className="mt-2 pl-3 border-l-2 border-border whitespace-pre-wrap">
                {draft.raw_input}
              </p>
              {draft.edited_polished_text && draft.polished_text && (
                <div className="mt-2 pl-3 border-l-2 border-border">
                  <p className="text-[10px] font-medium text-muted-foreground">
                    元の整文結果
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">
                    {draft.polished_text}
                  </p>
                </div>
              )}
            </details>
            {isStandard ? (
              <button
                type="button"
                onClick={startEdit}
                className="shrink-0 rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
              >
                編集
              </button>
            ) : (
              <span className="shrink-0 text-[10px] text-muted-foreground">
                Standard で編集可能
              </span>
            )}
          </div>
        </>
      )}
    </li>
  );
}
