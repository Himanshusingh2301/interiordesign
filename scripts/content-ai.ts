import { readFile } from "node:fs/promises";
import { homePageSchema } from "../src/content/schemas";
import { generatePageJsonWithAi } from "./lib/generate-json-with-ai";
import { readDocxText } from "./lib/parse-docx";
import { resolveFromRoot, writeJsonFile } from "./lib/paths";

const HOME_JSON_PATH = "src/content/pages/home.json";
const SCHEMA_PATH = "src/content/schemas.ts";

async function main() {
  const [, , docPath] = process.argv;

  if (!docPath) {
    console.error("Usage: npm run content:ai -- <path-to-docx>");
    console.error("Example: npm run content:ai -- content-source/home.docx");
    process.exit(1);
  }

  const absoluteDocPath = resolveFromRoot(docPath);
  const outputJsonPath = resolveFromRoot(HOME_JSON_PATH);
  const documentText = await readDocxText(absoluteDocPath);
  const schemaText = await readFile(resolveFromRoot(SCHEMA_PATH), "utf8");

  const aiJson = await generatePageJsonWithAi({
    pageId: "home",
    schemaText,
    documentText,
  });

  const validated = homePageSchema.parse(aiJson);

  await writeJsonFile(outputJsonPath, validated);

  console.log(`Wrote ${HOME_JSON_PATH} from ${docPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
