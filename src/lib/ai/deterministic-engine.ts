import { AssistResponse, KnowledgeArticle, UpsellTriggerRule } from "@/types";

export interface DeterministicEngineParams {
  clientMessage: string;
  matchedArticles: Array<KnowledgeArticle & { relevanceScore: number }>;
  upsellMatch: { rule: UpsellTriggerRule; confidence: number; matchedKeywords: string[] };
}

export class DeterministicEngine {
  public generate(params: DeterministicEngineParams): AssistResponse {
    const { clientMessage, matchedArticles, upsellMatch } = params;
    const startTime = performance.now();

    const topArticle = matchedArticles[0];
    const rule = upsellMatch.rule;

    // Build polite client response
    let responseText = "";
    let callToAction = "";

    if (topArticle) {
      responseText = `Здравствуйте! Благодарим за обращение в "О-комплекс". По вашему вопросу: услуга "${topArticle.title}" включает в себя ${topArticle.summary.toLowerCase()} Стоимость составляет ${topArticle.pricing}, ориентировочный срок реализации — ${topArticle.deliveryTimeline}.`;
      callToAction = `Подскажите, сколько сотрудников в вашем отделе продаж планируют работать в CRM, чтобы мы сразу подготовили точный расчет?`;
    } else {
      responseText = `Здравствуйте! Спасибо за обращение в "О-комплекс". Мы являемся официальным сертифицированным интегратором AmoCRM и разработчиком кастомных решений. С удовольствием поможем оптимизировать процессы в вашем отделе продаж.`;
      callToAction = `Расскажите, пожалуйста, подробнее о вашей задаче или оставьте контактный номер для оперативной консультации с ведущим инженером.`;
    }

    const latencyMs = Math.round(performance.now() - startTime);

    return {
      success: true,
      clientResponse: {
        text: `${responseText} ${callToAction}`,
        tone: "polite_consultative",
        callToAction,
        matchedArticles: matchedArticles.map((a) => ({
          id: a.id,
          title: a.title,
          relevanceScore: a.relevanceScore,
        })),
      },
      managerUpsell: {
        recommendedProduct: rule.targetProduct,
        triggerFound:
          upsellMatch.matchedKeywords.length > 0
            ? `Ключевые триггеры: ${upsellMatch.matchedKeywords.join(", ")} (в запросе: "${clientMessage.slice(0, 60)}...")`
            : `Общий запрос клиента на автоматизацию продаж`,
        reasoning: `${rule.clientPainPoint} ${rule.valueProposition}`,
        suggestedPitch: rule.suggestedPitch,
        estimatedPriceIncrease: rule.estimatedPriceIncrease,
        confidenceScore: upsellMatch.confidence,
      },
      metadata: {
        providerUsed: "deterministic",
        modelUsed: "ocomplex-rule-engine-v1",
        latencyMs: Math.max(1, latencyMs),
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export const deterministicEngine = new DeterministicEngine();
