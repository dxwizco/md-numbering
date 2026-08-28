// src/remove.ts

const GENERATED_NUMBER_REGEX = /^\d+(?:\.\d+)*\.\s+/;

export function removeNumbering(markdown: string): string {
  const lines = markdown.split(/\r?\n/);

  return lines
    .map((line) => {
      const match = line.match(/^(#{1,6})([ \t]+)(.+)$/);

      if (!match) {
        return line;
      }

      const hashes = match[1];
      const spacing = match[2];
      const content = match[3];

      const cleaned = content.replace(GENERATED_NUMBER_REGEX, "");

      return `${hashes}${spacing}${cleaned}`;
    })
    .join("\n");
}
