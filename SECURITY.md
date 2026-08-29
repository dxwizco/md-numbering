# Security Policy

## Supported Versions

Security fixes are generally applied to the latest released version of Markdown Numbering.

| Version        | Supported |
| -------------- | --------- |
| Latest release | Yes       |
| Older releases | No        |

## Reporting a Security Issue

If you discover a potential security vulnerability in Markdown Numbering, please report it privately rather than opening a public issue.

When reporting a security issue, include:

- A description of the vulnerability.
- Steps to reproduce the issue.
- A minimal example or proof of concept, when applicable.
- The affected version.
- The expected behavior.
- The actual behavior.
- Any relevant environment information.

Please do not include passwords, access tokens, private documents, or other sensitive information in a report.

## What to Expect

Security reports will be reviewed as soon as reasonably possible.

If the issue is confirmed, an appropriate fix will be developed and released when practical. The vulnerability and its resolution may be documented in the project's changelog or release notes.

## Scope

Markdown Numbering is a local VS Code extension that processes Markdown documents.

The extension's primary operations are:

- Reading the contents of the active Markdown document.
- Calculating heading hierarchy and numbering.
- Updating the active document when the user invokes an extension command.
- Removing generated heading numbering when requested.

The extension does not require access to external services for its core numbering functionality.

## Responsible Disclosure

Please allow reasonable time for a security issue to be investigated and addressed before publicly disclosing technical details.

Thank you for helping keep Markdown Numbering and its users safe.
