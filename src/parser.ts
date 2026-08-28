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
  let activeHtmlComment = false;

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

    /*
     * Ignore headings inside HTML comments.
     *
     * Important:
     * A heading such as:
     *
     *   # Heading <!-- skip-all -->
     *
     * must still be parsed because the HTML comment is a numbering rule.
     *
     * We therefore only enter HTML-comment mode when the line itself
     * is part of a comment block, not when the comment occurs after
     * an actual heading.
     */
    if (activeHtmlComment) {
      if (line.includes("-->")) {
        activeHtmlComment = false;
      }

      continue;
    }

    const headingMatch = line.match(HEADING_REGEX);

    if (!headingMatch) {
      if (line.includes("<!--") && !line.includes("-->")) {
        activeHtmlComment = true;
      }

      continue;
    }

    const level = headingMatch[1].length;

    let text = headingMatch[2].trim();

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
