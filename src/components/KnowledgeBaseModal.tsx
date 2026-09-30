"use client";

import React, { useState } from "react";
import { X, Search, BookOpen, TrendingUp, Clock, Tag } from "lucide-react";
import { KNOWLEDGE_BASE_ARTICLES } from "@/lib/kb/knowledge-base";
import { UPSELL_TRIGGER_RULES } from "@/lib/kb/upsell-rules";

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"articles" | "upsell">("articles");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredArticles = KNOWLEDGE_BASE_ARTICLES.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const filteredRules = UPSELL_TRIGGER_RULES.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.targetProduct.toLowerCase().includes(q) ||
      r.triggerKeywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kb-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-800 rounded-lg text-zinc-300">
              <BookOpen className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 id="kb-modal-title" className="text-lg font-semibold text-zinc-100">
                База знаний & Матрица допродаж "О-комплекс"
              </h2>
              <p className="text-xs text-zinc-400">
                Официальные регламенты, тарифы и правила дожима для менеджеров в AmoCRM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
            aria-label="Закрыть модальное окно"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-3 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("articles")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "articles"
                  ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              Услуги и регламенты ({KNOWLEDGE_BASE_ARTICLES.length})
            </button>
            <button
              onClick={() => setActiveTab("upsell")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "upsell"
                  ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              Сценарии допродаж ({UPSELL_TRIGGER_RULES.length})
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по статьям и триггерам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === "articles" ? (
            filteredArticles.length === 0 ? (
              <p className="text-center py-10 text-sm text-zinc-500">Ничего не найдено по вашему запросу</p>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-4 space-y-3 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-100">{article.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{article.summary}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block px-2.5 py-1 rounded bg-sky-950/60 border border-sky-800/50 text-sky-300 text-xs font-semibold">
                        {article.pricing}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded border border-zinc-800 leading-relaxed">
                    {article.details}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      Срок: {article.deliveryTimeline}
                    </span>
                    <span className="text-zinc-600">|</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Tag className="w-3 h-3 text-zinc-500" />
                      {article.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 text-[10px]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )
          ) : filteredRules.length === 0 ? (
            <p className="text-center py-10 text-sm text-zinc-500">Сценарии допродаж не найдены</p>
          ) : (
            filteredRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-4 space-y-3 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h3 className="text-sm font-semibold text-zinc-100">{rule.name}</h3>
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs font-semibold">
                    {rule.estimatedPriceIncrease}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800/80">
                    <span className="text-zinc-400 font-medium block mb-1">Боль клиента:</span>
                    <span className="text-zinc-300 leading-relaxed">{rule.clientPainPoint}</span>
                  </div>
                  <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800/80">
                    <span className="text-zinc-400 font-medium block mb-1">Ценность для клиента:</span>
                    <span className="text-zinc-300 leading-relaxed">{rule.valueProposition}</span>
                  </div>
                </div>

                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-xs">
                  <span className="text-zinc-400 font-medium block mb-1">Скрипт для менеджера (пивот):</span>
                  <p className="text-zinc-200 italic font-mono text-[11px] leading-relaxed">"{rule.suggestedPitch}"</p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
                  <span className="text-zinc-500 text-[11px]">Триггеры в тексте:</span>
                  {rule.triggerKeywords.map((kw) => (
                    <span key={kw} className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 text-[10px]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
