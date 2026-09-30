import { AmoLeadContext, KnowledgeArticle, UpsellTriggerRule } from "@/types";

export interface PromptContext {
  clientMessage: string;
  conversationHistory?: Array<{ sender: "client" | "manager"; text: string }>;
  leadContext?: Partial<AmoLeadContext>;
  relevantArticles: KnowledgeArticle[];
  suggestedUpsellRule: UpsellTriggerRule;
}

export function buildSystemPrompt(): string {
  return `Ты — высококлассный ИИ-ассистент менеджера отдела продаж компании "О-комплекс" (официальный интегратор AmoCRM, разработчик телефонии, 1С-интеграций и AI-решений).

ТВОЯ ЗАДАЧА:
На основе сообщения клиента, контекста сделки в AmoCRM и выдержек из базы знаний сформировать ДВА БЛОКА в строгом формате JSON:
1. clientResponse: Вежливый, экспертный и лаконичный ответ клиенту для отправки в диалоговое окно AmoCRM.
   - Тон: уважительный, дружелюбный, без канцеляризмов и шаблонного пафоса.
   - Ссылка на факты и цены ИСКЛЮЧИТЕЛЬНО из предоставленной базы знаний (не выдумывать несуществующие услуги и условия).
   - Обязательно завершать конкретным вопросом или открытым предложением следующего шага (Call to Action), продвигающим сделку по воронке.
2. managerUpsell: Внутренняя подсказка для менеджера по допродаже (upsell/cross-sell).
   - Конкретный дополнительный продукт или тариф.
   - Зафиксированный триггер или боль клиента из обращения.
   - Логика (почему именно это сейчас нужно клиенту).
   - Готовая фраза-скрипт (pitch), как менеджеру ненавязчиво предложить эту опцию в продолжении диалога.
   - Ориентировочный прирост чека.

ФОРМАТ ОТВЕТА (ТОЛЬКО ЧИСТЫЙ JSON БЕЗ MARKDOWN-ОБЁРТКИ \`\`\`json):
{
  "clientResponse": {
    "text": "Текст вежливого ответа клиенту...",
    "callToAction": "Вопрос или предложение следующего шага...",
    "tone": "polite_consultative"
  },
  "managerUpsell": {
    "recommendedProduct": "Название допродажи",
    "triggerFound": "Фрагмент или триггер из сообщения клиента",
    "reasoning": "Почему клиенту это необходимо",
    "suggestedPitch": "Готовая реплика для менеджера",
    "estimatedPriceIncrease": "+XX XXX ₽ к чеку"
  }
}`;
}

export function buildUserPrompt(context: PromptContext): string {
  const { clientMessage, conversationHistory, leadContext, relevantArticles, suggestedUpsellRule } = context;

  const articlesText = relevantArticles.length > 0
    ? relevantArticles
        .map(
          (a, i) =>
            `[Статья ${i + 1}] ${a.title}\nКатегория: ${a.category}\nСуть: ${a.summary}\nПодробности: ${a.details}\nЦены: ${a.pricing}\nСроки: ${a.deliveryTimeline}`
        )
        .join("\n\n")
    : "Базовая информация: О-комплекс занимается комплексным внедрением AmoCRM, телефонии, 1С и AI-ботов.";

  const historyText =
    conversationHistory && conversationHistory.length > 0
      ? conversationHistory.map((m) => `${m.sender === "client" ? "Клиент" : "Менеджер"}: ${m.text}`).join("\n")
      : "История диалога пуста (первое обращение).";

  const leadText = leadContext
    ? `Сделка: ${leadContext.name || "Новое обращение"} | Этап: ${leadContext.stageName || "Входящие"} | Бюджет: ${leadContext.budget ? leadContext.budget + " ₽" : "не указан"} | Контакт: ${leadContext.contactName || "Клиент"}`
    : "Контекст сделки: Входящий лид с сайта/мессенджера.";

  return `КОНТЕКСТ СДЕЛКИ В AMOCRM:
${leadText}

ИСТОРИЯ ДИАЛОГА:
${historyText}

НОВОЕ СООБЩЕНИЕ КЛИЕНТА:
"${clientMessage}"

РЕЛЕВАНТНЫЕ ВЫДЕРЖКИ ИЗ БАЗЫ ЗНАНИЙ О-КОМПЛЕКС:
${articlesText}

РЕКОМЕНДУЕМЫЙ ВЕКТОР ДОПРОДАЖИ:
- Целевой продукт: ${suggestedUpsellRule.targetProduct}
- Боль клиента: ${suggestedUpsellRule.clientPainPoint}
- Ценность: ${suggestedUpsellRule.valueProposition}
- Рекомендуемый питч: ${suggestedUpsellRule.suggestedPitch}
- Потенциал: ${suggestedUpsellRule.estimatedPriceIncrease}

Сгенерируй вежливый ответ клиенту и подсказку по допродаже для менеджера строго в формате JSON.`;
}
