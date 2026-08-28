Rules:

1. **Numbering is based on the logical heading hierarchy**.
2. Physical heading levels may be missing.
3. `skip` removes only that heading from the logical hierarchy.
4. Children of `skip` attach to the nearest surviving logical ancestor.
5. `skip-all` removes the heading and its entire descendant subtree.
6. `skip-all` ends when a heading at the skipped heading's physical level or higher is encountered.
7. Only participating headings receive/increment numbering.
8. Generated numbers use a trailing dot:
   ```
   1.
   1.1.
   1.1.1.
   ```
9. Existing generated numbering should not be duplicated when numbering is run again.
10. Remove numbering should remove generated numbering.
11. `numberingStartLevel` **determines the first physical heading level that receives a number**.
12. Levels above `numberingStartLevel` can still participate in hierarchy but remain unnumbered.

Three ways to control startLevel:

    Local/library usage — pass startLevel directly to the numbering engine.
    VS Code user setting — applies globally to the user's VS Code.
    VS Code workspace setting — overrides the global setting for a particular project.

The important part is that VS Code settings are only an input mechanism. The actual numbering engine remains independent.
