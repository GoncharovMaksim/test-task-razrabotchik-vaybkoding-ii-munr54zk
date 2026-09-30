import { KnowledgeArticle } from "@/types";

export const KNOWLEDGE_BASE_ARTICLES: KnowledgeArticle[] = [
  {
    id: "kb-amocrm-base",
    title: "Базовое внедрение AmoCRM под ключ",
    category: "service",
    summary: "Быстрый запуск воронки продаж, карточек сделок и прав доступа для отдела продаж от 2 до 20 сотрудников.",
    details:
      "Включает: аудит текущего процесса продаж компании, настройку 2-3 воронок продаж с этапами и обязательными полями, импорт существующей клиентской базы, разграничение прав доступа (менеджер / РОП / админ), подключение корпоративной почты и форм сайта. Обучение команды с видеозаписью.",
    pricing: "от 45 000 ₽",
    deliveryTimeline: "5–7 рабочих дней",
    tags: ["amocrm", "внедрение", "воронка", "старт", "базовый", "crm", "настройка"],
    idealFor: [
      "Компании, переходящие с Excel или блокнотов",
      "Малый и средний бизнес с отделом продаж",
      "Быстрый старт без переплат за сложный кастом",
    ],
  },
  {
    id: "kb-telephony-integration",
    title: "Пакетная интеграция телефонии (Mango, UIS, Zadarma, Asterisk)",
    category: "integration",
    summary: "Сквозная фиксация всех входящих и исходящих звонков прямо в карточке клиента с записью разговоров.",
    details:
      "Включает: подключение виртуальной АТС, всплывающую карточку при входящем звонке, умную маршрутизацию на ответственного менеджера, автоматическое создание сделки и контакта при звонке с нового номера, плеер прослушивания записей звонков внутри AmoCRM, отчетность по пропущенным звонкам.",
    pricing: "от 25 000 ₽ (единоразово)",
    deliveryTimeline: "2–3 рабочих дня",
    tags: ["телефония", "звонки", "mango", "uis", "sip", "ватс", "пропущенные", "запись"],
    idealFor: [
      "Отделы активных звонков и продаж",
      "Компании с частой потерей входящих звонков от клиентов",
      "Контроль качества диалогов менеджеров",
    ],
  },
  {
    id: "kb-1c-sync",
    title: "Двусторонняя интеграция AmoCRM с 1С (УТ, УНФ, КА, ERP)",
    category: "integration",
    summary: "Синхронизация номенклатуры, актуальных остатков склада, контрагентов, счетов и оплат без ручного дублирования.",
    details:
      "Включает: автоматическое создание заказа покупателя в 1С при переводе сделки на этап 'Согласован', передачу счетов на оплату в CRM, автоматическую смену статуса сделки при поступлении оплаты в 1С (через банковскую выписку), синхронизацию справочника товаров и цен каждые 15 минут.",
    pricing: "от 60 000 ₽",
    deliveryTimeline: "7–10 рабочих дней",
    tags: ["1с", "интеграция", "счета", "оплата", "склад", "номенклатура", "ут", "унф"],
    idealFor: [
      "Торговые и производственные компании",
      "Бизнес с номенклатурой более 100 позиций",
      "Компании, уставшие от ошибок менеджеров при ручном выставлении счетов",
    ],
  },
  {
    id: "kb-ai-bot-qualifier",
    title: "Умный AI-бот квалификации и автоответов 24/7 (Telegram / WhatsApp / Сайт)",
    category: "bot",
    summary: "ИИ-ассистент первого контакта: моментально отвечает ночью и в выходные, квалифицирует лида и создает сделку в CRM.",
    details:
      "Включает: подключение к мессенджерам (Telegram, WhatsApp Business API, Jivo/сайт), сценарий интеллектуальной квалификации по 4–5 критериям (бюджет, потребность, сроки, ЛПР), занесение ответов в кастомные поля AmoCRM, автоназначение тегов и передачу дежурному менеджеру.",
    pricing: "35 000 ₽ настройка + от 4 900 ₽/мес подписка",
    deliveryTimeline: "3–4 рабочих дня",
    tags: ["ai", "бот", "автоответ", "ночь", "выходные", "квалификация", "telegram", "whatsapp"],
    idealFor: [
      "Компании, теряющие до 40% лидов в нерабочее время",
      "Высокий входящий трафик с рекламы",
      "Разгрузка менеджеров от рутинных однотипных вопросов",
    ],
  },
  {
    id: "kb-end-to-end-analytics",
    title: "Сквозная аналитика и дашборды ROMI (Roistat / Power BI / DataLens)",
    category: "analytics",
    summary: "Прозрачный учет окупаемости каждого рекламного канала от первого клика до денег в кассе.",
    details:
      "Включает: интеграцию рекламных кабинетов (Яндекс Директ, VK Реклама), коллтрекинга и AmoCRM. Построение отчета по CPL, CPA, ROMI, LTV и средней маржинальности сделок. Выявление неэффективных рекламных кампаний и перераспределение бюджета.",
    pricing: "от 40 000 ₽",
    deliveryTimeline: "5–7 рабочих дней",
    tags: ["аналитика", "сквозная", "roistat", "romi", "реклама", "яндекс", "трафик", "дашборд"],
    idealFor: [
      "Бизнесы с рекламным бюджетом от 100 000 ₽ в месяц",
      "Руководители, которым нужны точные цифры окупаемости рекламы",
      "Оптимизация стоимости привлечения лида",
    ],
  },
  {
    id: "kb-sla-maintenance",
    title: "Регламентное сопровождение и техподдержка AmoCRM (SLA)",
    category: "sla",
    summary: "Выделенный CRM-инженер, время реакции до 15 минут, аудит воронок и регулярные доработки.",
    details:
      "Включает: пакет от 15 до 40 часов инженерных доработок в месяц, мониторинг стабильности вебхуков и интеграций, оперативное добавление новых сотрудников/ролей, обновление виджетов, ежемесячный отчет с рекомендациями по улучшению конверсии воронки.",
    pricing: "от 30 000 ₽/месяц (скидка 15% при оплате на год)",
    deliveryTimeline: "Подключение за 1 рабочий день",
    tags: ["поддержка", "sla", "сопровождение", "абонентское", "гарантия", "инженер"],
    idealFor: [
      "Действующие отделы продаж, требующие непрерывной работы CRM",
      "Компании без штатного системного администратора/интегратора",
      "Быстрорастущие команды с постоянными изменениями процессов",
    ],
  },
  {
    id: "kb-custom-widgets",
    title: "Разработка кастомных виджетов и триггеров для AmoCRM",
    category: "service",
    summary: "Индивидуальные калькуляторы стоимости, генераторы КП и автоматические валидаторы данных в интерфейсе CRM.",
    details:
      "Включает: разработку интерфейсных виджетов по JS SDK AmoCRM, автогенерацию PDF-коммерческих предложений по шаблону в 1 клик, интеграцию с кастомными API заказчика, валидацию ИНН/ОГРН через DaData.",
    pricing: "от 35 000 ₽",
    deliveryTimeline: "4–6 рабочих дней",
    tags: ["виджет", "кастом", "кп", "генератор", "dadata", "автоматизация"],
    idealFor: [
      "Компании со сложным ценообразованием или прайс-листами",
      "Автоматизация подготовки КП и договоров",
      "Ускорение работы менеджеров в окне сделки",
    ],
  },
];

