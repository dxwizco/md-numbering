// test/numbering.test.ts
import { describe, expect, it } from "vitest";

import { parseHeadings } from "../src/parser";
import { buildLogicalHierarchy } from "../src/hierarchy";
import { assignNumbers } from "../src/numbering";
import { renderNumberedMarkdown } from "../src/renderer";
import { removeNumbering } from "../src/remove";

// function numberMarkdown(markdown: string): string {
//   const headings = parseHeadings(markdown);
//   const hierarchy = buildLogicalHierarchy(headings);

//   assignNumbers(hierarchy);

//   return renderNumberedMarkdown(markdown, hierarchy);
// }

function numberMarkdown(
  markdown: string,
  options: { startLevel: number } = { startLevel: 1 },
): string {
  const headings = parseHeadings(markdown);
  const hierarchy = buildLogicalHierarchy(headings);

  assignNumbers(hierarchy, options);

  return renderNumberedMarkdown(markdown, hierarchy);
}

describe("Markdown heading numbering", () => {
  it("starts numbering from H2 and skips H1", () => {
    const input = `# Project
## Introduction
### Background
## Usage
### Examples`;
    const expected = `# Project
## 1. Introduction
### 1.1. Background
## 2. Usage
### 2.1. Examples`;
    expect(numberMarkdown(input, { startLevel: 2 })).toBe(expected);
  });
  it("starts numbering from H3 and skips H1 and H2", () => {
    const input = `# Project
## Installation
### Windows
#### Setup
### Linux
#### Setup`;
    const expected = `# Project
## Installation
### 1. Windows
#### 1.1. Setup
### 2. Linux
#### 2.1. Setup`;
    expect(numberMarkdown(input, { startLevel: 3 })).toBe(expected);
  });
  it("keeps skipped higher levels out of the numbering hierarchy", () => {
    const input = `# Project
## Section
### First
#### Details
### Second
#### Details`;
    const expected = `# Project
## Section
### 1. First
#### 1.1. Details
### 2. Second
#### 2.1. Details`;
    expect(numberMarkdown(input, { startLevel: 3 })).toBe(expected);
  });

  it("supports missing physical levels when numbering starts at H2", () => {
    const input = `# Project
#### Details
##### More details
###### Deep details`;
    const expected = `# Project
#### 1. Details
##### 1.1. More details
###### 1.1.1. Deep details`;
    expect(numberMarkdown(input, { startLevel: 2 })).toBe(expected);
  });
  it("does not number headings above the configured start level", () => {
    const input = `# Project
## Section
### Details`;
    const expected = `# Project
## 1. Section
### 1.1. Details`;
    expect(numberMarkdown(input, { startLevel: 2 })).toBe(expected);
  });
  it("start level 1 preserves normal numbering", () => {
    const input = `# Project
## Section
### Details`;
    const expected = `# 1. Project
## 1.1. Section
### 1.1.1. Details`;
    expect(numberMarkdown(input, { startLevel: 1 })).toBe(expected);
  });
  it("combines start level with skip", () => {
    const input = `# Project
## Section
### Skipped <!-- skip -->
#### Details
### Next`;
    const expected = `# Project
## 1. Section
### Skipped <!-- skip -->
#### 1.1. Details
### 1.2. Next`;
    expect(numberMarkdown(input, { startLevel: 2 })).toBe(expected);
  });
  it("combines start level with skip-all", () => {
    const input = `# Project
## Section
### Ignored <!-- skip-all -->
#### Ignored child
### Next`;
    const expected = `# Project
## 1. Section
### Ignored <!-- skip-all -->
#### Ignored child
### 1.1. Next`;
    expect(numberMarkdown(input, { startLevel: 2 })).toBe(expected);
  });

  it("numbers a simple heading hierarchy", () => {
    const input = `# Chapter
## Introduction
### Background
## Conclusion`;
    const expected = `# 1. Chapter
## 1.1. Introduction
### 1.1.1. Background
## 1.2. Conclusion`;
    expect(numberMarkdown(input)).toBe(expected);
  });
  it("supports missing physical heading levels", () => {
    const input = `# Chapter
#### Details
##### More details
###### Deep details`;

    const expected = `# 1. Chapter
#### 1.1. Details
##### 1.1.1. More details
###### 1.1.1.1. Deep details`;
    expect(numberMarkdown(input)).toBe(expected);
  });
  it("does not treat H7 as a heading", () => {
    const input = `# Chapter
####### Not a heading`;
    const expected = `# 1. Chapter
####### Not a heading`;
    expect(numberMarkdown(input)).toBe(expected);
  });
  it("supports skip", () => {
    const input = `# Chapter
## Section <!-- skip -->
### Details`;
    const expected = `# 1. Chapter
## Section <!-- skip -->
### 1.1. Details`;
    expect(numberMarkdown(input)).toBe(expected);
  });
  it("supports skip-all", () => {
    const input = `# Chapter
## Ignored <!-- skip-all -->
### Ignored child
#### Ignored grandchild
## Next section`;
    const expected = `# 1. Chapter
## Ignored <!-- skip-all -->
### Ignored child
#### Ignored grandchild
## 1.1. Next section`;
    expect(numberMarkdown(input)).toBe(expected);
  });
  it("skip behaves like a missing heading", () => {
    const input = `# Chapter
## First
### Skipped <!-- skip -->
### Next
#### Details`;

    const expected = `# 1. Chapter
## 1.1. First
### Skipped <!-- skip -->
### 1.1.1. Next
#### 1.1.1.1. Details`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("skip-all excludes its entire subtree", () => {
    const input = `# Chapter
## First
### Details
## Ignored <!-- skip-all -->
### Ignored child
#### Ignored grandchild
## Next
### Next child`;

    const expected = `# 1. Chapter
## 1.1. First
### 1.1.1. Details
## Ignored <!-- skip-all -->
### Ignored child
#### Ignored grandchild
## 1.2. Next
### 1.2.1. Next child`;

    expect(numberMarkdown(input)).toBe(expected);
  });
  it("continues numbering across multiple H1 sections", () => {
    const input = `# First
## Child

# Second
#### Deep child

# Third`;

    const expected = `# 1. First
## 1.1. Child

# 2. Second
#### 2.1. Deep child

# 3. Third`;

    expect(numberMarkdown(input)).toBe(expected);
  });
  it("treats the first child at any physical level as logical child", () => {
    const input = `# Chapter
#### First
#### Second
###### Deep`;

    const expected = `# 1. Chapter
#### 1.1. First
#### 1.2. Second
###### 1.2.1. Deep`;

    expect(numberMarkdown(input)).toBe(expected);
  });
  it("resumes skip-all at the skipped heading's level", () => {
    const input = `# Chapter
## Ignored <!-- skip-all -->
### Ignored child
## Next
### Child`;

    const expected = `# 1. Chapter
## Ignored <!-- skip-all -->
### Ignored child
## 1.1. Next
### 1.1.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });
  it("uses trailing dot numbering", () => {
    const input = `# Chapter
## Section
### Topic`;

    const expected = `# 1. Chapter
## 1.1. Section
### 1.1.1. Topic`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("does not change an already numbered document", () => {
    const input = `# 1. Chapter
## 1.1. Section
### 1.1.1. Topic`;

    const once = numberMarkdown(input);
    const twice = numberMarkdown(once);

    expect(once).toBe(input);
    expect(twice).toBe(input);
  });

  it("handles multi-digit numbers", () => {
    const headings = Array.from(
      { length: 12 },
      (_, i) => `## Section ${i + 1}`,
    ).join("\n");

    const input = `# Chapter\n${headings}`;

    const result = numberMarkdown(input);

    expect(result).toContain("## 1.10. Section 10");
    expect(result).toContain("## 1.11. Section 11");
    expect(result).toContain("## 1.12. Section 12");
  });
  it("removes generated numbering", () => {
    const input = `# 1. Chapter
## 1.1. Section
### 1.1.1. Topic`;

    const expected = `# Chapter
## Section
### Topic`;

    expect(removeNumbering(input)).toBe(expected);
  });

  it("removes multi-level generated numbering", () => {
    const input = `# 1. Chapter
## 1.10. Section
### 1.10.3. Topic`;

    const expected = `# Chapter
## Section
### Topic`;

    expect(removeNumbering(input)).toBe(expected);
  });

  it("removes any heading using the generated numbering format", () => {
    const input = `# 2026. Project Roadmap
## 1. Introduction
### 1.5. Real Section`;

    const expected = `# Project Roadmap
## Introduction
### Real Section`;

    expect(removeNumbering(input)).toBe(expected);
  });

  it("remove is idempotent", () => {
    const input = `# 1. Chapter
## 1.1. Section`;

    const once = removeNumbering(input);
    const twice = removeNumbering(once);

    expect(twice).toBe(once);
  });
});
