# Contributing

Thank you for your interest in contributing to Markdown Numbering.

This document explains how to set up the project, run the extension locally, execute tests, and safely make changes.

## Prerequisites

Before contributing, make sure you have:

- [Node.js](https://nodejs.org/) installed.
- [pnpm](https://pnpm.io/) installed.
- [Visual Studio Code](https://code.visualstudio.com/) installed.

The project is written in TypeScript and uses Vitest for unit testing.

## Getting Started

Clone the repository and install the dependencies:

```bash
pnpm install
```

Then compile the project:

```bash
pnpm compile
```

A successful compilation should complete without TypeScript errors.

## Development Commands

### Compile

Compile the TypeScript source:

```bash
pnpm compile
```

### Watch Mode

Automatically recompile when source files change:

```bash
pnpm watch
```

### Run Tests

Run the complete test suite once:

```bash
pnpm test
```

### Test Watch Mode

Run Vitest in watch mode:

```bash
pnpm test:watch
```

## Project Structure

The main source files are located in `src/`:

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

Tests are located in `test/`.

```text
test/
├── numbering.test.ts
└── numbering.edge-cases.test.ts
```

## Development Flow

The heading-numbering operation follows this general flow:

```text
Markdown document
       │
       ▼
    parser
       │
       ▼
Heading objects
       │
       ▼
logical hierarchy
       │
       ▼
number assignment
       │
       ▼
Markdown renderer
       │
       ▼
Updated document
```

The remove operation uses its own document scan while applying the same protection rules for fenced code blocks, HTML comments, `skip`, and `skip-all`.

## Making Changes

When changing the behavior of the extension:

1. Identify the module responsible for the behavior.
2. Update the implementation.
3. Add or update tests covering the behavior.
4. Run the complete test suite.
5. Compile the extension.
6. Review the resulting Markdown behavior manually when appropriate.

For example, if changing heading parsing, tests should be added to verify both the new behavior and existing behavior that must remain unchanged.

## Tests Are Required for Behavior Changes

Changes that affect Markdown parsing, hierarchy, numbering, skipping, or removal should include corresponding tests.

Important behaviors that should remain covered include:

- H1-H6 headings
- missing physical heading levels
- `startLevel`
- existing numbering
- multi-digit numbering
- `skip`
- `skip-all`
- fenced code blocks
- HTML comments
- multiple root sections
- removal of generated numbering
- idempotent numbering
- idempotent removal

When fixing a bug, preferably add a regression test that reproduces the bug before or together with the fix.

## Important Rules

### Do not modify fenced code blocks

Headings inside fenced code blocks are examples/content and must not be processed as document headings.

Both backtick and tilde fences are supported.

### Do not modify multiline HTML comments

Markdown inside multiline HTML comments must remain untouched.

### Preserve `skip`

A heading containing:

```html
<!-- skip -->
```

must remain unnumbered, while its children continue to participate in the logical hierarchy.

### Preserve `skip-all`

A heading containing:

```html
<!-- skip-all -->
```

and its entire subtree must remain untouched.

### Preserve manually controlled numbering

Skipped and skip-all headings may contain their own numbering. Automatic numbering must not overwrite it.

## Adding a New Rule

If a new heading rule is introduced, consider all of the following:

- How the parser recognizes the rule.
- Whether the rule affects the logical hierarchy.
- Whether the rule affects number assignment.
- Whether the renderer should modify the heading.
- Whether the remove command should respect the rule.
- How the rule interacts with fenced code blocks.
- How the rule interacts with HTML comments.
- How the rule interacts with existing numbering.
- Whether the rule needs documentation in `README.md`.

Add tests for the normal case and relevant edge cases.

## Running the Full Verification

Before considering a change complete, run:

```bash
pnpm compile
pnpm test
```

Both commands should succeed.

## VS Code Extension Development

To run and debug the extension locally:

1. Open the project in Visual Studio Code.
2. Install dependencies with `pnpm install`.
3. Compile with `pnpm compile`.
4. Open the Run and Debug view.
5. Start the extension development host configuration if one is provided by the project.
6. Open a Markdown file in the Extension Development Host.
7. Run the Markdown Numbering commands from the Command Palette.

When debugging changes to the extension, make sure the compiled output in `dist/` reflects the latest TypeScript source.

## Adding Tests

Tests use Vitest.

A typical test follows this structure:

```typescript
it("describes the expected behavior", () => {
  const input = `# Root
## Section`;

  const expected = `# 1. Root
## 1.1. Section`;

  expect(numberMarkdown(input)).toBe(expected);
});
```

Tests should describe behavior rather than implementation details.

Prefer clear test names such as:

```text
ignores headings inside fenced code blocks
skip-all excludes its entire subtree
recomputes existing numbering instead of preserving stale numbers
```

rather than names tied to internal variable names or implementation techniques.

## Pull Requests

Before submitting a pull request:

- Keep the change focused.
- Add tests for behavior changes.
- Update documentation when user-visible behavior changes.
- Run `pnpm compile`.
- Run `pnpm test`.
- Review the final diff for unrelated changes.
- Ensure generated or local-only files are not accidentally committed.

In the pull request description, briefly explain:

- What changed.
- Why it changed.
- How it was tested.
- Any behavior or compatibility considerations.

## Documentation

User-visible behavior should be documented in `README.md`.

If a new feature changes how numbering, skipping, removal, or configuration works, update the README together with the implementation and tests.

## Code Style

Keep the existing TypeScript style consistent with the project.

Prefer:

- small focused functions
- explicit types where useful
- clear variable names
- comments for non-obvious logic
- deterministic behavior
- tests for edge cases

Avoid unrelated refactoring when making a focused bug fix or feature change.

## Reporting Bugs

When reporting a bug, include a minimal Markdown example that reproduces the problem.

For example:

```markdown
# Root

## Section <!-- skip -->

### Child
```

Also include:

- expected output
- actual output
- relevant configuration such as `md-numbering.startLevel`
- whether the issue occurs with the Add or Remove command
- whether the Markdown contains fenced code blocks or HTML comments

A minimal reproduction makes parsing and numbering issues much easier to diagnose.

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License.
