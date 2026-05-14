const SUFFIX_CHARS = "abcdefghijkmnopqrstuvwxyz23456789";
const PREFIX = "bf";
const SLUG_BODY_MAX = 20;
const RANDOM_SUFFIX_LENGTH = 4;

function randomSuffix(length: number = RANDOM_SUFFIX_LENGTH): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += SUFFIX_CHARS[Math.floor(Math.random() * SUFFIX_CHARS.length)];
  }
  return result;
}

function slugifyStoreName(name: string): string {
  const ascii = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^ -~]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_BODY_MAX);
  return ascii || "shop";
}

export function generateSlug(storeName: string): string {
  return `${PREFIX}-${slugifyStoreName(storeName)}-${randomSuffix()}`;
}
