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
     * A skip heading is completely transparent to the logical
     * hierarchy.
     *
     * IMPORTANT:
     * Do not modify the stack here.
     *
     * This means:
     *
     *   ### A
     *   #### B
     *   ### C <!-- skip -->
     *   #### D
     *
     * becomes:
     *
     *   A
     *   ├── B
     *   └── D
     *
     * Therefore B and D are siblings in the logical hierarchy.
     */
    if (heading.rule === "skip") {
      continue;
    }

    /*
     * A skip-all heading starts a new skipped subtree.
     *
     * Unlike normal skip, skip-all DOES affect the physical
     * hierarchy because its entire subtree must be ignored.
     */
    if (heading.rule === "skip-all") {
      skipAllLevel = heading.level;

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
     * current normal heading.
     */
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
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
