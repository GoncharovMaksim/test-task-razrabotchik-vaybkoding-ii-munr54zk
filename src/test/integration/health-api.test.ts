import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("API /api/health Integration Tests", () => {
  it("should return 200 with service health and knowledge base telemetry", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("healthy");
    expect(json.service).toBe("ocomplex-amocrm-ai-copilot");
    expect(json.uptime).toBeGreaterThanOrEqual(0);
    expect(json.knowledgeBase.articlesLoaded).toBeGreaterThan(0);
    expect(json.knowledgeBase.upsellRulesLoaded).toBeGreaterThan(0);
    expect(json.providers.deterministicReady).toBe(true);
  });
});
