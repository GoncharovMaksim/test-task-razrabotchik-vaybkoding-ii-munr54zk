import { z } from "zod";

export const AmoLeadContextSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  budget: z.number().nonnegative().optional(),
  stage: z
    .enum(["new", "in_progress", "offer_sent", "negotiation", "closed_won", "closed_lost"])
    .optional(),
  stageName: z.string().optional(),
  pipeline: z.string().optional(),
  responsibleUser: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  lastActivityAt: z.string().optional(),
});

export const ConversationMessageSchema = z.object({
  sender: z.enum(["client", "manager"]),
  text: z.string().min(1, "Текст сообщения не может быть пустым"),
});

export const AssistRequestSchema = z.object({
  clientMessage: z
    .string()
    .min(2, "Сообщение клиента должно содержать минимум 2 символа")
    .max(5000, "Сообщение клиента не должно превышать 5000 символов"),
  conversationHistory: z.array(ConversationMessageSchema).optional(),
  leadContext: AmoLeadContextSchema.optional(),
  preferredProvider: z.enum(["groq", "gemini", "auto", "deterministic"]).optional(),
});

export const ClientResponseBlockSchema = z.object({
  text: z.string().min(5),
  tone: z.enum(["polite_consultative", "professional", "informative"]).default("polite_consultative"),
  callToAction: z.string().default(""),
  matchedArticles: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        relevanceScore: z.number(),
      })
    )
    .default([]),
});

export const ManagerUpsellBlockSchema = z.object({
  recommendedProduct: z.string().min(3),
  triggerFound: z.string().min(3),
  reasoning: z.string().min(5),
  suggestedPitch: z.string().min(5),
  estimatedPriceIncrease: z.string().default("+25 000 ₽ к чеку"),
  confidenceScore: z.number().min(0).max(1).default(0.85),
});

export const AssistResponseSchema = z.object({
  success: z.boolean(),
  clientResponse: ClientResponseBlockSchema,
  managerUpsell: ManagerUpsellBlockSchema,
  metadata: z.object({
    providerUsed: z.string(),
    modelUsed: z.string(),
    latencyMs: z.number(),
    tokensEstimated: z.number().optional(),
    timestamp: z.string(),
  }),
});

export const AmoCrmWebhookSchema = z.object({
  account_id: z.string().optional(),
  event: z.string().default("message.received"),
  lead_id: z.string().min(1, "lead_id обязателен"),
  contact_id: z.string().optional(),
  message: z.object({
    id: z.string().default(() => Math.random().toString(36).substring(7)),
    text: z.string().min(1, "Текст сообщения в вебхуке обязателен"),
    author: z.string().default("client"),
    channel: z.string().optional(),
    created_at: z.number().default(() => Math.floor(Date.now() / 1000)),
  }),
});
