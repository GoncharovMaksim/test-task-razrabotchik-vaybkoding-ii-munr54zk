import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/assist/route";
import { NextRequest } from "next/server";

describe("API /api/assist Integration Tests", () => {
  it("should process a valid client message and return 200 with two blocks", async () => {
    const payload = {
      clientMessage: "Сколько стоит настроить AmoCRM под ключ для отдела продаж?",
      preferredProvider: "deterministic",
    };

    const req = new NextRequest("http://localhost:3000/api/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.clientResponse).toBeDefined();
    expect(json.clientResponse.text).toBeTypeOf("string");
    expect(json.managerUpsell).toBeDefined();
    expect(json.managerUpsell.recommendedProduct).toBeTypeOf("string");
    expect(json.metadata.providerUsed).toBe("deterministic");
  });

  it("should return 400 when body is not valid JSON", async () => {
    const req = new NextRequest("http://localhost:3000/api/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid-json-string{",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain("Неверный формат JSON");
  });

  it("should return 422 when clientMessage is too short", async () => {
    const req = new NextRequest("http://localhost:3000/api/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientMessage: "x" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(422);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain("Ошибка валидации");
  });

  it("should handle full lead context and conversation history", async () => {
    const payload = {
      clientMessage: "Хорошо, а телефонию Mango к этому можно привязать?",
      conversationHistory: [
        { sender: "client", text: "Здравствуйте" },
        { sender: "manager", text: "Здравствуйте! Чем можем помочь?" },
      ],
      leadContext: {
        id: "7721",
        name: "Сделка #7721",
        contactName: "Павел",
        budget: 45000,
        stage: "in_progress",
        stageName: "Переговоры",
      },
      preferredProvider: "deterministic",
    };

    const req = new NextRequest("http://localhost:3000/api/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.clientResponse.matchedArticles.length).toBeGreaterThan(0);
  });
});
