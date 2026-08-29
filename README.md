# Markdown Numbering

Automatically number Markdown headings based on their **logical hierarchy**.

This VS Code extension adds and removes heading numbers such as:

```markdown
# 1. Introduction

## 1.1. Installation

### 1.1.1. Windows

### 1.1.2. Linux

## 1.2. Usage
```

It supports configurable starting levels, skipped headings, skipped subtrees, existing numbering, missing heading levels, fenced code blocks, and HTML comments.

## Features

- Automatically numbers Markdown headings from H1 to H6.
- Supports configurable numbering start levels.
- Preserves headings above the configured start level without numbering them.
- Builds a logical hierarchy even when physical heading levels are missing.
- Supports `<!-- skip -->` for headings that should remain unnumbered while their children continue normally.
- Supports `<!-- skip-all -->` for headings and entire subtrees that should remain untouched.
- Recalculates existing heading numbers instead of preserving stale numbering.
- Removes generated heading numbering with a separate command.
- Ignores headings inside fenced code blocks.
- Ignores headings inside multiline HTML comments.
- Preserves manually written numbering on skipped and skipped-all headings.
- Supports multi-digit numbering such as `1.10.` and `1.12.`.
- Works across multiple root-level sections while maintaining continuous numbering.

---

## Commands

The extension provides two commands.

### Markdown Numbering: Add Heading Numbers

Adds or recalculates heading numbers throughout the Markdown document.

Example:

```markdown
# Project

## Introduction

### Background

## Usage
```

becomes:

```markdown
# 1. Project

## 1.1. Introduction

### 1.1.1. Background

## 1.2. Usage
```

### Markdown Numbering: Remove Heading Numbers

Removes heading numbers generated in the supported numbering format.

Example:

```markdown
# 1. Project

## 1.1. Introduction

### 1.1.1. Background
```

becomes:

```markdown
# Project

## Introduction

### Background
```

The remove command also respects fenced code blocks, HTML comments, `skip`, and `skip-all`.

---

## Configuration

The extension provides one setting:

```text
md-numbering.startLevel
```

Default:

```text
1
```

The valid range is `1` through `6`.

### Start from H1

With:

```json
"md-numbering.startLevel": 1
```

all headings participate in numbering.

Input:

```markdown
# Project

## Installation

### Windows
```

Output:

```markdown
# 1. Project

## 1.1. Installation

### 1.1.1. Windows
```

### Start from H2

With:

```json
"md-numbering.startLevel": 2
```

H1 headings remain unnumbered.

Input:

```markdown
# Project

## Installation

### Windows

## Usage
```

Output:

```markdown
# Project

## 1. Installation

### 1.1. Windows

## 2. Usage
```

### Start from H3

With:

```json
"md-numbering.startLevel": 3
```

H1 and H2 headings remain unnumbered.

Input:

```markdown
# Project

## Installation

### Windows

#### Setup

### Linux
```

Output:

```markdown
# Project

## Installation

### 1. Windows

#### 1.1. Setup

### 2. Linux
```

---

## Logical Hierarchy

Numbering is based on the **logical hierarchy**, not simply on the numeric difference between physical heading levels.

For example:

```markdown
# Chapter

#### Details

##### More details

###### Deep details
```

is treated logically as:

```text
Chapter
└── Details
    └── More details
        └── Deep details
```

Therefore the result is:

```markdown
# 1. Chapter

#### 1.1. Details

##### 1.1.1. More details

###### 1.1.1.1. Deep details
```

Intermediate heading levels do not need to physically exist.

---

## Missing Heading Levels

Markdown headings can jump directly from one level to another.

For example:

```markdown
# Root

### Section

###### Deep section
```

The extension treats the headings as parent and child according to their physical order and hierarchy.

The result is:

```markdown
# 1. Root

### 1.1. Section

###### 1.1.1. Deep section
```

The physical heading level is preserved. Only the numbering hierarchy is logical.

