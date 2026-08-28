// src/hierarchy.ts

import { Heading, LogicalHeading } from "./types";

export function buildLogicalHierarchy(headings: Heading[]): LogicalHeading[] {
  const roots: LogicalHeading[] = [];
  const stack: LogicalHeading[] = [];

  let skipAllLevel: number | null = null;

  for (const heading of headings) {
    /*
     * If we are inside a skip-all subtree, ignore every descendant.
     *
     * The subtree ends when we encounter a heading whose physical
     * level is the same as or higher than the skip-all heading.
     */
    if (skipAllLevel !== null) {
      if (heading.level > skipAllLevel) {
        continue;
      }

      // We have left the skipped subtree.
      skipAllLevel = null;
    }

    /*
     * A skip-all heading starts a new skipped subtree.
     */
    if (heading.rule === "skip-all") {
      skipAllLevel = heading.level;

      // Remove any logical parents that cannot be ancestors
      // of headings following this level.
      while (
        stack.length > 0 &&
        stack[stack.length - 1].level >= heading.level
      ) {
        stack.pop();
      }

      continue;
    }

    /*
     * Remove headings that are not physical ancestors of the
     * current heading.
     */
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    /*
     * A skip heading is not added to the logical hierarchy.
     *
     * We intentionally do NOT push it onto the stack.
     * Therefore its children will attach to the nearest
     * surviving logical ancestor.
     */
    if (heading.rule === "skip") {
      continue;
    }

    const node: LogicalHeading = {
      ...heading,
      number: [],
      parent: stack.length > 0 ? stack[stack.length - 1] : null,
      children: [],
    };

    if (node.parent) {
      node.parent.children.push(node);
    } else {
      roots.push(node);
    }

    stack.push(node);
  }

  return roots;
}
