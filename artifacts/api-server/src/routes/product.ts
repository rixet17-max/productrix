import { Router, type IRouter } from "express";
import { SearchProductBody, SearchProductResponse } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

router.post("/product/search", async (req, res) => {
  try {
    const body = SearchProductBody.parse(req.body);
    const { productName } = body;

    const systemPrompt = `You are a global trade and market intelligence expert. When given a product name, you research and return accurate, comprehensive market intelligence data.

You must return a JSON object with this exact structure:
{
  "productName": "<official product name>",
  "producers": [
    { "name": "<company name>", "country": "<country>", "description": "<brief description of their role/scale>" }
  ],
  "distributors": [
    { "name": "<company name>", "country": "<country>", "description": "<brief description of their distribution network>" }
  ],
  "exportingCountries": [
    { "name": "<country>", "value": "<export value with unit e.g. $12.5B or 45M tonnes>", "percentage": "<% of global exports>" }
  ],
  "importingCountries": [
    { "name": "<country>", "value": "<import value with unit>", "percentage": "<% of global imports>" }
  ],
  "globalStats": {
    "globalProduction": "<total global production with unit>",
    "grossExportation": "<total global exports value with unit>",
    "grossImportation": "<total global imports value with unit>",
    "averagePrice": "<average price per unit>"
  },
  "dataYear": "<year or year range of the data, e.g. 2023 or 2022-2023>"
}

Rules:
- Include at least 5-8 producers, 5-8 distributors, 8-10 exporting countries, and 8-10 importing countries
- Use real, well-known companies and actual trade data
- Use realistic, accurate figures based on your knowledge
- For commodities, focus on commodity traders and trading companies as distributors
- For manufactured goods, focus on wholesale distributors and major retailers
- Always provide actual numeric values for the globalStats fields
- Return ONLY the JSON object, no markdown, no explanation`;

    const userPrompt = `Research and provide comprehensive market intelligence for: ${productName}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 4096,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      res.status(500).json({ error: "No response from AI" });
      return;
    }

    let parsed: unknown;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      res.status(500).json({ error: "Failed to parse AI response as JSON" });
      return;
    }

    const result = SearchProductResponse.parse(parsed);
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    console.error("Product search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