---

## Skipping a Heading

A heading can be excluded from numbering with:

```html
<!-- skip -->
```

Example:

```markdown
# Chapter

## Section

### Introduction <!-- skip -->

#### Details

### Next
```

Result:

```markdown
# 1. Chapter

## 1.1. Section

### Introduction <!-- skip -->

#### 1.1.1. Details

### 1.1.2. Next
```

### Behavior of `skip`

`skip` means:

> Do not assign a number to this heading, but keep its children in the logical hierarchy.

The skipped heading does **not** consume a number.

For example:

```markdown
# Chapter

## First

### Skipped <!-- skip -->

### Next
```

produces:

```markdown
# 1. Chapter

## 1.1. First

### Skipped <!-- skip -->

### 1.1.2. Next
```

The skipped heading itself is excluded from numbering, but it does not create a new logical level.

### Existing numbering on skipped headings

A skipped heading is left untouched.

For example:

```markdown
# Root

## Section

### 4.2. Custom Heading <!-- skip -->

#### Child
```

remains:

```markdown
# 1. Root

## 1.1. Section

### 4.2. Custom Heading <!-- skip -->

#### 1.1.1. Child
```

This allows a skipped heading to use its own manually maintained numbering.

---

## Skipping an Entire Subtree

Use:

```html
<!-- skip-all -->
```

when an entire heading subtree should be excluded from automatic numbering.

Example:

```markdown
# Project

## Introduction

### Background

## Appendix <!-- skip-all -->

### Appendix A

#### Details

## Conclusion
```

Result:

```markdown
# 1. Project

## 1.1. Introduction

### 1.1.1. Background

## Appendix <!-- skip-all -->

### Appendix A

#### Details

## 1.2. Conclusion
```

Everything below the `skip-all` heading remains untouched until the document reaches a heading at the same or higher physical level.

### `skip-all` does not consume a number

The skipped subtree does not affect the numbering of later siblings.

For example:

```markdown
# Root

## First

## Ignored <!-- skip-all -->

### Ignored child

## Second
```

produces:

```markdown
# 1. Root

## 1.1. First

## Ignored <!-- skip-all -->

### Ignored child

## 1.2. Second
```

---

## `skip` vs `skip-all`

The two rules have different meanings.

| Rule       | Current heading | Children | Consumes number |
| ---------- | --------------- | -------- | --------------- |
| No rule    | Numbered        | Normal   | Yes             |
| `skip`     | Unnumbered      | Included | No              |
| `skip-all` | Unnumbered      | Excluded | No              |

Use `skip` when only the current heading should remain manually controlled.

Use `skip-all` when the entire section should be manually controlled.

---

## Fenced Code Blocks

Headings inside fenced code blocks are ignored.

Both backtick and tilde fences are supported.

Example:

````markdown
# Real Heading

```md
# Fake Heading

## Fake Section

### Fake Child
```

## Real Section
````

Result:

````markdown
# 1. Real Heading

```md
# Fake Heading

## Fake Section

### Fake Child
```

## 1.1. Real Section
````

The headings inside the code block are not considered part of the document hierarchy.

### Tilde fences

Tilde fences are also ignored:

```markdown
# Real Heading
```

# Fake Heading

## Fake Section

```

## Real Section
```

Only the real Markdown headings are processed.

---

## HTML Comments

Headings inside multiline HTML comments are ignored.

Example:

```markdown
<!--
# Old Project

## Old Section

### Old Details
-->

# Real Project

## Real Section

### Real Details
```

Result:

```markdown
<!--
# Old Project

## Old Section

### Old Details
-->

# 1. Real Project

## 1.1. Real Section

### 1.1.1. Real Details
```

This is useful for keeping alternative outlines, examples, drafts, or manually numbered sections in the document without having the extension modify them.

### Inline HTML comments on headings

An HTML comment at the end of a real heading is still processed when it is an extension rule.

