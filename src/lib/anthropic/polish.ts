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

返答は整文済みの本文のみ。前置きや説明は不要。`;
}

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 500;
const TEMPERATURE = 0.3;

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
  return block.text.trim();
}
