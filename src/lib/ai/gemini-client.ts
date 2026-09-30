import { buildSystemPrompt, buildUserPrompt, PromptContext } from "./prompt-builder";
import { ParsedAiOutput } from "./groq-client";

export interface GeminiConfig {
  apiKey?: string;
  model?: string;
  timeoutMs?: number;
}

export class GeminiClient {
  private apiKey: string;
  private model: string;
  private timeoutMs: number;

  constructor(config?: GeminiConfig) {
    this.apiKey =
      config?.apiKey ||
      process.env.GEMINI_API_KEY ||
      "";
    this.model = config?.model || process.env.AI_MODEL_GEMINI || "gemini-2.5-flash";
    this.timeoutMs = config?.timeoutMs || 12000;
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  public async generate(context: PromptContext): Promise<{
    data: ParsedAiOutput;
    model: string;
    latencyMs: number;
  }> {
    const startTime = performance.now();
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(context);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error ${response.status}: ${errorText}`);
      }

      const rawJson = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const rawText = rawJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error("Gemini returned empty candidate content");
      }

      const parsed = this.cleanAndParseJson(rawText);
      const latencyMs = Math.round(performance.now() - startTime);

      return {
        data: parsed,
        model: this.model,
        latencyMs,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private cleanAndParseJson(raw: string): ParsedAiOutput {
    let clean = raw.trim();
    if (clean.startsWith("```json")) {
      clean = clean.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsed = JSON.parse(clean);

    return {
      clientResponse: {
        text: String(parsed.clientResponse?.text || "").trim(),
        tone: parsed.clientResponse?.tone || "polite_consultative",
        callToAction: String(parsed.clientResponse?.callToAction || "").trim(),
      },
      managerUpsell: {
        recommendedProduct: String(parsed.managerUpsell?.recommendedProduct || "").trim(),
        triggerFound: String(parsed.managerUpsell?.triggerFound || "").trim(),
        reasoning: String(parsed.managerUpsell?.reasoning || "").trim(),
        suggestedPitch: String(parsed.managerUpsell?.suggestedPitch || "").trim(),
        estimatedPriceIncrease: String(parsed.managerUpsell?.estimatedPriceIncrease || "+25 000 ₽ к чеку").trim(),
      },
    };
  }
}
