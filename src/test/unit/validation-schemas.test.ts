import { describe, it, expect } from "vitest";
import {
  AssistRequestSchema,
  AssistResponseSchema,
  AmoCrmWebhookSchema,
} from "@/lib/validation/schemas";

describe("Validation Schemas Unit Tests", () => {
  it("should validate a correct AssistRequest", () => {
    const valid = {
      clientMessage: "Подскажите условия по базовому внедрению AmoCRM",
      leadContext: {
        id: "9912",
        budget: 50000,
        stage: "new",
      },
      preferredProvider: "auto",
    };

    const res = AssistRequestSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("should reject AssistRequest with empty or too short message", () => {
    const invalid = { clientMessage: "a" };
    const res = AssistRequestSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("should validate a complete AssistResponse structure", () => {
    const valid = {
      success: true,
      clientResponse: {
        text: "Добрый день! Рады помочь с внедрением.",
        tone: "polite_consultative",
        callToAction: "Сколько пользователей будет в системе?",
        matchedArticles: [{ id: "kb-1", title: "Тест", relevanceScore: 0.9 }],
      },
      managerUpsell: {
        recommendedProduct: "Пакет телефонии",
        triggerFound: "внедрение с нуля",
        reasoning: "Позволит избежать потери звонков",
        suggestedPitch: "Давайте сразу настроим телефонию?",
        estimatedPriceIncrease: "+25 000 ₽",
        confidenceScore: 0.85,
      },
      metadata: {
        providerUsed: "groq",
        modelUsed: "qwen/qwen3.8-27b",
        latencyMs: 140,
        timestamp: new Date().toISOString(),
      },
    };

    const res = AssistResponseSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("should validate a valid AmoCRM webhook payload", () => {
    const webhook = {
      event: "message.received",
      lead_id: "lead_123",
      message: {
        id: "msg_456",
        text: "Вопрос по интеграции",
        author: "client",
        created_at: 1727670000,
      },
    };

    const res = AmoCrmWebhookSchema.safeParse(webhook);
    expect(res.success).toBe(true);
  });

  it("should reject AmoCRM webhook with missing message text", () => {
    const invalidWebhook = {
      lead_id: "lead_123",
      message: {
        text: "",
      },
    };

    const res = AmoCrmWebhookSchema.safeParse(invalidWebhook);
    expect(res.success).toBe(false);
  });
});
