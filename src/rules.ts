// src/rules.ts

export type HeadingNumber = number[];

const GENERATED_NUMBER_REGEX = /^\s*(\d+(?:\.\d+)*)\.\s+/;

export function extractHeadingNumber(text: string): HeadingNumber | null {
  const match = text.match(GENERATED_NUMBER_REGEX);

  if (!match) {
    return null;
  }

  return match[1].split(".").map(Number);
}

export function removeHeadingNumber(text: string): string {
  return text.replace(GENERATED_NUMBER_REGEX, "").trim();
}

export function getHeadingRule(text: string): "normal" | "skip" | "skip-all" {
  if (/<!--\s*skip-all\s*-->\s*$/i.test(text)) {
    return "skip-all";
  }

  if (/<!--\s*skip\s*-->\s*$/i.test(text)) {
    return "skip";
  }

  return "normal";
}

export function removeRuleComment(text: string): string {
  return text
    .replace(/\s*<!--\s*skip-all\s*-->\s*$/i, "")
    .replace(/\s*<!--\s*skip\s*-->\s*$/i, "")
    .trim();
}
