"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  User,
  Phone,
  Mail,
  Sparkles,
  Building,
} from "lucide-react";
import { ChatMessage, AmoLeadContext } from "@/types";

export interface DemoScenario {
  id: string;
  label: string;
  clientMessage: string;
  leadContext: AmoLeadContext;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "scenario-1c",
    label: "Интеграция 1С и остатки",
    clientMessage:
      "Здравствуйте! Мы торговая компания (опт и розница), хотим автоматизировать выставление счетов из AmoCRM в 1С УНФ и чтобы остатки склада обновлялись. Сколько это стоит и сколько дней займет?",
    leadContext: {
      id: "48291",
      name: "ООО 'СеверТрейд' — Интеграция 1С",
      contactName: "Алексей Смирнов",
      contactPhone: "+7 (921) 456-78-90",
      contactEmail: "a.smirnov@severtrade.ru",
      budget: 60000,
      stage: "in_progress",
      stageName: "Переговоры",
      pipeline: "B2B Продажи",
      responsibleUser: "Максим Александрович",
      tags: ["1с", "унф", "опт", "b2b"],
      createdAt: "2026-09-28T10:00:00Z",
      lastActivityAt: "2026-09-30T06:45:00Z",
    },
  },
  {
    id: "scenario-bot",
    label: "Потеря лидов ночью (AI-бот)",
    clientMessage:
      "Добрый день. Крутим рекламу в Яндекс Директ и Telegram, но в выходные и после 19:00 менеджеры не работают. Теряем кучу заявок, клиенты уходят к конкурентам. Есть ли у вас решение с ботом для ночных автоответов и квалификации в AmoCRM?",
    leadContext: {
      id: "48315",
      name: "Клиника 'ДентаЛюкс' — AI бот",
      contactName: "Елена Викторовна",
      contactPhone: "+7 (905) 123-44-55",
      contactEmail: "info@dentalux-spb.ru",
      budget: 45000,
      stage: "new",
      stageName: "Первичный контакт",
      pipeline: "Медицина & Услуги",
      responsibleUser: "Максим Александрович",
      tags: ["реклама", "директ", "telegram", "ночь"],
      createdAt: "2026-09-30T05:30:00Z",
      lastActivityAt: "2026-09-30T06:50:00Z",
    },
  },
  {
    id: "scenario-base",
    label: "Базовый запуск AmoCRM",
    clientMessage:
      "Приветствую! У нас отдел продаж из 5 человек, сейчас всё ведем в Excel-таблицах. Хотим быстро и без лишней сложности перейти в AmoCRM, настроить пару воронок и подключить почту. Подскажите базовые условия и тарифы.",
    leadContext: {
      id: "48402",
      name: "ИП Романов — Запуск воронки",
      contactName: "Дмитрий Романов",
      contactPhone: "+7 (911) 777-88-99",
      contactEmail: "romanov@stroygroup.ru",
      budget: 50000,
      stage: "new",
      stageName: "Входящая заявка",
      pipeline: "Строительство",
      responsibleUser: "Максим Александрович",
      tags: ["старт", "excel", "внедрение"],
      createdAt: "2026-09-30T06:10:00Z",
      lastActivityAt: "2026-09-30T06:55:00Z",
    },
  },
  {
    id: "scenario-telephony",
    label: "Телефония и контроль звонков",
    clientMessage:
      "Здравствуйте! Менеджеры часто забывают фиксировать результаты звонков, а РОП не может послушать аудиозаписи разговоров. Как подключить Mango к AmoCRM, чтобы все звонки и пропущенные сразу падали в сделку?",
    leadContext: {
      id: "48499",
      name: "ЛогистикПро — Телефония Mango",
      contactName: "Сергей Николаевич",
      contactPhone: "+7 (495) 999-11-22",
      contactEmail: "logistics@pro-cargo.ru",
      budget: 35000,
      stage: "in_progress",
      stageName: "Выявление потребности",
      pipeline: "Логистика",
      responsibleUser: "Максим Александрович",
      tags: ["mango", "звонки", "контроль"],
      createdAt: "2026-09-29T14:20:00Z",
      lastActivityAt: "2026-09-30T06:40:00Z",
    },
  },
];

