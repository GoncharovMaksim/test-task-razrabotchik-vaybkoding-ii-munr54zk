"use client";

import React, { useState } from "react";
import { X, Send, Terminal, CheckCircle2, AlertCircle, Copy } from "lucide-react";

interface WebhookSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessed?: (leadId: string, clientMessage: string) => void;
}

export const WebhookSimulatorModal: React.FC<WebhookSimulatorModalProps> = ({
  isOpen,
  onClose,
  onProcessed,
}) => {
  const defaultPayload = JSON.stringify(
    {
      account_id: "amocrm_acc_938120",
      event: "message.received",
      lead_id: "542918",
      contact_id: "cnt_88129",
      message: {
        id: "msg_77192",
        text: "Добрый день! Хотим настроить интеграцию AmoCRM с нашей 1С УНФ, чтобы счета автоматически выставлялись из сделки и менеджеры видели актуальные остатки товаров. Сколько это стоит по времени и деньгам?",
        author: "client",
        channel: "telegram",
        created_at: Math.floor(Date.now() / 1000),
      },
    },
    null,
    2
  );

  const [payload, setPayload] = useState(defaultPayload);
  const [isLoading, setIsLoading] = useState(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<"success" | "error" | null>(null);

  if (!isOpen) return null;

  const handleSendWebhook = async () => {
    setIsLoading(true);
    setResponseLog(null);
    setResponseStatus(null);

    try {
      const parsedJson = JSON.parse(payload);
      const res = await fetch("/api/amocrm/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedJson),
      });

      const data = await res.json();
      setResponseLog(JSON.stringify(data, null, 2));
      setResponseStatus(res.ok ? "success" : "error");

      if (res.ok && onProcessed && parsedJson.message?.text) {
        onProcessed(parsedJson.lead_id, parsedJson.message.text);
      }
    } catch (err) {
      setResponseStatus("error");
      setResponseLog(err instanceof Error ? err.message : "Ошибка парсинга или отправки");
    } finally {
      setIsLoading(false);
    }
  };

  const curlCommand = `curl -X POST https://your-domain.vercel.app/api/amocrm/webhook \\
  -H "Content-Type: application/json" \\
  -d '${payload.replace(/'/g, "\\'")}'`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="webhook-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-800 rounded-lg text-zinc-300">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 id="webhook-modal-title" className="text-lg font-semibold text-zinc-100">
                Эмулятор AmoCRM Webhook (/api/amocrm/webhook)
              </h2>
              <p className="text-xs text-zinc-400">
                Тестирование входящих событий от мессенджеров и Digital-воронки AmoCRM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-zinc-300">
                Тело входящего вебхука (JSON AmoCRM):
              </label>
              <button
                onClick={() => setPayload(defaultPayload)}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline"
              >
                Сбросить на эталон
              </button>
            </div>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={9}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          {/* Response area */}
          {responseLog && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium">
                {responseStatus === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span className={responseStatus === "success" ? "text-emerald-300" : "text-rose-300"}>
                  Ответ эндпоинта /api/amocrm/webhook:
                </span>
              </div>
              <pre className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto max-h-48">
                {responseLog}
              </pre>
            </div>
          )}

          {/* Curl snippet */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] text-zinc-400 font-medium">
              Пример интеграции через cURL (для AmoCRM Salesbot / Webhook):
            </span>
            <div className="relative">
              <pre className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-lg text-[11px] font-mono text-zinc-400 overflow-x-auto">
                {curlCommand}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(curlCommand)}
                className="absolute top-2.5 right-2.5 p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs"
                title="Скопировать cURL команду"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <span className="text-xs text-zinc-500">Эндпоинт доступен публично по HTTP POST</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
            >
              Отмена
            </button>
            <button
              onClick={handleSendWebhook}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 text-white text-xs font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
            >
              <Send className="w-3.5 h-3.5" />
              {isLoading ? "Отправка..." : "Эмулировать отправку"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
