/**
 * デモアカウント seed スクリプト
 *
 * 使い方:
 *   node scripts/seed.mjs
 *
 * .env.local の SUPABASE_SERVICE_ROLE_KEY を使って、auth.users → stores → drafts を生成します。
 * 既存ユーザーがいる場合はスキップ。冪等に動きます。
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const text = readFileSync(path, "utf8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnvLocal();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が .env.local に必要です");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const demos = [
  {
    email: "demo-jericho@props-lab.com",
    storeName: "JERICHO HAIR",
    googleReviewUrl: "https://www.google.com/maps",
    slug: "bf-jericho-demo",
    drafts: [
      {
        rating: 5,
        raw: "丁寧でカット早かった",
        polished:
          "カットがとても丁寧で、仕上がりも満足です。短時間でテキパキとしていただけて、忙しい日でも安心して通えるサロンだと感じました。",
      },
      {
        rating: 5,
        raw: "カラーすごく似合うって言われた",
        polished:
          "カラーリングの仕上がりが好評で、周りからも「似合うね」と褒められました。提案も丁寧で、相談しやすい雰囲気のサロンです。",
      },
      {
        rating: 4,
        raw: "予約取りやすかった",
        polished:
          "予約が取りやすく、待ち時間も短くて助かりました。店内も清潔感があり、また通いたいと思えるお店です。",
      },
    ],
  },
  {
    email: "demo-cafe@props-lab.com",
    storeName: "Beppu Coffee Stand",
    googleReviewUrl: "https://www.google.com/maps",
    slug: "bf-cafe-demo",
    drafts: [
      {
        rating: 5,
        raw: "コーヒー美味しい 居心地よし",
        polished:
          "コーヒーがとても美味しく、居心地も良くて気に入りました。落ち着いた雰囲気でゆっくり過ごせるカフェです。",
      },
      {
        rating: 4,
        raw: "ランチセットお得",
        polished:
          "ランチセットがボリュームもあってお得でした。コーヒーも一緒に楽しめて、また利用したいと思います。",
      },
    ],
  },
  {
    email: "demo-massage@props-lab.com",
    storeName: "別府リラクゼーション",
    googleReviewUrl: "https://www.google.com/maps",
    slug: "bf-massage-demo",
    drafts: [
      {
        rating: 5,
        raw: "肩こりかなり楽になった",
        polished:
          "施術後、長年悩まされていた肩こりがかなり楽になりました。丁寧にカウンセリングしていただき、安心してお任せできました。",
      },
    ],
  },
];

let created = 0;
let skipped = 0;
let failed = 0;

for (const demo of demos) {
  console.log(`\n— ${demo.email} (${demo.storeName})`);

  // 1. ユーザー作成（既存ならスキップ）
  const { data: createUserData, error: createUserErr } =
    await supabase.auth.admin.createUser({
      email: demo.email,
      email_confirm: true,
    });

  let userId;
  if (createUserErr) {
    if (
      createUserErr.message?.includes("already") ||
      createUserErr.code === "email_exists"
    ) {
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existing = listData?.users?.find((u) => u.email === demo.email);
      if (!existing) {
        console.error(`  ✗ ユーザー作成失敗: ${createUserErr.message}`);
        failed++;
        continue;
      }
      userId = existing.id;
      console.log(`  ⊙ 既存ユーザーを再利用: ${userId}`);
      skipped++;
    } else {
      console.error(`  ✗ ユーザー作成失敗: ${createUserErr.message}`);
      failed++;
      continue;
    }
  } else {
    userId = createUserData.user.id;
    console.log(`  ✓ ユーザー作成: ${userId}`);
    created++;
  }

  // 2. 店舗作成（slug が既存ならスキップ）
  const { data: existingStore } = await supabase
    .from("stores")
    .select()
    .eq("slug", demo.slug)
    .maybeSingle();

  let storeId;
  if (existingStore) {
    storeId = existingStore.id;
    console.log(`  ⊙ 店舗既存: ${demo.slug}`);
  } else {
    const { data: newStore, error: storeErr } = await supabase
      .from("stores")
      .insert({
        user_id: userId,
        name: demo.storeName,
        google_review_url: demo.googleReviewUrl,
        slug: demo.slug,
      })
      .select()
      .single();
    if (storeErr) {
      console.error(`  ✗ 店舗作成失敗: ${storeErr.message}`);
      failed++;
      continue;
    }
    storeId = newStore.id;
    console.log(`  ✓ 店舗作成: ${demo.slug}`);
  }

  // 3. drafts 作成
  const { data: existingDrafts } = await supabase
    .from("drafts")
    .select("id")
    .eq("store_id", storeId);

  if (existingDrafts && existingDrafts.length > 0) {
    console.log(`  ⊙ 下書き既存（${existingDrafts.length}件）`);
  } else {
    const rows = demo.drafts.map((d) => ({
      store_id: storeId,
      rating: d.rating,
      raw_input: d.raw,
      polished_text: d.polished,
    }));
    const { error: draftsErr } = await supabase.from("drafts").insert(rows);
    if (draftsErr) {
      console.error(`  ✗ 下書き作成失敗: ${draftsErr.message}`);
    } else {
      console.log(`  ✓ 下書き作成: ${rows.length}件`);
    }
  }
}

console.log(`\n========================================`);
console.log(`完了: 新規 ${created} / 既存スキップ ${skipped} / 失敗 ${failed}`);
console.log(`========================================`);