For example:

```markdown
# Introduction <!-- skip -->
```

is recognized as a real heading with the `skip` rule.

This is intentionally different from a multiline HTML comment block.

---

## Removing Numbering

The remove command follows the same protection rules as the numbering command.

It does **not** modify headings inside:

- fenced code blocks
- multiline HTML comments
- `skip` headings
- `skip-all` subtrees

For example:

````markdown
# 1. Real Heading

```md
# 99. Example

## 99.1. Example section
```
````

## 1. Real Section

````

becomes:

```markdown
# Real Heading

```md
# 99. Example
## 99.1. Example section
````

## Real Section

````

The numbers inside the fenced code block remain unchanged.

---

## Existing Numbering

Running the numbering command on an already numbered document recalculates the numbers.

This means stale numbering is corrected automatically.

Input:

```markdown
# 99. Root
## 99.99. Old Section
### 99.99.99. Old Child

# 100. Root
````

Result:

```markdown
# 1. Root

## 1.1. Old Section

### 1.1.1. Old Child

# 2. Root
```

The existing numbers are treated as generated numbering rather than as authoritative numbering.

---

## Numbering Format

Generated numbers use a trailing dot:

```text
1.
1.1.
1.1.1.
1.1.1.1.
```

For example:

```markdown
# 1. Chapter

## 1.1. Section

### 1.1.1. Topic
```

Multi-digit numbers are supported:

```markdown
## 1.10. Section 10

## 1.11. Section 11

## 1.12. Section 12
```

---

## Important: Numbers That Look Like Generated Numbers

The extension recognizes a heading number when the heading begins with this pattern:

```text
number(s) followed by a dot and whitespace
```

For example:

```markdown
# 1. Introduction

# 1.2. Installation

# 2026. Project Roadmap
```

The last example is important.

Because:

```markdown
# 2026. Project Roadmap
```

matches the same syntactic pattern as generated numbering, the extension will interpret `2026.` as a heading number and may remove or replace it when numbering is applied.

Therefore, **do not use a heading beginning with a standalone numeric value followed by a period and whitespace if that number is intended to be part of the heading title.**

For example, this:

```markdown
# 2026. Important Information
```

can be interpreted as existing numbering.

If `2026` is intended to be part of the title, prefer:

```markdown
# 2026 - Important Information
```

or:

```markdown
# 2026 Important Information
```

or another format that does not match the generated numbering pattern.

### Why?

The extension intentionally recognizes patterns such as:

```text
1.
1.2.
1.10.
99.99.
2026.
```

as possible existing heading numbers.

The extension cannot distinguish syntactically between:

```text
# 2026. Project Roadmap
```

and:

```text
# 2026. Important Information
```

because both have the same structure.

---

## Multiple Root Sections

Numbering continues across multiple H1 sections.

Example:

```markdown
# First

## Section

# Second

## Section

# Third

## Section
```

produces:

```markdown
# 1. First

## 1.1. Section

# 2. Second

## 2.1. Section

# 3. Third

## 3.1. Section
```

Numbering does not restart at each H1.

The same behavior applies when `startLevel` is greater than `1`.

---

## Combining `startLevel` with Skip Rules

The `startLevel` setting and skip rules work together.

For example, with:

```json
"md-numbering.startLevel": 2
```

and:

```markdown
# Project

## Section

### Skipped <!-- skip -->

#### Details

### Next
```

the result is:

```markdown
# Project

## 1. Section

### Skipped <!-- skip -->

#### 1.1. Details

### 1.2. Next
```

The skipped heading does not consume a number.

---

## What the Extension Does Not Process

The extension only recognizes ATX-style Markdown headings from H1 through H6:

```markdown
# H1

## H2

### H3

#### H4

##### H5

###### H6
```

A line with seven or more `#` characters is not treated as a heading by the extension:

```markdown
####### Not a heading
```

