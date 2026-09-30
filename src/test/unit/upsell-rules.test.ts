import { describe, it, expect } from "vitest";
import { UpsellEngineService, UPSELL_TRIGGER_RULES } from "@/lib/kb/upsell-rules";

describe("UpsellEngineService Unit Tests", () => {
  const engine = new UpsellEngineService(UPSELL_TRIGGER_RULES);

  it("should return all registered upsell rules", () => {
    const rules = engine.getAllRules();
    expect(rules.length).toBeGreaterThanOrEqual(4);
  });

  it("should trigger AI bot upsell when client mentions losing leads on weekends or nights", () => {
    const match = engine.matchRule("Мы теряем заявки ночью и по выходным, менеджеры не успевают отвечать");
    expect(match.rule.targetProduct).toContain("AI-бот");
    expect(match.confidence).toBeGreaterThan(0.7);
    expect(match.matchedKeywords).toContain("выходн");
  });

  it("should trigger 1C upsell when client asks about invoices and accounting", () => {
    const match = engine.matchRule("Хотим выставлять счета и синхронизировать оплаты из 1С");
    expect(match.rule.targetProduct).toContain("1С");
    expect(match.matchedKeywords.length).toBeGreaterThan(0);
  });

  it("should trigger telephony upsell when client wants base pipeline setup", () => {
    const match = engine.matchRule("Нужно базовое внедрение AmoCRM и настройка воронки");
    expect(match.rule.targetProduct).toContain("телефонии");
  });

  it("should fallback gracefully with a valid rule if no keywords matched", () => {
    const match = engine.matchRule("добрый день");
    expect(match.rule).toBeDefined();
    expect(match.confidence).toBeGreaterThan(0.5);
  });
});
