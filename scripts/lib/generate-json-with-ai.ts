type GeneratePageJsonInput = {
  pageId: string;
  schemaText: string;
  documentText: string;
};

type OpenAiResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

function extractJsonText(content: string) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced?.[1] ?? content).trim();
}

export async function generatePageJsonWithAi(input: GeneratePageJsonInput) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to the .env file in the project root (see .env.example).",
    );
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const systemPrompt = [
    "You convert page document content into JSON for an Astro website.",
    "Return one JSON object only. No markdown fences. No commentary.",
    "Follow the Zod schema in the user message exactly.",
    "Map document text to the matching schema fields using section labels and context when present.",
    "Omit image fields unless the document supplies usable image URLs or paths.",
  ].join(" ");

  const userPrompt = [
    `Page id: ${input.pageId}`,
    "",
    "Schema source (TypeScript / Zod):",
    input.schemaText,
    "",
    "Document:",
    input.documentText,
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  const payload = (await response.json()) as OpenAiResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message ?? `OpenAI request failed with status ${response.status}`);
  }

  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return JSON.parse(extractJsonText(content)) as Record<string, unknown>;
}
