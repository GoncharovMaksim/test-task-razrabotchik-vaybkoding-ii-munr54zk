import { UpsellTriggerRule } from "@/types";

export const UPSELL_TRIGGER_RULES: UpsellTriggerRule[] = [
  {
    id: "upsell-telephony",
    name: "Допродажа интеграции телефонии к базовому внедрению",
    targetProduct: "Пакет интеграции виртуальной телефонии (Mango / UIS)",
    triggerKeywords: ["внедрение", "воронка", "старт", "начать", "настроить crm", "под ключ", "excel"],
    clientPainPoint: "Менеджеры забывают вносить звонки вручную, теряются входящие лиды, РОП не может прослушать разговоры.",
    valueProposition:
      "Автоматическая фиксация каждого звонка, привязка аудиозаписи к сделке и исключение потери клиентов.",
    suggestedPitch:
      "Кстати, чтобы менеджеры не тратили время на ручной ввод звонков и не теряли обращения, сразу подключим телефонию (Mango/UIS). Все записи будут храниться прямо в сделке. Добавим в смету?",
    estimatedPriceIncrease: "+25 000 ₽ к чеку",
    priority: 10,
  },
  {
    id: "upsell-ai-bot",
    name: "Допродажа умного AI-бота квалификации 24/7",
    triggerKeywords: [
      "не успеваем",
      "выходные",
      "выходн",
      "ночью",
      "ноч",
      "много лидов",
      "теряем",
      "рутина",
      "квалификация",
      "telegram",
      "whatsapp",
      "сайт",
    ],
    targetProduct: "Умный AI-бот квалификации и автоответов 24/7",
    clientPainPoint: "До 40% лидов уходят к конкурентам, если им не ответили в течение первых 15 минут в нерабочие часы.",
    valueProposition:
      "Моментальный ответ в Telegram/WhatsApp 24/7, квалификация по вашим вопросам и автосоздание готовой сделки для менеджера утром.",
    suggestedPitch:
      "Обратите внимание: чтобы не упускать горячих клиентов вечером и на выходных, рекомендую сразу активировать нашего AI-квалификатора в Telegram/WhatsApp. Он отвечает за 5 секунд и заполняет карточку сделки до выхода менеджера на смену. Подключим тестовый сценарий?",
    estimatedPriceIncrease: "+35 000 ₽ + 4 900 ₽/мес LTV",
    priority: 20,
  },
  {
    id: "upsell-1c-sync",
    name: "Допродажа двусторонней синхронизации с 1С",
    triggerKeywords: [
      "1с",
      "счет",
      "счета",
      "оплата",
      "бухгалтерия",
      "склад",
      "остатки",
      "номенклатура",
      "товары",
      "отгрузка",
    ],
    targetProduct: "Двусторонняя интеграция AmoCRM с 1С:Предприятие",
    clientPainPoint: "Менеджеры вручную перебивают номенклатуру, дергают бухгалтера о поступлении денег и ошибаются в ценах.",
    valueProposition:
      "Менеджер формирует счет в 1 клик прямо в CRM, а при оплате статус сделки меняется автоматически через банковскую выписку.",
    suggestedPitch:
      "Чтобы менеджеры не отвлекали бухгалтерию и не перебивали счета руками, настроим бесшовный обмен с 1С. Счета выставляются в 1 клик, а оплата автоматически двигает сделку на этап 'Оплачено'. Оформим в рамках одного этапа внедрения?",
    estimatedPriceIncrease: "+60 000 ₽ к чеку",
    priority: 15,
  },
  {
    id: "upsell-analytics",
    name: "Допродажа сквозной аналитики Roistat / Power BI",
    triggerKeywords: [
      "реклама",
      "трафик",
      "директ",
      "лиды",
      "бюджет",
      "маркетинг",
      "аналитика",
      "отчет",
      "romi",
      "cpl",
    ],
    targetProduct: "Модуль сквозной аналитики и отчетов ROMI",
    clientPainPoint: "Непонятно, какие рекламные каналы приносят реальные деньги, а какие сливают бюджет.",
    valueProposition: "Точный расчет стоимости привлечения клиента и окупаемости каждого рубля рекламы до чистой прибыли.",
    suggestedPitch:
      "Раз вы активно вкладываетесь в привлечение трафика, обязательно рекомендую подключить модуль сквозной аналитики. Вы в реальном времени увидите, какие ключевые слова дают реальные продажи, и сможете сэкономить до 25% бюджета на рекламу. Показать пример дашборда?",
    estimatedPriceIncrease: "+40 000 ₽ к чеку",
    priority: 12,
  },
  {
    id: "upsell-sla-support",
    name: "Допродажа годового SLA сопровождения и аудита",
    triggerKeywords: [
      "дорого",
      "скидка",
      "гарантия",
      "после",
      "поддержка",
      "надежность",
      "сопровождение",
      "помощь",
      "стоимость",
    ],
    targetProduct: "Годовой пакет техподдержки и сопровождения со скидкой 15%",
    clientPainPoint: "Страх остаться без поддержки после внедрения или поломка интеграций в разгар продаж.",
    valueProposition: "Гарантированная реакция за 15 минут, персональный инженер и 20 часов доработок каждый месяц.",
    suggestedPitch:
      "Чтобы система работала без сбоев и мы оперативно вносили любые изменения под ваш рост, предлагаю включить годовой абонемент техподдержки. При оплате за год мы даем скидку 15% на само внедрение. Обсудим такой формат?",
    estimatedPriceIncrease: "+30 000 ₽/мес (постоянный LTV)",
    priority: 10,
  },
  {
    id: "upsell-custom-widget",
    name: "Допродажа калькулятора КП и валидатора контрагентов",
    triggerKeywords: ["кп", "договор", "калькулятор", "расчет", "шаблон", "длительно", "ошибки", "юрист"],
    targetProduct: "Виджет автогенерации КП и проверки контрагентов DaData",
    clientPainPoint: "Менеджеры тратят по 30–40 минут на составление коммерческого предложения в Word/Excel.",
    valueProposition: "Генерация брендированного PDF-предложения с расчетом скидок и реквизитами ровно за 30 секунд.",
    suggestedPitch:
      "Если менеджеры много времени тратят на подготовку расчетов и КП, мы можем встроить в сделку удобный калькулятор с автогенерацией PDF по вашему шаблону. Это ускорит отправку предложения в 5 раз. Добавить эту опцию?",
    estimatedPriceIncrease: "+35 000 ₽ к чеку",
    priority: 14,
  },
];

