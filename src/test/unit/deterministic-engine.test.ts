import { describe, it, expect } from "vitest";
import { DeterministicEngine } from "@/lib/ai/deterministic-engine";
import { defaultKnowledgeBase } from "@/lib/kb/knowledge-base";
import { defaultUpsellEngine } from "@/lib/kb/upsell-rules";

describe("DeterministicEngine Unit Tests", () => {
  const engine = new DeterministicEngine();

  it("should generate a complete two-block response for client inquiry", () => {
    const clientMessage = "Сколько стоит внедрение AmoCRM и 1С?";
    const matchedArticles = defaultKnowledgeBase.search(clientMessage, 2);
    const upsellMatch = defaultUpsellEngine.matchRule(clientMessage);

    const response = engine.generate({
      clientMessage,
      matchedArticles,
      upsellMatch,
    });

    expect(response.success).toBe(true);
    // Block 1: Client Response
    expect(response.clientResponse).toBeDefined();
    expect(response.clientResponse.text).toContain("Здравствуйте!");
    expect(response.clientResponse.callToAction.length).toBeGreaterThan(5);
    expect(response.clientResponse.matchedArticles.length).toBeGreaterThan(0);

    // Block 2: Manager Upsell
    expect(response.managerUpsell).toBeDefined();
    expect(response.managerUpsell.recommendedProduct).toBeDefined();
    expect(response.managerUpsell.suggestedPitch.length).toBeGreaterThan(10);
    expect(response.managerUpsell.estimatedPriceIncrease).toContain("₽");

    // Metadata
    expect(response.metadata.providerUsed).toBe("deterministic");
    expect(response.metadata.latencyMs).toBeGreaterThanOrEqual(1);
  });
});
