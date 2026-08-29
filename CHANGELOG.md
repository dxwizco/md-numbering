# Changelog

All notable changes to Markdown Numbering are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project follows [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-08-29

### Added

- Automatic Markdown heading numbering.
- Logical hierarchy-based numbering for H1-H6 headings.
- Configurable numbering start level through `md-numbering.startLevel`.
- Support for missing physical heading levels.
- Support for `<!-- skip -->`.
- Support for `<!-- skip-all -->`.
- Recalculation of existing heading numbers.
- Removal of generated heading numbers.
- Protection for fenced code blocks.
- Protection for multiline HTML comments.
- Support for multi-digit heading numbers.
- Continuous numbering across multiple root sections.
- Unit tests covering normal behavior and edge cases.
- VS Code commands for adding and removing heading numbers.

### Commands

- `Markdown Numbering: Add Heading Numbers`
- `Markdown Numbering: Remove Heading Numbers`

[0.1.0]: https://github.com/your-publisher-or-user/md-numbering/releases/tag/v0.1.0
