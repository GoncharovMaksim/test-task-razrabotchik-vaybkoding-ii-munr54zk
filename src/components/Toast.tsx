"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastProps {
  id: string;
  type?: "success" | "error" | "info";
  message: string;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, type = "success", message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
  };

  const borderColors = {
    success: "border-emerald-800/60 bg-emerald-950/40 text-emerald-100",
    error: "border-rose-800/60 bg-rose-950/40 text-rose-100",
    info: "border-sky-800/60 bg-sky-950/40 text-sky-100",
  };

  return (
    <div
      role="status"
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border text-sm shadow-lg backdrop-blur-md transition-all duration-200 ${borderColors[type]}`}
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="text-zinc-400 hover:text-zinc-200 p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
        aria-label="Закрыть уведомление"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
