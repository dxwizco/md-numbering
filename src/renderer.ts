// src/renderer.ts

import { LogicalHeading } from "./types";

export function renderNumberedMarkdown(
  markdown: string,
  headings: LogicalHeading[],
): string {
  const lines = markdown.split(/\r?\n/);

  const allHeadings = flattenHeadings(headings);

  for (const heading of allHeadings) {
    if (heading.number.length === 0) {
      continue;
    }

    const number = heading.number.join(".");
    const originalLine = lines[heading.line];

    const match = originalLine.match(/^(#{1,6})([ \t]+)(.+?)[ \t]*$/);

    if (!match) {
      continue;
    }

    const hashes = match[1];
    const spacing = match[2];

    lines[heading.line] = `${hashes}${spacing}${number}. ${heading.text}`;
  }

  return lines.join("\n");
}

function flattenHeadings(headings: LogicalHeading[]): LogicalHeading[] {
  const result: LogicalHeading[] = [];

  function visit(nodes: LogicalHeading[]): void {
    for (const node of nodes) {
      result.push(node);
      visit(node.children);
    }
  }

  visit(headings);

  return result;
}
