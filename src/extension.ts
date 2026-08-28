// src/extension.ts
import * as vscode from "vscode";
import { parseHeadings } from "./parser";
import { buildLogicalHierarchy } from "./hierarchy";
import { assignNumbers } from "./numbering";
import { renderNumberedMarkdown } from "./renderer";
import { removeNumbering } from "./remove";

export function activate(context: vscode.ExtensionContext) {
  const numberHeadings = vscode.commands.registerCommand(
    "md-numbering.numberHeadings",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      const document = editor.document;
      const markdown = document.getText();

      const headings = parseHeadings(markdown);
      const hierarchy = buildLogicalHierarchy(headings);

      const startLevel = vscode.workspace
        .getConfiguration("md-numbering")
        .get<number>("startLevel", 1);

      assignNumbers(hierarchy, { startLevel });

      const numberedMarkdown = renderNumberedMarkdown(markdown, hierarchy);

      if (numberedMarkdown === markdown) {
        return;
      }

      await editor.edit((editBuilder) => {
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(document.getText().length),
        );

        editBuilder.replace(fullRange, numberedMarkdown);
      });
    },
  );

  const removeNumberingCommand = vscode.commands.registerCommand(
    "md-numbering.removeNumbering",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      const document = editor.document;
      const markdown = document.getText();

      const cleanedMarkdown = removeNumbering(markdown);

      if (cleanedMarkdown === markdown) {
        return;
      }

      await editor.edit((editBuilder) => {
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(document.getText().length),
        );

        editBuilder.replace(fullRange, cleanedMarkdown);
      });
    },
  );

  context.subscriptions.push(numberHeadings, removeNumberingCommand);
}

export function deactivate() {}

// // Working

// import * as vscode from "vscode";
// import { parseHeadings } from "./parser";
// import { buildLogicalHierarchy } from "./hierarchy";
// import { assignNumbers } from "./numbering";
// import { renderNumberedMarkdown } from "./renderer";

// export function activate(context: vscode.ExtensionContext) {
//   const disposable = vscode.commands.registerCommand(
//     "md-numbering.numberHeadings",
//     async () => {
//       const editor = vscode.window.activeTextEditor;

//       if (!editor) {
//         return;
//       }

//       const document = editor.document;
//       const markdown = document.getText();

//       const headings = parseHeadings(markdown);
//       const hierarchy = buildLogicalHierarchy(headings);

//       assignNumbers(hierarchy);

//       const numberedMarkdown = renderNumberedMarkdown(markdown, hierarchy);

//       await editor.edit((editBuilder) => {
//         const fullRange = new vscode.Range(
//           document.positionAt(0),
//           document.positionAt(document.getText().length),
//         );

//         editBuilder.replace(fullRange, numberedMarkdown);
//       });
//     },
//   );

//   context.subscriptions.push(disposable);
// }

// export function deactivate() {}
