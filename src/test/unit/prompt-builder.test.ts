import { describe, it, expect } from "vitest";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai/prompt-builder";
import { defaultKnowledgeBase } from "@/lib/kb/knowledge-base";
import { defaultUpsellEngine } from "@/lib/kb/upsell-rules";

describe("PromptBuilder Unit Tests", () => {
  it("should generate system prompt with JSON schema requirements and role", () => {
    const systemPrompt = buildSystemPrompt();
    expect(systemPrompt).toContain("О-комплекс");
    expect(systemPrompt).toContain("clientResponse");
    expect(systemPrompt).toContain("managerUpsell");
    expect(systemPrompt).toContain("ТОЛЬКО ЧИСТЫЙ JSON");
  });

  it("should generate user prompt containing client message, lead details and matched KB", () => {
    const articles = defaultKnowledgeBase.search("1С", 1);
    const rule = defaultUpsellEngine.getAllRules()[0];

    const userPrompt = buildUserPrompt({
      clientMessage: "Нужна синхронизация остатков с 1С",
      conversationHistory: [
        { sender: "client", text: "Привет" },
        { sender: "manager", text: "Здравствуйте, чем помочь?" },
      ],
      leadContext: {
        id: "12345",
        name: "Сделка #12345",
        stageName: "Переговоры",
        budget: 50000,
        contactName: "Иван Иванов",
      },
      relevantArticles: articles,
      suggestedUpsellRule: rule,
    });

    expect(userPrompt).toContain("Нужна синхронизация остатков с 1С");
    expect(userPrompt).toContain("Сделка: Сделка #12345");
    expect(userPrompt).toContain("Иван Иванов");
    expect(userPrompt).toContain(rule.targetProduct);
  });
});
