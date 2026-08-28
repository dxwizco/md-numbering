// src/parser.ts

import { Heading } from "./types";
import {
  extractHeadingNumber,
  getHeadingRule,
  removeHeadingNumber,
  removeRuleComment,
} from "./rules";

const HEADING_REGEX = /^(#{1,6})[ \t]+(.+?)[ \t]*$/;

const FENCE_REGEX = /^[ \t]*(`{3,}|~{3,})/;

export function parseHeadings(markdown: string): Heading[] {
  const lines = markdown.split(/\r?\n/);
  const headings: Heading[] = [];

  let activeFence: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const fenceMatch = line.match(FENCE_REGEX);

    if (fenceMatch) {
      const fence = fenceMatch[1];

      if (activeFence === null) {
        activeFence = fence[0];
      } else if (fence[0] === activeFence) {
        activeFence = null;
      }

      continue;
    }

    // Ignore everything inside fenced code blocks.
    if (activeFence !== null) {
      continue;
    }

    const match = line.match(HEADING_REGEX);

    if (!match) {
      continue;
    }

    const level = match[1].length;

    let text = match[2].trim();

    const existingNumber = extractHeadingNumber(text);

    text = removeHeadingNumber(text);

    const rule = getHeadingRule(text);

    text = removeRuleComment(text);

    headings.push({
      level,
      text,
      line: i,
      rule,
      number: existingNumber,
    });
  }

  return headings;
}
