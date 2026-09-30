"use client";

import React from "react";
import {
  Sparkles,
  Copy,
  ArrowRight,
  TrendingUp,
  Cpu,
  BookOpen,
  Send,
  Loader2,
  Check,
} from "lucide-react";
import { AssistResponse } from "@/types";

interface AssistantWidgetProps {
  response: AssistResponse | null;
  isLoading: boolean;
  onInsertToInput: (text: string) => void;
  onSendDirectly: (text: string) => void;
  onShowToast: (message: string, type?: "success" | "info" | "error") => void;
  preferredProvider: "auto" | "groq" | "gemini" | "deterministic";
  onChangeProvider: (provider: "auto" | "groq" | "gemini" | "deterministic") => void;
  onOpenKbModal: () => void;
}

export const AssistantWidget: React.FC<AssistantWidgetProps> = ({
  response,
  isLoading,
  onInsertToInput,
  onSendDirectly,
  onShowToast,
  preferredProvider,
  onChangeProvider,
  onOpenKbModal,
}) => {
  const [copiedResponse, setCopiedResponse] = React.useState(false);
  const [copiedPitch, setCopiedPitch] = React.useState(false);

  const handleCopyClientResponse = () => {
    if (!response?.clientResponse.text) return;
    navigator.clipboard.writeText(response.clientResponse.text);
    setCopiedResponse(true);
    onShowToast("Ответ клиенту скопирован в буфер", "success");
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const handleCopyPitch = () => {
    if (!response?.managerUpsell.suggestedPitch) return;
    navigator.clipboard.writeText(response.managerUpsell.suggestedPitch);
    setCopiedPitch(true);
    onShowToast("Реплика допродажи скопирована", "success");
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <aside
      aria-label="Виджет ИИ-ассистента"
      className="w-full lg:w-[420px] bg-zinc-900 border-l border-zinc-800 flex flex-col h-full overflow-hidden"
    >
      {/* Widget Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-zinc-800 border border-zinc-700/60 rounded-md">
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              О-комплекс AI
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 font-mono font-normal">
                AmoCRM Copilot
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">Автоподбор ответа и допродаж</p>
          </div>
        </div>

        <button
          onClick={onOpenKbModal}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-zinc-300 hover:text-zinc-100 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 rounded-md transition-colors"
          title="Открыть базу знаний"
        >
          <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
          <span>База</span>
        </button>
      </div>

      {/* Provider Selector & Telemetry Bar */}
      <div className="px-4 py-2 bg-zinc-950/70 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-zinc-500" />
          <span>Движок:</span>
          <select
            value={preferredProvider}
            onChange={(e) =>
              onChangeProvider(e.target.value as "auto" | "groq" | "gemini" | "deterministic")
            }
            className="bg-zinc-900 border border-zinc-700/80 rounded px-2 py-0.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="auto">Auto (Groq / Gemini)</option>
            <option value="groq">Groq (Qwen 3.8)</option>
            <option value="gemini">Gemini 2.5 Flash</option>
            <option value="deterministic">Офлайн / Правила</option>
          </select>
        </div>

        {response && (
          <span className="text-[10px] font-mono text-zinc-500">
            {response.metadata.latencyMs}ms | {response.metadata.providerUsed}
          </span>
        )}
      </div>

      {/* Widget Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-7 h-7 text-sky-400 animate-spin" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-200">Анализ обращения клиента...</p>
              <p className="text-[11px] text-zinc-500">Сверка с базой знаний и расчет допродажи</p>
            </div>
          </div>
        ) : !response ? (
          <div className="py-16 text-center space-y-3 px-4">
            <div className="inline-flex p-3 bg-zinc-800/60 rounded-full text-zinc-500 border border-zinc-800">
              <Sparkles className="w-6 h-6 text-zinc-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-zinc-300">Ожидание сообщения клиента</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Выберите один из готовых сценариев слева или напишите клиенту, чтобы ИИ подготовил вежливый ответ и
                подсказку по допродаже.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Matched Knowledge Articles */}
            {response.clientResponse.matchedArticles &&
              response.clientResponse.matchedArticles.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-medium">Найденные статьи базы знаний:</span>
                    <span className="text-[10px] text-zinc-500">
                      {response.clientResponse.matchedArticles.length} совпадений
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {response.clientResponse.matchedArticles.map((art) => (
                      <span
                        key={art.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 text-[11px] text-zinc-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {art.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* BLOCK 1: Вежливый ответ клиенту */}
            <section
              aria-labelledby="block-client-response-title"
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <h3 id="block-client-response-title" className="text-xs font-semibold text-zinc-200">
                    БЛОК 1. Вежливый ответ клиенту
                  </h3>
                </div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                  Готов к отправке
                </span>
              </div>

              <div className="text-xs text-zinc-200 leading-relaxed font-sans bg-zinc-900/60 p-3 rounded border border-zinc-800/70 select-text whitespace-pre-wrap">
                {response.clientResponse.text}
              </div>

              {/* Action buttons for Block 1 */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={() => onInsertToInput(response.clientResponse.text)}
                  className="flex items-center justify-center gap-1 px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-[11px] font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                  title="Вставить в поле ввода менеджера"
                >
                  <ArrowRight className="w-3 h-3 text-sky-400" />
                  <span>Вставить</span>
                </button>

                <button
                  onClick={handleCopyClientResponse}
                  className="flex items-center justify-center gap-1 px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-[11px] font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                  title="Скопировать в буфер обмена"
                >
                  {copiedResponse ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-zinc-400" />
                  )}
                  <span>{copiedResponse ? "Готово" : "Копировать"}</span>
                </button>

                <button
                  onClick={() => onSendDirectly(response.clientResponse.text)}
                  className="flex items-center justify-center gap-1 px-2 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
                  title="Отправить сообщение прямо в чат"
                >
                  <Send className="w-3 h-3" />
                  <span>Отправить</span>
                </button>
              </div>
            </section>

            {/* BLOCK 2: Подсказка по допродажам для менеджера */}
            <section
              aria-labelledby="block-manager-upsell-title"
              className="bg-zinc-950 border border-emerald-950/70 rounded-lg p-3.5 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 id="block-manager-upsell-title" className="text-xs font-semibold text-emerald-300">
                    БЛОК 2. Подсказка по допродажам
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-medium">
                  {response.managerUpsell.estimatedPriceIncrease}
                </span>
              </div>

              {/* Recommended Product */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                  Целевой продукт дожима:
                </span>
                <p className="text-xs font-semibold text-zinc-100">
                  {response.managerUpsell.recommendedProduct}
                </p>
              </div>

              {/* Pain Point & Trigger */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                  Зафиксированный триггер в запросе:
                </span>
                <p className="text-[11px] text-zinc-300 bg-zinc-900/60 p-2 rounded border border-zinc-800">
                  {response.managerUpsell.triggerFound}
                </p>
              </div>

              {/* Reasoning */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                  Логика предложения (ценность):
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {response.managerUpsell.reasoning}
                </p>
              </div>

              {/* Script / Pivot phrase for manager */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                    Реплика-пивот для диалога:
                  </span>
                  <button
                    onClick={handleCopyPitch}
                    className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-200"
                    title="Скопировать реплику"
                  >
                    {copiedPitch ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedPitch ? "Скопировано" : "Скопировать"}</span>
                  </button>
                </div>
                <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded text-xs text-zinc-200 italic leading-relaxed">
                  "{response.managerUpsell.suggestedPitch}"
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Widget Footer */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/90 text-center">
        <p className="text-[10px] text-zinc-500">
          Интеграция с AmoCRM Digital Pipeline • О-комплекс 2026
        </p>
      </div>
    </aside>
  );
};
