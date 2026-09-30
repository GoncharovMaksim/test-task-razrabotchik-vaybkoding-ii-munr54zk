import { AmoCrmWebhookSchema } from "../validation/schemas";
import { defaultAiService } from "../ai/ai-service";
import { AssistResponse } from "@/types";

export interface AmoWebhookResult {
  status: "processed" | "ignored" | "invalid";
  leadId?: string;
  responsePreview?: AssistResponse;
  message?: string;
}

export async function handleAmoCrmWebhook(rawBody: unknown): Promise<AmoWebhookResult> {
  const parseResult = AmoCrmWebhookSchema.safeParse(rawBody);

  if (!parseResult.success) {
    return {
      status: "invalid",
      message: `Invalid webhook payload: ${parseResult.error.message}`,
    };
  }

  const payload = parseResult.data;

  // If message author is manager or system, ignore to avoid loop
  if (payload.message.author === "manager" || payload.message.author === "system") {
    return {
      status: "ignored",
      leadId: payload.lead_id,
      message: "Ignored outgoing manager or system message to avoid loop",
    };
  }

  // Process customer message with AI
  const assistResponse = await defaultAiService.processRequest({
    clientMessage: payload.message.text,
    leadContext: {
      id: payload.lead_id,
      name: `Сделка #${payload.lead_id}`,
      stage: "in_progress",
    },
  });

  return {
    status: "processed",
    leadId: payload.lead_id,
    responsePreview: assistResponse,
    message: "AI response and upsell recommendation generated successfully",
  };
}
