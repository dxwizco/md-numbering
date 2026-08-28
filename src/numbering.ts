// src/numbering.ts

// import { LogicalHeading } from "./types";

// export interface NumberingOptions {
//   startLevel: number;
// }

// export function assignNumbers(
//   roots: LogicalHeading[],
//   options: NumberingOptions = { startLevel: 1 },
// ): void {
//   const startLevel = Math.max(1, Math.min(6, options.startLevel));

//   const numberedRoots = roots.filter((root) => root.level >= startLevel);

//   for (let i = 0; i < numberedRoots.length; i++) {
//     assignChildNumbers(numberedRoots[i], [i + 1], startLevel);
//   }
// }

// function assignChildNumbers(
//   node: LogicalHeading,
//   parentNumber: number[],
//   startLevel: number,
// ): void {
//   node.number = [...parentNumber];

//   const children = node.children.filter((child) => child.level >= startLevel);

//   for (let i = 0; i < children.length; i++) {
//     const childNumber = [...parentNumber, i + 1];

//     assignChildNumbers(children[i], childNumber, startLevel);
//   }
// }

// === DX: Present-2
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

  assignChildren(roots, startLevel, []);
}

function assignChildren(
  nodes: LogicalHeading[],
  startLevel: number,
  parentNumber: number[],
): void {
  let siblingNumber = 0;

  for (const node of nodes) {
    if (node.level < startLevel) {
      /*
       * This heading is structurally present but is not numbered.
       *
       * Its children continue using the same logical numbering parent.
       */
      node.number = [];

      assignChildren(node.children, startLevel, parentNumber);
      continue;
    }

    siblingNumber++;

    const nodeNumber = [...parentNumber, siblingNumber];

    node.number = nodeNumber;

    assignChildren(node.children, startLevel, nodeNumber);
  }
}

// // === DX: Working
// import { LogicalHeading } from "./types";

// export function assignNumbers(roots: LogicalHeading[]): void {
//   const counters: number[] = [];

//   for (let i = 0; i < roots.length; i++) {
//     counters[0] = i + 1;

//     // Remove counters from deeper levels.
//     counters.length = 1;

//     assignChildNumbers(roots[i], counters);
//   }
// }

// function assignChildNumbers(
//   node: LogicalHeading,
//   parentNumber: number[],
// ): void {
//   node.number = [...parentNumber];

//   const children = node.children;

//   for (let i = 0; i < children.length; i++) {
//     const childNumber = [...parentNumber, i + 1];

//     assignChildNumbers(children[i], childNumber);
//   }
// }
