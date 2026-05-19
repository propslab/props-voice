import Anthropic from "@anthropic-ai/sdk";
import type { PolishStyle } from "@/lib/supabase/types";

const STYLE_INSTRUCTIONS: Record<PolishStyle, string> = {
  casual: "親しみやすく自然なカジュアルな文体に整える（『です・ます』調はOK、堅すぎない言い回しで）",
  formal: "丁寧で品のあるフォーマルな文体に整える（敬意のある言い回し、ビジネス文書的な落ち着き）",
};

function buildSystemPrompt(style: PolishStyle): string {
  return `あなたは飲食店・美容院・サービス業の口コミを整える編集者です。
顧客が入力した一言を、Googleレビュー投稿用の自然な日本語に整えてください。

ルール：
- 内容を脚色・追加しない（客が言っていないことを書かない）
- 誤字・口語を整える
- 100-200文字程度
- 文体: ${STYLE_INSTRUCTIONS[style]}
- 絵文字は使わない
- 評価が★4-5なら肯定的な表現、★1-3なら率直な改善要望を残す
- お店の宣伝文句にしない（客の視点を保つ）

【絶対遵守】
- 返答は整文済みの口コミ本文のみ。前置き・説明・断り書きは一切含めない
- 「申し訳ありません」「すみません」「整えることができません」「適切な口コミにできません」等の謝罪・拒否文は絶対に使わない
- 入力が短くても・曖昧でも・誤字があっても、入力の意図を汲み取って必ず口コミ本文を生成する
- どんな入力であっても、出力は必ず「お客様視点の口コミ文」として返す`;
}

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 500;
const TEMPERATURE = 0.3;

// Claude が稀に整文を拒否して返してくる説明文・謝罪文の検出。
// これらが含まれていたら整文失敗として例外扱い → 来店客にはリトライ案内する。
const REFUSAL_PATTERNS: RegExp[] = [
  /申し訳(ありません|ございません|ない)/,
  /(整える|整文|生成|作成)(ことが)?できません/,
  /適切な口コミ.*できません/,
  /^(すみません|ごめんなさい)/,
  /^(ご入力|お客様の?入力)(いただいた)?(内容|一言)(から|を|では)/,
  /(より具体的|もう少し詳しく|具体的な内容)/,
];

export class PolishRefusedError extends Error {
  constructor() {
    super("AI が整文を拒否しました");
    this.name = "PolishRefusedError";
  }
}

export async function polishWithClaude(
  storeName: string,
  rating: number,
  rawInput: string,
  style: PolishStyle = "casual"
): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    system: buildSystemPrompt(style),
    messages: [
      {
        role: "user",
        content: `店舗名：${storeName}\n評価：★${rating}\n客の一言：${rawInput}`,
      },
    ],
  });

  const block = response.content[0];
  if (!block || block.type !== "text") {
    throw new Error("Claude did not return text content");
  }
  const text = block.text.trim();

  // 拒否文・説明文を検出したら例外として扱う
  if (REFUSAL_PATTERNS.some((re) => re.test(text))) {
    console.warn("[polishWithClaude] 拒否パターン検出:", text.slice(0, 100));
    throw new PolishRefusedError();
  }

  return text;
}
