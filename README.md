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

---

Specification For numbering:

1. Normal heading → consumes a number.
2. <!-- skip --> → heading gets no number and consumes no number.
3. <!-- skip-all --> → heading and all descendants get no numbers and consume no numbers.
4. H7+ → not a heading.
5. Existing numbering should be replaced/recomputed.
6. Original line endings and trailing whitespace should be preserved.
7. Headings inside comments should not be considered Ex: <!-- any thing here not to consider  -->

---

Three ways to control startLevel:

1. Local/library usage — pass startLevel directly to the numbering engine.
2. VS Code user setting — applies globally to the user's VS Code.
3. VS Code workspace setting — overrides the global setting for a particular project.

The important part is that VS Code settings are only an input mechanism. The actual numbering engine remains independent.

How to publish:
https://chatgpt.com/s/t_6a91df83500c81918b5cbbf1e79c96c0
