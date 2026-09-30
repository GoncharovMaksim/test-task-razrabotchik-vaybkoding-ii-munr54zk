import { describe, it, expect } from "vitest";
import { KnowledgeBaseService, KNOWLEDGE_BASE_ARTICLES } from "@/lib/kb/knowledge-base";

describe("KnowledgeBaseService Unit Tests", () => {
  const kbService = new KnowledgeBaseService(KNOWLEDGE_BASE_ARTICLES);

  it("should return all articles", () => {
    const articles = kbService.getAll();
    expect(articles.length).toBeGreaterThanOrEqual(5);
    expect(articles[0]).toHaveProperty("id");
    expect(articles[0]).toHaveProperty("title");
    expect(articles[0]).toHaveProperty("pricing");
  });

  it("should find an article by id", () => {
    const article = kbService.getById("kb-1c-sync");
    expect(article).toBeDefined();
    expect(article?.title).toContain("1С");
  });

  it("should return undefined for non-existent id", () => {
    const article = kbService.getById("non-existent-id");
    expect(article).toBeUndefined();
  });

  it("should rank 1C integration highest for '1C остатки склада и номенклатура'", () => {
    const results = kbService.search("1C остатки склада и номенклатура", 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe("kb-1c-sync");
    expect(results[0].relevanceScore).toBeGreaterThan(0);
  });

  it("should rank AI bot highest for 'ночные заявки бот в телеграм'", () => {
    const results = kbService.search("ночные заявки бот в телеграм", 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe("kb-ai-bot-qualifier");
  });

  it("should rank telephony highest for 'входящие звонки запись разговоров mango'", () => {
    const results = kbService.search("входящие звонки запись разговоров mango", 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe("kb-telephony-integration");
  });

  it("should return default top articles on empty or whitespace search", () => {
    const resultsEmpty = kbService.search("", 2);
    expect(resultsEmpty.length).toBe(2);

    const resultsWhitespace = kbService.search("   ", 3);
    expect(resultsWhitespace.length).toBe(3);
  });
});
