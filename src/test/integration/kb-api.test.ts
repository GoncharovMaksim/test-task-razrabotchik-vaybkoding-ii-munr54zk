import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/kb/route";
import { NextRequest } from "next/server";

describe("API /api/kb Integration Tests", () => {
  it("should return all articles and upsell rules by default", async () => {
    const req = new NextRequest("http://localhost:3000/api/kb");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.articles.length).toBeGreaterThan(0);
    expect(json.data.upsellRules.length).toBeGreaterThan(0);
    expect(json.data.totalArticles).toBe(json.data.articles.length);
  });

  it("should filter articles when query param 'q' is provided", async () => {
    const req = new NextRequest("http://localhost:3000/api/kb?q=1с");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.articles.length).toBeGreaterThan(0);
    expect(json.data.articles[0].id).toBe("kb-1c-sync");
  });

  it("should filter by type=articles", async () => {
    const req = new NextRequest("http://localhost:3000/api/kb?type=articles");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.articles.length).toBeGreaterThan(0);
    expect(json.data.upsellRules.length).toBe(0);
  });
});
