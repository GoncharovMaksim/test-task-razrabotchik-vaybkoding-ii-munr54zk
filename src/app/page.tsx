"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Users,
  BarChart3,
  BookOpen,
  Terminal,
  Zap,
  HelpCircle,
  Search,
} from "lucide-react";
import { ChatMessage, AssistResponse, AmoLeadContext } from "@/types";
import { AmoCrmChat, DEMO_SCENARIOS, DemoScenario } from "@/components/AmoCrmChat";
import { AssistantWidget } from "@/components/AssistantWidget";
import { KnowledgeBaseModal } from "@/components/KnowledgeBaseModal";
import { WebhookSimulatorModal } from "@/components/WebhookSimulatorModal";
import { Toast, ToastProps } from "@/components/Toast";

export default function AmoCrmWorkspace() {
  const initialScenario = DEMO_SCENARIOS[0];

  const [currentLead, setCurrentLead] = useState<AmoLeadContext>(initialScenario.leadContext);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "client",
      senderName: initialScenario.leadContext.contactName,
      text: initialScenario.clientMessage,
      timestamp: "10:14",
    },
  ]);
  const [draftText, setDraftText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AssistResponse | null>(null);
  const [preferredProvider, setPreferredProvider] = useState<
    "auto" | "groq" | "gemini" | "deterministic"
  >("auto");

  // Modals state
  const [isKbModalOpen, setIsKbModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState<Array<Omit<ToastProps, "onClose">>>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Request AI assistance for given client message
  const triggerAiAssist = useCallback(
    async (clientMessage: string, provider = preferredProvider) => {
      setIsAiLoading(true);
      try {
        const res = await fetch("/api/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientMessage,
            leadContext: currentLead,
            preferredProvider: provider,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const data: AssistResponse = await res.json();
        setAiResponse(data);
      } catch (err) {
        showToast(
          `Ошибка генерации: ${err instanceof Error ? err.message : "Неизвестная ошибка"}`,
          "error"
        );
      } finally {
        setIsAiLoading(false);
      }
    },
    [currentLead, preferredProvider, showToast]
  );

  // Auto trigger AI on first load
  useEffect(() => {
    triggerAiAssist(initialScenario.clientMessage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle switching scenario
  const handleSelectScenario = (scenario: DemoScenario) => {
    setCurrentLead(scenario.leadContext);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: "client",
        senderName: scenario.leadContext.contactName,
        text: scenario.clientMessage,
        timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setDraftText("");
    triggerAiAssist(scenario.clientMessage);
  };

  // Manager sends message
  const handleSendMessage = (text: string, isAi = false) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "manager",
      senderName: currentLead.responsibleUser,
      text,
      timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      metadata: { isAiGenerated: isAi, delivered: true, read: true },
    };
    setMessages((prev) => [...prev, newMsg]);
    showToast("Сообщение отправлено клиенту", "success");
  };

  // Insert AI text into input draft
  const handleInsertToInput = (text: string) => {
    setDraftText(text);
    showToast("Ответ вставлен в поле ввода", "info");
  };

  // Send AI response directly
  const handleSendDirectly = (text: string) => {
    handleSendMessage(text, true);
  };

  // Callback when webhook is simulated
  const handleWebhookProcessed = (leadId: string, clientMessage: string) => {
    setIsWebhookModalOpen(false);
    setCurrentLead((prev) => ({
      ...prev,
      id: leadId,
      name: `Сделка #${leadId} (из вебхука)`,
    }));
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-webhook-${Date.now()}`,
        sender: "client",
        senderName: "Клиент (AmoCRM Webhook)",
        text: clientMessage,
        timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    triggerAiAssist(clientMessage);
    showToast("Вебхук обработан, сделка и чат обновлены", "success");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 font-sans select-none">
      {/* 1. AmoCRM Left Navigation Bar */}
      <nav
        aria-label="Навигация AmoCRM"
        className="w-14 sm:w-16 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4 justify-between shrink-0"
      >
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div
            className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-md"
            title="О-комплекс AmoCRM Copilot"
          >
            О
          </div>

          {/* CRM Nav Icons */}
          <div className="flex flex-col items-center gap-3 text-zinc-400">
            <button
              className="p-2.5 rounded-lg text-sky-400 bg-zinc-800/80 transition-colors focus-visible:outline-none"
              title="Диалоги и сделки"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              className="p-2.5 rounded-lg hover:text-zinc-200 hover:bg-zinc-800 transition-colors focus-visible:outline-none"
              title="Контакты и компании"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              className="p-2.5 rounded-lg hover:text-zinc-200 hover:bg-zinc-800 transition-colors focus-visible:outline-none"
              title="Аналитика воронок"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsKbModalOpen(true)}
              className="p-2.5 rounded-lg hover:text-zinc-200 hover:bg-zinc-800 transition-colors focus-visible:outline-none text-zinc-400 hover:text-sky-400"
              title="База знаний компании"
            >
              <BookOpen className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsWebhookModalOpen(true)}
              className="p-2.5 rounded-lg hover:text-zinc-200 hover:bg-zinc-800 transition-colors focus-visible:outline-none text-zinc-400 hover:text-emerald-400"
              title="Эмулятор AmoCRM Webhook"
            >
              <Terminal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom User/Settings */}
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <button
            onClick={() => setIsKbModalOpen(true)}
            className="p-2 hover:text-zinc-200 transition-colors"
            title="Справка"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <div
            className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-semibold text-zinc-300"
            title="Максим Александрович (Менеджер)"
          >
            МА
          </div>
        </div>
      </nav>

      {/* 2. AmoCRM Active Leads List (collapsible on small screens) */}
      <aside
        aria-label="Список сделок"
        className="hidden md:flex w-64 lg:w-72 bg-zinc-900/50 border-r border-zinc-800 flex-col shrink-0"
      >
        <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-200">Сделки в работе</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
            {DEMO_SCENARIOS.length}
          </span>
        </div>

        <div className="p-2 border-b border-zinc-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              readOnly
              placeholder="Поиск по сделкам..."
              value=""
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-md pl-8 pr-2 py-1 text-xs text-zinc-400 placeholder:text-zinc-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-850">
          {DEMO_SCENARIOS.map((sc) => {
            const isSelected = currentLead.id === sc.leadContext.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`w-full text-left p-3 transition-colors ${
                  isSelected
                    ? "bg-zinc-800/80 border-l-2 border-sky-500"
                    : "hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-zinc-200 truncate pr-2">
                    {sc.leadContext.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 shrink-0">10:14</span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight">
                  {sc.clientMessage}
                </p>
                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400">
                    {sc.leadContext.stageName}
                  </span>
                  <span className="text-emerald-400 font-medium">
                    {sc.leadContext.budget.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Help Footer in Leads Sidebar */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/80 text-[11px] text-zinc-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Copilot активен</span>
          </div>
          <button
            onClick={() => setIsWebhookModalOpen(true)}
            className="text-xs text-sky-400 hover:underline"
          >
            Webhook
          </button>
        </div>
      </aside>

      {/* 3. AmoCRM Active Chat Dialog (Center) */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        <AmoCrmChat
          messages={messages}
          currentLead={currentLead}
          onSendMessage={(txt) => handleSendMessage(txt, false)}
          onTriggerAiAssist={(txt) => triggerAiAssist(txt)}
          draftText={draftText}
          setDraftText={setDraftText}
          onSelectScenario={handleSelectScenario}
          isAiLoading={isAiLoading}
        />
      </main>

      {/* 4. AI Assistant Widget (Right Side Panel) */}
      <AssistantWidget
        response={aiResponse}
        isLoading={isAiLoading}
        onInsertToInput={handleInsertToInput}
        onSendDirectly={handleSendDirectly}
        onShowToast={showToast}
        preferredProvider={preferredProvider}
        onChangeProvider={(p) => {
          setPreferredProvider(p);
          const lastClientMsg = [...messages].reverse().find((m) => m.sender === "client");
          if (lastClientMsg) triggerAiAssist(lastClientMsg.text, p);
        }}
        onOpenKbModal={() => setIsKbModalOpen(true)}
      />

      {/* Modals */}
      <KnowledgeBaseModal
        isOpen={isKbModalOpen}
        onClose={() => setIsKbModalOpen(false)}
      />

      <WebhookSimulatorModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        onProcessed={handleWebhookProcessed}
      />

      {/* Stacked Toasts */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
}
