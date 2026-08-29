import { describe, expect, it } from "vitest";

import { parseHeadings } from "../src/parser";
import { buildLogicalHierarchy } from "../src/hierarchy";
import { assignNumbers } from "../src/numbering";
import { renderNumberedMarkdown } from "../src/renderer";
import { removeNumbering } from "../src/remove";

function numberMarkdown(
  markdown: string,
  options: { startLevel: number } = { startLevel: 1 },
): string {
  const headings = parseHeadings(markdown);
  const hierarchy = buildLogicalHierarchy(headings);

  assignNumbers(hierarchy, options);

  return renderNumberedMarkdown(markdown, hierarchy);
}

describe("Markdown heading numbering — edge cases", () => {
  /*
   * ============================================================
   * SKIP
   *
   * skip = exclude only this heading.
   * The skipped heading consumes NO number.
   * Its children remain in the hierarchy.
   * ============================================================
   */

  it("skip at H1 does not consume a root number", () => {
    const input = `# First <!-- skip -->
## Child

# Second
## Child`;

    const expected = `# First <!-- skip -->
## 1. Child

# 2. Second
## 2.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("skip at H2 does not consume a child number", () => {
    const input = `# Root
## First <!-- skip -->
### Child

## Second
### Child`;

    const expected = `# 1. Root
## First <!-- skip -->
### 1.1. Child

## 1.2. Second
### 1.2.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("skip at H3 does not consume a child number", () => {
    const input = `# Root
## Section
### First <!-- skip -->
#### Child

### Second
#### Child`;

    const expected = `# 1. Root
## 1.1. Section
### First <!-- skip -->
#### 1.1.1. Child

### 1.1.2. Second
#### 1.1.2.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("skip at H4 does not consume a child number", () => {
    const input = `# Root
## Section
### Subsection
#### First <!-- skip -->
##### Child

#### Second
##### Child`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Subsection
#### First <!-- skip -->
##### 1.1.1.1. Child

#### 1.1.1.2. Second
##### 1.1.1.2.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("skip at H5 does not consume a child number", () => {
    const input = `# Root
## Section
### Subsection
#### Detail
##### First <!-- skip -->
###### Child

##### Second
###### Child`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Subsection
#### 1.1.1.1. Detail
##### First <!-- skip -->
###### 1.1.1.1.1. Child

##### 1.1.1.1.2. Second
###### 1.1.1.1.2.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("skip at H6 does not consume a number", () => {
    const input = `# Root
## Section
### Subsection
#### Detail
##### Deep
###### First <!-- skip -->

###### Second`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Subsection
#### 1.1.1.1. Detail
##### 1.1.1.1.1. Deep
###### First <!-- skip -->

###### 1.1.1.1.1.1. Second`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  /*
   * ============================================================
   * SKIP-ALL
   *
   * skip-all = exclude this heading and its entire subtree.
   * Nothing in the skipped subtree consumes a number.
   * ============================================================
   */

  it("skip-all at H1 excludes the entire H1 subtree", () => {
    const input = `# First <!-- skip-all -->
## Ignored
### Ignored

# Second
## Child`;

    const expected = `# First <!-- skip-all -->
## Ignored
### Ignored

# 1. Second
## 1.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("skip-all at H2 does not consume a child number", () => {
    const input = `# Root
## Ignored <!-- skip-all -->
### Ignored
#### Ignored

## Next
### Child`;

    const expected = `# 1. Root
## Ignored <!-- skip-all -->
### Ignored
#### Ignored

## 1.1. Next
### 1.1.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("skip-all at H3 does not consume a child number", () => {
    const input = `# Root
## Section
### Ignored <!-- skip-all -->
#### Ignored
##### Ignored

### Next
#### Child`;

    const expected = `# 1. Root
## 1.1. Section
### Ignored <!-- skip-all -->
#### Ignored
##### Ignored

### 1.1.1. Next
#### 1.1.1.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("skip-all at H4 does not consume a child number", () => {
    const input = `# Root
## Section
### Subsection
#### Ignored <!-- skip-all -->
##### Ignored
###### Ignored

#### Next
##### Child`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Subsection
#### Ignored <!-- skip-all -->
##### Ignored
###### Ignored

#### 1.1.1.1. Next
##### 1.1.1.1.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("skip-all at H5 does not consume a child number", () => {
    const input = `# Root
## Section
### Subsection
#### Detail
##### Ignored <!-- skip-all -->
###### Ignored

##### Next
###### Child`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Subsection
#### 1.1.1.1. Detail
##### Ignored <!-- skip-all -->
###### Ignored

##### 1.1.1.1.1. Next
###### 1.1.1.1.1.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("skip-all at H6 does not consume a number", () => {
    const input = `# Root
## Section
### Subsection
#### Detail
##### Deep
###### Ignored <!-- skip-all -->

###### Next`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Subsection
#### 1.1.1.1. Detail
##### 1.1.1.1.1. Deep
###### Ignored <!-- skip-all -->

###### 1.1.1.1.1.1. Next`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  /*
   * ============================================================
   * CONSECUTIVE SKIPS
   * ============================================================
   */

  it("handles consecutive skip headings at different levels", () => {
    const input = `# Root
## Section
### Skip H3 <!-- skip -->
#### Skip H4 <!-- skip -->
##### Skip H5 <!-- skip -->
###### Child

### Next
#### Child`;

    const expected = `# 1. Root
## 1.1. Section
### Skip H3 <!-- skip -->
#### Skip H4 <!-- skip -->
##### Skip H5 <!-- skip -->
###### 1.1.1. Child

### 1.1.2. Next
#### 1.1.2.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("handles multiple skip-all blocks without consuming sibling numbers", () => {
    const input = `# Root

## First <!-- skip-all -->
### Ignored

## Second
### Child

## Third <!-- skip-all -->
### Ignored

## Fourth
### Child`;

    const expected = `# 1. Root

## First <!-- skip-all -->
### Ignored

## 1.1. Second
### 1.1.1. Child

## Third <!-- skip-all -->
### Ignored

## 1.2. Fourth
### 1.2.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  /*
   * ============================================================
   * SKIP-ALL BOUNDARIES
   * ============================================================
   */

  it("continues after skip-all with a heading at the same level", () => {
    const input = `# Root
## Ignored <!-- skip-all -->
### Ignored
## Next
### Child`;

    const expected = `# 1. Root
## Ignored <!-- skip-all -->
### Ignored
## 1.1. Next
### 1.1.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("continues after skip-all with a heading at a higher level", () => {
    const input = `# Root
## Section
### Ignored <!-- skip-all -->
#### Ignored

## Next
### Child

# Second`;

    const expected = `# 1. Root
## 1.1. Section
### Ignored <!-- skip-all -->
#### Ignored

## 1.2. Next
### 1.2.1. Child

# 2. Second`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  /*
   * ============================================================
   * MISSING INTERMEDIATE LEVELS
   * ============================================================
   */

  it("handles H3 directly followed by H6", () => {
    const input = `# Root
## Section
### Subsection
###### Deep`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Subsection
###### 1.1.1.1. Deep`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("handles H3 directly followed by H5", () => {
    const input = `# Root
## Section
### Subsection
##### Deep`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Subsection
##### 1.1.1.1. Deep`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("handles H3 directly followed by H4 and then H6", () => {
    const input = `# Root
## Section
### Subsection
#### Detail
###### Deep`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Subsection
#### 1.1.1.1. Detail
###### 1.1.1.1.1. Deep`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  /*
   * ============================================================
   * RETURNING FROM DEEP LEVELS
   * ============================================================
   */

  it("returns correctly from H6 to H2", () => {
    const input = `# Root
## Section
### Subsection
###### Deep
## Next`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Subsection
###### 1.1.1.1. Deep
## 1.2. Next`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("returns correctly from H6 to H3", () => {
    const input = `# Root
## Section
### First
###### Deep
### Second`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. First
###### 1.1.1.1. Deep
### 1.1.2. Second`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("returns correctly from H6 to H4", () => {
    const input = `# Root
## Section
### Subsection
#### First
###### Deep
#### Second`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Subsection
#### 1.1.1.1. First
###### 1.1.1.1.1. Deep
#### 1.1.1.2. Second`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  /*
   * ============================================================
   * GLOBAL CONTINUATION
   * ============================================================
   */

  it("continues numbering globally across multiple H1 sections", () => {
    const input = `# First
## Section

# Second
## Section

# Third
## Section`;

    const expected = `# 1. First
## 1.1. Section

# 2. Second
## 2.1. Section

# 3. Third
## 3.1. Section`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  /*
   * ============================================================
   * START LEVEL
   * ============================================================
   */

  it("supports startLevel = 1", () => {
    const input = `# Root
## Section
### Child`;

    const expected = `# 1. Root
## 1.1. Section
### 1.1.1. Child`;

    expect(numberMarkdown(input, { startLevel: 1 })).toBe(expected);
  });

  it("supports startLevel = 2", () => {
    const input = `# Root
## Section
### Child`;

    const expected = `# Root
## 1. Section
### 1.1. Child`;

    expect(numberMarkdown(input, { startLevel: 2 })).toBe(expected);
  });

  it("supports startLevel = 3", () => {
    const input = `# Root
## Section
### Child
#### Detail`;

    const expected = `# Root
## Section
### 1. Child
#### 1.1. Detail`;

    expect(numberMarkdown(input, { startLevel: 3 })).toBe(expected);
  });

  /*
   * ============================================================
   * EXISTING NUMBERING
   * ============================================================
   */

  it("recomputes existing numbering instead of preserving stale numbers", () => {
    const input = `# 99. Root
## 99.99. Old Section
### 99.99.99. Old Child

# 100. Root`;

    const expected = `# 1. Root
## 1.1. Old Section
### 1.1.1. Old Child

# 2. Root`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("handles multi-digit numbers", () => {
    const roots = Array.from(
      { length: 12 },
      (_, index) => `# Root ${index + 1}`,
    ).join("\n");

    const expected = Array.from(
      { length: 12 },
      (_, index) => `# ${index + 1}. Root ${index + 1}`,
    ).join("\n");

    expect(numberMarkdown(roots)).toBe(expected);
  });

  /*
   * ============================================================
   * INVALID HEADING LEVEL
   * ============================================================
   */

  it("does not treat H7 as a heading or consume a number", () => {
    const input = `# Root
## Section
####### Not a Level
### Child`;

    const expected = `# 1. Root
## 1.1. Section
####### Not a Level
### 1.1.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  /*
   * ============================================================
   * FENCED CODE BLOCKS
   * ============================================================
   */

  it("ignores headings inside fenced code blocks", () => {
    const input = `# Root

\`\`\`md
# Fake Root
## Fake Section
### Fake Child
\`\`\`

## Section
### Child`;

    const expected = `# 1. Root

\`\`\`md
# Fake Root
## Fake Section
### Fake Child
\`\`\`

## 1.1. Section
### 1.1.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  /*
   * ============================================================
   * RULE COMMENTS + EXISTING NUMBERING
   * ============================================================
   */

  it("handles existing numbering together with skip", () => {
    const input = `# Root
## Section
### 4.2. Old Heading <!-- skip -->
#### Child
### Next`;

    const expected = `# 1. Root
## 1.1. Section
### 4.2. Old Heading <!-- skip -->
#### 1.1.1. Child
### 1.1.2. Next`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  it("handles existing numbering together with skip-all", () => {
    const input = `# Root
## Section
### 4.2. Old Heading <!-- skip-all -->
#### Ignored
### Next`;

    const expected = `# 1. Root
## 1.1. Section
### 4.2. Old Heading <!-- skip-all -->
#### Ignored
### 1.1.1. Next`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  /*
   * ============================================================
   * WORDS "skip" / "skip-all" WITHOUT RULE COMMENTS
   * ============================================================
   */

  it("does not treat ordinary words skip or skip-all as rules", () => {
    const input = `# Root
## This section should skip nothing
### This section mentions skip-all but is normal
#### Child`;

    const expected = `# 1. Root
## 1.1. This section should skip nothing
### 1.1.1. This section mentions skip-all but is normal
#### 1.1.1.1. Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });

  /*
   * ============================================================
   * EMPTY / NON-HEADING LINES
   * ============================================================
   */

  it("ignores empty and non-heading lines when calculating numbering", () => {
    const input = `# Root


Some paragraph text.


## Section

More text here.

### Child


## Next

Another paragraph.`;

    const expected = `# 1. Root


Some paragraph text.


## 1.1. Section

More text here.

### 1.1.1. Child


## 1.2. Next

Another paragraph.`;

    expect(numberMarkdown(input)).toBe(expected);
  });
  it("ignores headings inside HTML comments", () => {
    const input = `<!--
# Project

## 1. Section

### 1.1. Normal

## 2. Ignored

### 2.1. Should stay unchanged

#### 2.1.1. Should also stay unchanged

## 3. Next

### 3.1. Child
-->

# Real Project
## Real Section
### Real Child`;

    const expected = `<!--
# Project

## 1. Section

### 1.1. Normal

## 2. Ignored

### 2.1. Should stay unchanged

#### 2.1.1. Should also stay unchanged

## 3. Next

### 3.1. Child
-->

# 1. Real Project
## 1.1. Real Section
### 1.1.1. Real Child`;

    expect(numberMarkdown(input)).toBe(expected);
  });
  it("remove ignores fenced code blocks", () => {
    const input = `# 1. Real Heading

\`\`\`md
# 2. Fake Heading
## 2.1. Fake Section
### 2.1.1. Fake Child
\`\`\`

## 1.1. Real Section`;

    const expected = `# Real Heading

\`\`\`md
# 2. Fake Heading
## 2.1. Fake Section
### 2.1.1. Fake Child
\`\`\`

## Real Section`;

    expect(removeNumbering(input)).toBe(expected);
  });

  it("remove ignores headings inside multiline HTML comments", () => {
    const input = `<!--
# 1. Commented Root
## 1.1. Commented Section
### 1.1.1. Commented Child
-->

# 1. Real Root
## 1.1. Real Section`;

    const expected = `<!--
# 1. Commented Root
## 1.1. Commented Section
### 1.1.1. Commented Child
-->

# Real Root
## Real Section`;

    expect(removeNumbering(input)).toBe(expected);
  });

  it("remove ignores skip headings", () => {
    const input = `# 1. Root
## 99. Custom Section <!-- skip -->
### 1.1. Child`;

    const expected = `# Root
## 99. Custom Section <!-- skip -->
### Child`;

    expect(removeNumbering(input)).toBe(expected);
  });

  it("remove ignores skip-all heading and its entire subtree", () => {
    const input = `# 1. Root
## 99. Custom Section <!-- skip-all -->
### 99.1. Custom Child
#### 99.1.1. Custom Grandchild
## 1.1. Next`;

    const expected = `# Root
## 99. Custom Section <!-- skip-all -->
### 99.1. Custom Child
#### 99.1.1. Custom Grandchild
## Next`;

    expect(removeNumbering(input)).toBe(expected);
  });

  it("remove resumes after a skip-all subtree", () => {
    const input = `# 1. Root
## 99. Custom Section <!-- skip-all -->
### 99.1. Custom Child
## 1.1. Next
### 1.1.1. Child`;

    const expected = `# Root
## 99. Custom Section <!-- skip-all -->
### 99.1. Custom Child
## Next
### Child`;

    expect(removeNumbering(input)).toBe(expected);
  });
});
