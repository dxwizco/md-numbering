// src/numbering.ts
import { LogicalHeading } from "./types";

export interface NumberingOptions {
  /**
   * Physical heading level at which visible numbering starts.
   *
   * 1 = number from H1
   * 2 = leave H1 unnumbered and start numbering from H2
   * 3 = leave H1/H2 unnumbered and start numbering from H3
   */
  startLevel?: number;
}

export function assignNumbers(
  roots: LogicalHeading[],
  options: NumberingOptions = {},
): void {
  const startLevel = options.startLevel ?? 1;

  if (!Number.isInteger(startLevel) || startLevel < 1 || startLevel > 6) {
    throw new Error("startLevel must be an integer between 1 and 6");
  }

  const counters: number[] = [];

  assignNodes(roots, startLevel, counters, []);
}

function assignNodes(
  nodes: LogicalHeading[],
  startLevel: number,
  counters: number[],
  parentNumber: number[],
): void {
  for (const node of nodes) {
    if (node.level < startLevel) {
      /*
       * Structurally present but not numbered.
       *
       * Its children continue from the same logical numbering
       * context rather than starting a new counter.
       */
      node.number = [];

      assignNodes(node.children, startLevel, counters, parentNumber);
      continue;
    }

    /*
     * This is a numbered logical heading.
     *
     * The counter is associated with the logical depth, not
     * with the physical heading level.
     */
    const depth = parentNumber.length;

    counters[depth] = (counters[depth] ?? 0) + 1;

    /*
     * Reset deeper counters because we are starting a new
     * sibling branch at this depth.
     */
    counters.length = depth + 1;

    const nodeNumber = [...parentNumber, counters[depth]];

    node.number = nodeNumber;

    assignNodes(node.children, startLevel, counters, nodeNumber);
  }
}
