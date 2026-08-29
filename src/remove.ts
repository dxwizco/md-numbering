// src/remove.ts

import { getHeadingRule, removeRuleComment } from "./rules";

const HEADING_REGEX = /^(#{1,6})[ \t]+(.+?)[ \t]*$/;
const FENCE_REGEX = /^[ \t]*(`{3,}|~{3,})/;
const GENERATED_NUMBER_REGEX = /^\d+(?:\.\d+)*\.\s+/;

export function removeNumbering(markdown: string): string {
  const lines = markdown.split(/\r?\n/);

  let activeFence: string | null = null;
  let activeHtmlComment = false;
  let skipAllLevel: number | null = null;

  return lines
    .map((line) => {
      const fenceMatch = line.match(FENCE_REGEX);

      if (fenceMatch) {
        const fence = fenceMatch[1];

        if (activeFence === null) {
          activeFence = fence[0];
        } else if (fence[0] === activeFence) {
          activeFence = null;
        }

        return line;
      }

      // Ignore everything inside fenced code blocks.
      if (activeFence !== null) {
        return line;
      }

      // Ignore everything inside multiline HTML comments.
      if (activeHtmlComment) {
        if (line.includes("-->")) {
          activeHtmlComment = false;
        }

        return line;
      }

      const headingMatch = line.match(HEADING_REGEX);

      /*
       * Only a non-heading line can start a multiline HTML comment.
       *
       * Inline comments on headings such as:
       *
       *   # 1. Heading <!-- skip -->
       *
       * must still be processed as headings.
       */
      if (!headingMatch) {
        if (line.includes("<!--") && !line.includes("-->")) {
          activeHtmlComment = true;
        }

        return line;
      }

      const level = headingMatch[1].length;
      const spacing = headingMatch[0].match(/^(#{1,6})([ \t]+)/)?.[2] ?? " ";
      const content = headingMatch[2].trim();

      /*
       * If we are inside a skip-all subtree, leave every heading
       * untouched until we reach a heading at the same or higher level.
       */
      if (skipAllLevel !== null) {
        if (level > skipAllLevel) {
          return line;
        }

        skipAllLevel = null;
      }

      const rule = getHeadingRule(content);

      /*
       * A skip heading keeps its own numbering.
       *
       * Its children are still processed normally.
       */
      if (rule === "skip") {
        return line;
      }

      /*
       * A skip-all heading and its entire subtree remain untouched.
       */
      if (rule === "skip-all") {
        skipAllLevel = level;
        return line;
      }

      const cleanedContent = content.replace(GENERATED_NUMBER_REGEX, "");

      return `${headingMatch[1]}${spacing}${cleanedContent}`;
    })
    .join("\n");
}

// // DX: Working but codeblock and commented are not handled.
// const GENERATED_NUMBER_REGEX = /^\d+(?:\.\d+)*\.\s+/;

// export function removeNumbering(markdown: string): string {
//   const lines = markdown.split(/\r?\n/);

//   return lines
//     .map((line) => {
//       const match = line.match(/^(#{1,6})([ \t]+)(.+)$/);

//       if (!match) {
//         return line;
//       }

//       const hashes = match[1];
//       const spacing = match[2];
//       const content = match[3];

//       const cleaned = content.replace(GENERATED_NUMBER_REGEX, "");

//       return `${hashes}${spacing}${cleaned}`;
//     })
//     .join("\n");
// }