interface AmoCrmChatProps {
  messages: ChatMessage[];
  currentLead: AmoLeadContext;
  onSendMessage: (text: string) => void;
  onTriggerAiAssist: (clientText: string) => void;
  draftText: string;
  setDraftText: (text: string) => void;
  onSelectScenario: (scenario: DemoScenario) => void;
  isAiLoading: boolean;
}

export const AmoCrmChat: React.FC<AmoCrmChatProps> = ({
  messages,
  currentLead,
  onSendMessage,
  onTriggerAiAssist,
  draftText,
  setDraftText,
  onSelectScenario,
  isAiLoading,
}) => {
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("scenario-1c");

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!draftText.trim()) return;
    onSendMessage(draftText.trim());
    setDraftText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleScenarioClick = (scenario: DemoScenario) => {
    setSelectedScenarioId(scenario.id);
    onSelectScenario(scenario);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden">
      {/* AmoCRM Deal Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300">
            <Building className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-zinc-100">{currentLead.name}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium">
                {currentLead.stageName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-zinc-500" />
                {currentLead.contactName}
              </span>
              {currentLead.contactPhone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-zinc-500" />
                  {currentLead.contactPhone}
                </span>
              )}
              {currentLead.contactEmail && (
                <span className="hidden sm:flex items-center gap-1">
                  <Mail className="w-3 h-3 text-zinc-500" />
                  {currentLead.contactEmail}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 block uppercase">Бюджет сделки</span>
            <span className="text-xs font-semibold text-emerald-400">
              {currentLead.budget.toLocaleString("ru-RU")} ₽
            </span>
          </div>
        </div>
      </div>

      {/* Preset Scenarios Selector (Quick Demo Bar) */}
      <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/30 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] text-zinc-500 shrink-0 font-medium">Сценарии для теста:</span>
        {DEMO_SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => handleScenarioClick(sc)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors border ${
              selectedScenarioId === sc.id
                ? "bg-zinc-800 text-zinc-100 border-zinc-600 shadow-sm"
                : "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isClient = msg.sender === "client";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isClient ? "items-start" : "items-end"}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-zinc-500">
                <span className="font-medium text-zinc-400">{msg.senderName}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {msg.metadata?.isAiGenerated && (
                  <span className="px-1.5 py-0.2 rounded bg-sky-950/80 border border-sky-800/60 text-sky-400 text-[9px] font-mono">
                    AI Copilot
                  </span>
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isClient
                    ? "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-sm"
                    : "bg-sky-600 text-white rounded-tr-sm shadow-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* Message metadata / AI Trigger button if client */}
              {isClient && (
                <div className="mt-1 flex items-center gap-2">
                  <button
                    onClick={() => onTriggerAiAssist(msg.text)}
                    disabled={isAiLoading}
                    className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors focus-visible:outline-none"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Сгенерировать ответ и допродажу</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Area (AmoCRM Message Composer) */}
      <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900/90">
        <div className="relative bg-zinc-950 border border-zinc-800 rounded-lg p-2 focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600 transition-all">
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите ответ клиенту или выберите сгенерированный ИИ..."
            rows={2}
            className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 resize-none focus:outline-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-zinc-850 mt-1">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <button
                type="button"
                className="p-1 hover:text-zinc-200 transition-colors"
                title="Прикрепить файл"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1 hover:text-zinc-200 transition-colors"
                title="Смайлы"
              >
                <Smile className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const lastClientMsg = [...messages].reverse().find((m) => m.sender === "client");
                  if (lastClientMsg) onTriggerAiAssist(lastClientMsg.text);
                }}
                disabled={isAiLoading}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-sky-400 hover:text-sky-300 bg-sky-950/60 border border-sky-800/60 rounded transition-colors disabled:opacity-50"
                title="Запросить подсказку ИИ"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Спросить ИИ</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 hidden sm:inline">Enter для отправки</span>
              <button
                onClick={handleSend}
                disabled={!draftText.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-xs font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
              >
                <Send className="w-3 h-3" />
                <span>Отправить</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
