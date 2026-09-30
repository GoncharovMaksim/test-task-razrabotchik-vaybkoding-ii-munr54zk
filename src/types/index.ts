export type LeadStatus =
  | "new"
  | "in_progress"
  | "offer_sent"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export interface AmoLeadContext {
  id: string;
  name: string;
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  budget: number;
  stage: LeadStatus;
  stageName: string;
  pipeline: string;
  responsibleUser: string;
  tags: string[];
  createdAt: string;
  lastActivityAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "client" | "manager" | "system";
  senderName: string;
  text: string;
  timestamp: string;
  metadata?: {
    isAiGenerated?: boolean;
    delivered?: boolean;
    read?: boolean;
  };
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: "service" | "integration" | "bot" | "analytics" | "sla" | "pricing";
  summary: string;
  details: string;
  pricing: string;
  deliveryTimeline: string;
  tags: string[];
  idealFor: string[];
}

export interface UpsellTriggerRule {
  id: string;
  name: string;
  targetProduct: string;
  triggerKeywords: string[];
  clientPainPoint: string;
  valueProposition: string;
  suggestedPitch: string;
  estimatedPriceIncrease: string;
  priority: number;
}

export interface AssistRequest {
  clientMessage: string;
  conversationHistory?: Array<{
    sender: "client" | "manager";
    text: string;
  }>;
  leadContext?: Partial<AmoLeadContext>;
  preferredProvider?: "groq" | "gemini" | "auto" | "deterministic";
}

export interface ClientResponseBlock {
  text: string;
  tone: "polite_consultative" | "professional" | "informative";
  callToAction: string;
  matchedArticles: Array<{
    id: string;
    title: string;
    relevanceScore: number;
  }>;
}

export interface ManagerUpsellBlock {
  recommendedProduct: string;
  triggerFound: string;
  reasoning: string;
  suggestedPitch: string;
  estimatedPriceIncrease: string;
  confidenceScore: number;
}

export interface AssistResponse {
  success: boolean;
  clientResponse: ClientResponseBlock;
  managerUpsell: ManagerUpsellBlock;
  metadata: {
    providerUsed: string;
    modelUsed: string;
    latencyMs: number;
    tokensEstimated?: number;
    timestamp: string;
  };
}

export interface AmoWebhookPayload {
  account_id?: string;
  event: string;
  lead_id: string;
  contact_id?: string;
  message: {
    id: string;
    text: string;
    author: string;
    channel?: string;
    created_at: number;
  };
}