export class KnowledgeBaseService {
  private articles: KnowledgeArticle[];

  constructor(articles: KnowledgeArticle[] = KNOWLEDGE_BASE_ARTICLES) {
    this.articles = articles;
  }

  public getAll(): KnowledgeArticle[] {
    return [...this.articles];
  }

  public getById(id: string): KnowledgeArticle | undefined {
    return this.articles.find((a) => a.id === id);
  }

  /**
   * Search knowledge base by text with relevance scoring
   */
  public search(query: string, limit = 3): Array<KnowledgeArticle & { relevanceScore: number }> {
    if (!query || query.trim().length === 0) {
      return this.articles.slice(0, limit).map((a) => ({ ...a, relevanceScore: 0.1 }));
    }

    const normalizedQuery = query.toLowerCase().replace(/1[сc]/g, "1c");
    const cleanTokens = normalizedQuery
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((t) => t.length >= 2);

    if (cleanTokens.length === 0) {
      return this.articles.slice(0, limit).map((a) => ({ ...a, relevanceScore: 0.1 }));
    }

    const scored = this.articles.map((article) => {
      let score = 0;
      const titleLower = article.title.toLowerCase().replace(/1[сc]/g, "1c");
      const summaryLower = article.summary.toLowerCase().replace(/1[сc]/g, "1c");
      const detailsLower = article.details.toLowerCase().replace(/1[сc]/g, "1c");
      const normalizedTags = article.tags.map((t) => t.toLowerCase().replace(/1[сc]/g, "1c"));

      for (const token of cleanTokens) {
        // Tag match (highest weight)
        if (normalizedTags.some((tag) => tag.includes(token) || token.includes(tag))) {
          score += 5;
        }
        // Title match
        if (titleLower.includes(token)) {
          score += 4;
        }
        // Summary match
        if (summaryLower.includes(token)) {
          score += 2;
        }
        // Details match
        if (detailsLower.includes(token)) {
          score += 1;
        }
      }

      const normalizedScore = Number(Math.min(1, score / 15).toFixed(2));
      return {
        ...article,
        relevanceScore: normalizedScore,
      };
    });

    return scored
      .filter((item) => item.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }
}

export const defaultKnowledgeBase = new KnowledgeBaseService();
