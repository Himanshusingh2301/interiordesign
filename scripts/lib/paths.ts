import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const projectRoot = path.resolve(import.meta.dirname, "../..");

export function resolveFromRoot(...segments: string[]) {
  return path.join(projectRoot, ...segments);
}

export async function ensureDir(dirPath: string) {
  await mkdir(dirPath, { recursive: true });
}

export async function writeJsonFile(filePath: string, value: unknown) {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