export class UpsellEngineService {
  private rules: UpsellTriggerRule[];

  constructor(rules: UpsellTriggerRule[] = UPSELL_TRIGGER_RULES) {
    this.rules = rules;
  }

  public getAllRules(): UpsellTriggerRule[] {
    return [...this.rules];
  }

  /**
   * Find matching upsell rule based on client message and context
   */
  public matchRule(text: string): { rule: UpsellTriggerRule; confidence: number; matchedKeywords: string[] } {
    const textLower = text.toLowerCase();
    let bestRule = this.rules[0];
    let bestScore = -1;
    let bestMatchedKeywords: string[] = [];

    for (const rule of this.rules) {
      const matched = rule.triggerKeywords.filter((kw) => textLower.includes(kw));
      if (matched.length > 0) {
        // Score based on count of keywords + priority
        const score = matched.length * 10 + rule.priority;
        if (score > bestScore) {
          bestScore = score;
          bestRule = rule;
          bestMatchedKeywords = matched;
        }
      }
    }

    if (bestScore === -1) {
      // Default to high-value SLA or base-to-telephony
      return {
        rule: this.rules[0],
        confidence: 0.65,
        matchedKeywords: ["общий контекст сделки"],
      };
    }

    const confidence = Math.min(0.98, Number((0.7 + bestMatchedKeywords.length * 0.08).toFixed(2)));
    return {
      rule: bestRule,
      confidence,
      matchedKeywords: bestMatchedKeywords,
    };
  }
}

export const defaultUpsellEngine = new UpsellEngineService();
