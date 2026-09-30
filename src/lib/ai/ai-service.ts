import { AssistRequest, AssistResponse } from "@/types";
import { defaultKnowledgeBase, KnowledgeBaseService } from "../kb/knowledge-base";
import { defaultUpsellEngine, UpsellEngineService } from "../kb/upsell-rules";
import { deterministicEngine } from "./deterministic-engine";
import { GroqClient } from "./groq-client";
import { GeminiClient } from "./gemini-client";
import { PromptContext } from "./prompt-builder";

export interface AiServiceOptions {
  kbService?: KnowledgeBaseService;
  upsellEngine?: UpsellEngineService;
  groqClient?: GroqClient;
  geminiClient?: GeminiClient;
}

export class AiAssistantService {
  private kbService: KnowledgeBaseService;
  private upsellEngine: UpsellEngineService;
  private groqClient: GroqClient;
  private geminiClient: GeminiClient;

  constructor(options?: AiServiceOptions) {
    this.kbService = options?.kbService || defaultKnowledgeBase;
    this.upsellEngine = options?.upsellEngine || defaultUpsellEngine;
    this.groqClient = options?.groqClient || new GroqClient();
    this.geminiClient = options?.geminiClient || new GeminiClient();
  }

  public async processRequest(request: AssistRequest): Promise<AssistResponse> {
    const { clientMessage, conversationHistory, leadContext, preferredProvider = "auto" } = request;

    // 1. Search relevant knowledge base articles
    const matchedArticles = this.kbService.search(clientMessage, 3);

    // 2. Identify best upsell trigger
    const upsellMatch = this.upsellEngine.matchRule(clientMessage);

    // If deterministic mode explicitly requested or testing
    if (preferredProvider === "deterministic") {
      return deterministicEngine.generate({
        clientMessage,
        matchedArticles,
        upsellMatch,
      });
    }

    const promptContext: PromptContext = {
      clientMessage,
      conversationHistory,
      leadContext,
      relevantArticles: matchedArticles,
      suggestedUpsellRule: upsellMatch.rule,
    };

    // Determine execution order
    const providersToTry = this.resolveProviderOrder(preferredProvider);

    let lastError: Error | null = null;

    for (const provider of providersToTry) {
      try {
        if (provider === "groq" && this.groqClient.isAvailable()) {
          const result = await this.groqClient.generate(promptContext);
          return {
            success: true,
            clientResponse: {
              text: result.data.clientResponse.text,
              tone: result.data.clientResponse.tone,
              callToAction: result.data.clientResponse.callToAction,
              matchedArticles: matchedArticles.map((a) => ({
                id: a.id,
                title: a.title,
                relevanceScore: a.relevanceScore,
              })),
            },
            managerUpsell: {
              recommendedProduct: result.data.managerUpsell.recommendedProduct,
              triggerFound: result.data.managerUpsell.triggerFound,
              reasoning: result.data.managerUpsell.reasoning,
              suggestedPitch: result.data.managerUpsell.suggestedPitch,
              estimatedPriceIncrease: result.data.managerUpsell.estimatedPriceIncrease,
              confidenceScore: upsellMatch.confidence,
            },
            metadata: {
              providerUsed: "groq",
              modelUsed: result.model,
              latencyMs: result.latencyMs,
              timestamp: new Date().toISOString(),
            },
          };
        }

        if (provider === "gemini" && this.geminiClient.isAvailable()) {
          const result = await this.geminiClient.generate(promptContext);
          return {
            success: true,
            clientResponse: {
              text: result.data.clientResponse.text,
              tone: result.data.clientResponse.tone,
              callToAction: result.data.clientResponse.callToAction,
              matchedArticles: matchedArticles.map((a) => ({
                id: a.id,
                title: a.title,
                relevanceScore: a.relevanceScore,
              })),
            },
            managerUpsell: {
              recommendedProduct: result.data.managerUpsell.recommendedProduct,
              triggerFound: result.data.managerUpsell.triggerFound,
              reasoning: result.data.managerUpsell.reasoning,
              suggestedPitch: result.data.managerUpsell.suggestedPitch,
              estimatedPriceIncrease: result.data.managerUpsell.estimatedPriceIncrease,
              confidenceScore: upsellMatch.confidence,
            },
            metadata: {
              providerUsed: "gemini",
              modelUsed: result.model,
              latencyMs: result.latencyMs,
              timestamp: new Date().toISOString(),
            },
          };
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Continue to fallback provider
      }
    }

    // Graceful fallback to deterministic rule engine
    const fallbackResponse = deterministicEngine.generate({
      clientMessage,
      matchedArticles,
      upsellMatch,
    });

    if (lastError) {
      fallbackResponse.metadata.providerUsed = "deterministic (fallback after provider error)";
    }

    return fallbackResponse;
  }

  private resolveProviderOrder(preferred: "groq" | "gemini" | "auto" | "deterministic"): Array<"groq" | "gemini"> {
    if (preferred === "groq") {
      return ["groq", "gemini"];
    }
    if (preferred === "gemini") {
      return ["gemini", "groq"];
    }
    // "auto" mode: default to groq first for ultra-low latency, then gemini
    return ["groq", "gemini"];
  }
}

export const defaultAiService = new AiAssistantService();
