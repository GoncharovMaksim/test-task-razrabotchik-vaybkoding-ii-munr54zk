import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/amocrm/webhook/route";
import { NextRequest } from "next/server";

describe("API /api/amocrm/webhook Integration Tests", () => {
  it("should process an incoming customer message webhook successfully", async () => {
    const payload = {
      account_id: "amo_acc_123",
      event: "message.received",
      lead_id: "lead_88291",
      message: {
        id: "msg_9912",
        text: "Добрый день! Хотим подключить бота для ночных ответов",
        author: "client",
        created_at: 1727670000,
      },
    };

    const req = new NextRequest("http://localhost:3000/api/amocrm/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("processed");
    expect(json.leadId).toBe("lead_88291");
    expect(json.responsePreview).toBeDefined();
    expect(json.responsePreview.clientResponse).toBeDefined();
    expect(json.responsePreview.managerUpsell).toBeDefined();
  });

  it("should ignore outgoing manager messages to prevent infinite webhook loops", async () => {
    const payload = {
      event: "message.sent",
      lead_id: "lead_88291",
      message: {
        id: "msg_9913",
        text: "Здравствуйте, наш менеджер скоро свяжется с вами",
        author: "manager",
        created_at: 1727670010,
      },
    };

    const req = new NextRequest("http://localhost:3000/api/amocrm/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("ignored");
    expect(json.message).toContain("avoid loop");
  });

  it("should reject an invalid webhook payload with 422", async () => {
    const payload = {
      event: "unknown",
      // missing lead_id and message
    };

    const req = new NextRequest("http://localhost:3000/api/amocrm/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(422);

    const json = await res.json();
    expect(json.status).toBe("invalid");
  });
});
