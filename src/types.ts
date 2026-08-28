// src/types.ts

export type HeadingRule = "normal" | "skip" | "skip-all";

export interface Heading {
  level: number;
  text: string;
  line: number;
  rule: HeadingRule;
  number: number[] | null;
}

export interface LogicalHeading extends Heading {
  number: number[];
  parent: LogicalHeading | null;
  children: LogicalHeading[];
}
