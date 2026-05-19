import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CSV_HEADERS = [
  "created_at",
  "rating",
  "raw_input",
  "polished_text",
  "edited_polished_text",
  "edited_at",
] as const;

function escapeCsvField(value: string | number | null): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  // ダブルクォート・カンマ・改行を含む場合はダブルクォートで囲み、内部のクォートを倍にする
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function todayYmd(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.plan !== "standard") {
    return NextResponse.json(
      { error: "Standard プランで利用可能な機能です" },
      { status: 403 }
    );
  }

  const { data: store } = await supabase
    .from("stores")
    .select("id, slug")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!store) {
    return NextResponse.json(
      { error: "店舗が登録されていません" },
      { status: 404 }
    );
  }

  const { data: drafts, error } = await supabase
    .from("drafts")
    .select(
      "created_at, rating, raw_input, polished_text, edited_polished_text, edited_at"
    )
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[export/csv] drafts 取得エラー:", error);
    return NextResponse.json(
      { error: "口コミの取得に失敗しました" },
      { status: 500 }
    );
  }

  const rows = drafts ?? [];
  const lines: string[] = [];
  lines.push(CSV_HEADERS.join(","));
  for (const row of rows) {
    lines.push(
      [
        escapeCsvField(row.created_at),
        escapeCsvField(row.rating),
        escapeCsvField(row.raw_input),
        escapeCsvField(row.polished_text),
        escapeCsvField(row.edited_polished_text),
        escapeCsvField(row.edited_at),
      ].join(",")
    );
  }
  const csvBody = lines.join("\r\n");

  // BOM 付き UTF-8（U+FEFF）+ CRLF 改行で Excel の文字化け・改行崩れ両方を防ぐ
  const BOM_UTF8 = "﻿";
  const filename = `props-voice-${store.slug}-${todayYmd()}.csv`;

  return new Response(BOM_UTF8 + csvBody, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