Such lines remain unchanged.

---

## Recommended Usage

A typical document might look like this:

```markdown
# Project

## Introduction

### Background

### Goals

## Implementation

### Architecture

#### Components

#### Data Flow

## Appendix <!-- skip-all -->

### Manually numbered material
```

After running **Markdown Numbering: Add Heading Numbers**, it becomes:

```markdown
# 1. Project

## 1.1. Introduction

### 1.1.1. Background

### 1.1.2. Goals

## 1.2. Implementation

### 1.2.1. Architecture

#### 1.2.1.1. Components

#### 1.2.1.2. Data Flow

## Appendix <!-- skip-all -->

### Manually numbered material
```

The appendix remains completely under manual control.

---

## Development

This project is written in TypeScript.

### Install dependencies

```bash
pnpm install
```

### Compile

```bash
pnpm compile
```

### Run tests

```bash
pnpm test
```

### Run tests in watch mode

```bash
pnpm test:watch
```

### Compile in watch mode

```bash
pnpm watch
```

---

## Project Structure

The extension is divided into small modules, each responsible for one part of the numbering process.

```text
src/
├── extension.ts
├── parser.ts
├── hierarchy.ts
├── numbering.ts
├── renderer.ts
├── remove.ts
├── rules.ts
└── types.ts
```

### `extension.ts`

Registers the VS Code commands and connects the document-processing pipeline.

### `parser.ts`

Reads the Markdown document and identifies headings.

It also ignores:

- fenced code blocks
- multiline HTML comments

and recognizes numbering rules such as:

```html
<!-- skip -->
```

and:

```html
<!-- skip-all -->
```

### `hierarchy.ts`

Builds the logical heading hierarchy.

This is what allows the extension to correctly handle missing physical heading levels and skipped headings.

### `numbering.ts`

Assigns logical numbers according to the configured `startLevel`.

### `renderer.ts`

Applies the calculated numbers back to the original Markdown document while preserving the original document structure.

### `remove.ts`

Removes generated heading numbers while protecting:

- fenced code blocks
- HTML comments
- `skip` headings
- `skip-all` subtrees

### `rules.ts`

Contains the logic for recognizing and removing heading numbering and rule comments.

### `types.ts`

Contains the shared TypeScript types used by the extension.

---

## Testing

The project contains unit tests covering normal numbering and edge cases.

The test suite covers:

- normal H1-H6 numbering
- `startLevel`
- missing physical heading levels
- multiple root sections
- multi-digit numbers
- existing numbering
- `skip`
- `skip-all`
- consecutive skips
- skip-all boundaries
- fenced code blocks
- HTML comments
- invalid H7 headings
- empty and non-heading lines
- removal of generated numbering
- idempotent numbering
- idempotent removal
- combinations of existing numbering and skip rules

Run the complete test suite with:

```bash
pnpm test
```

---

## Design Principles

The extension follows a few important principles.

### Preserve user-controlled sections

`skip` and `skip-all` exist specifically so users can maintain their own numbering or formatting in selected sections.

### Never modify code examples

Fenced code blocks are treated as content, not as Markdown structure.

### Never modify commented-out Markdown

Multiline HTML comments can contain complete Markdown examples or old document structures and are therefore left untouched.

### Separate physical and logical hierarchy

The Markdown heading level determines the physical structure, while the extension uses a logical hierarchy for numbering.

This allows documents with missing intermediate heading levels to still receive consistent numbering.

### Recalculate instead of trusting existing numbers

Existing generated-looking numbers are removed and recalculated so that the numbering remains correct after headings are added, removed, reordered, or skipped.

---

## License

This project is licensed under the MIT License.

---

## About

Markdown Numbering is an open-source project created and maintained by **DXWIZ**.

Learn more about DXWIZ at **[dxwiz.com](https://dxwiz.com)**.

For questions or support, visit our **[Contact page](https://dxwiz.com/contact)**.
