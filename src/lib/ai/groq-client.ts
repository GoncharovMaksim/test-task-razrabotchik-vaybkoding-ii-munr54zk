import { buildSystemPrompt, buildUserPrompt, PromptContext } from "./prompt-builder";

export interface GroqConfig {
  apiKey?: string;
  model?: string;
  timeoutMs?: number;
}

export interface ParsedAiOutput {
  clientResponse: {
    text: string;
    tone: "polite_consultative" | "professional" | "informative";
    callToAction: string;
  };
  managerUpsell: {
    recommendedProduct: string;
    triggerFound: string;
    reasoning: string;
    suggestedPitch: string;
    estimatedPriceIncrease: string;
  };
}

export class GroqClient {
  private apiKey: string;
  private model: string;
  private timeoutMs: number;

  constructor(config?: GroqConfig) {
    this.apiKey =
      config?.apiKey ||
      process.env.GROQ_API_KEY ||
      "";
    this.model = config?.model || process.env.AI_MODEL_GROQ || "qwen/qwen3.8-27b";
    this.timeoutMs = config?.timeoutMs || 12000;
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.startsWith("gsk_"));
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
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 1024,
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API returned ${response.status}: ${errorText}`);
      }

      const rawJson = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      const content = rawJson.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Groq API returned empty content in choices");
      }

      const parsed = this.cleanAndParseJson(content);
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
