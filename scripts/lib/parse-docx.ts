import { readFile } from "node:fs/promises";
import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true,
  trimValues: true,
});

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getParagraphText(paragraph: Record<string, unknown>): string {
  const runs = asArray(paragraph.r as Record<string, unknown> | Record<string, unknown>[]);
  let text = "";

  for (const run of runs) {
    const runText = run.t;
    if (typeof runText === "string") {
      text += runText;
      continue;
    }

    if (runText && typeof runText === "object") {
      const textNode = runText as Record<string, unknown>;
      if (typeof textNode["#text"] === "string") {
        text += textNode["#text"];
      }
    }
  }

  return text;
}

function normalizeLine(line: string) {
  return line.replace(/\u00a0/g, " ").trim();
}

export async function readDocxText(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  const zip = await JSZip.loadAsync(buffer);
  const documentFile = zip.file("word/document.xml");

  if (!documentFile) {
    throw new Error("Invalid .docx file: missing word/document.xml");
  }

  const documentXml = await documentFile.async("string");
  const document = xmlParser.parse(documentXml) as {
    document?: { body?: Record<string, unknown> };
  };

  const body = document.document?.body;
  if (!body) {
    throw new Error("Invalid .docx file: missing document body");
  }

  const paragraphs = asArray(body.p as Record<string, unknown> | Record<string, unknown>[]);
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const text = normalizeLine(getParagraphText(paragraph));
    if (text) {
      lines.push(text);
    }
  }

  if (lines.length === 0) {
    throw new Error("The document has no readable text.");
  }

  return lines.join("\n");
}
