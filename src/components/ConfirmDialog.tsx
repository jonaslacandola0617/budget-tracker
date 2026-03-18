"use client";

import { AlertTriangle, X } from "lucide-react";

interface Props {
  open: boolean; title: string; description: string;
  confirmLabel?: string; onConfirm: () => void; onCancel: () => void;
}

export function ConfirmDialog({ open, title, description, confirmLabel = "Delete", onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Sheet */}
      <div className="fixed z-[61] inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4">
        <div className="bg-bg-card border border-border w-full sm:max-w-sm sm:rounded-2xl rounded-t-3xl flex flex-col">

          {/* Drag handle */}
          <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-border-light" />
          </div>

          {/* Content */}
          <div className="px-5 pt-4 pb-2 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
            </div>
            <button onClick={onCancel} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-dim hover:bg-bg-hover touch-manipulation flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-5 py-4 border-t border-border mt-2 bg-bg-card">
            <button onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
            <button onClick={onConfirm} className="btn-danger flex-1">{confirmLabel}</button>
          </div>
        </div>
      </div>
    </>
  );
}
