"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Budget, BudgetFormData, CATEGORIES, PERIOD_OPTIONS } from "@/lib/types";

const COLORS = [
  "#6366f1","#8b5cf6","#ec4899","#ef4444",
  "#f97316","#f59e0b","#22c55e","#14b8a6",
  "#06b6d4","#3b82f6","#a855f7","#64748b",
];

const DEFAULT_FORM: BudgetFormData = {
  name: "", amount: 0, category: "other",
  period: "MONTHLY", color: "#6366f1", icon: "wallet",
};

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: BudgetFormData) => Promise<void>;
  initial?: Budget | null;
}

export function BudgetModal({ open, onClose, onSave, initial }: BudgetModalProps) {
  const [form, setForm] = useState<BudgetFormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial
      ? { name: initial.name, amount: initial.amount, category: initial.category,
          period: initial.period, color: initial.color, icon: initial.icon,
          endDate: initial.endDate ?? undefined }
      : DEFAULT_FORM);
    setError("");
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.amount) { setError("Name and amount are required."); return; }
    setLoading(true); setError("");
    try { await onSave(form); onClose(); }
    catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Sheet on mobile, centered modal on sm+ */}
      <div className="relative bg-bg-card border border-border
                      w-full rounded-t-3xl sm:rounded-2xl
                      sm:max-w-md
                      max-h-[92dvh] overflow-y-auto
                      shadow-card animate-slide-up sm:animate-scale-in">
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border-light" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
            {initial ? "Edit Budget" : "New Budget"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-text-dim hover:bg-bg-hover touch-manipulation">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          {error && (
            <div className="px-3 py-2.5 bg-danger/10 border border-danger/30 rounded-xl text-sm text-danger">{error}</div>
          )}
          <div>
            <label className="label">Budget Name</label>
            <input className="input" placeholder="e.g. Monthly Groceries" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount ($)</label>
              <input className="input" type="number" min="0" step="0.01" placeholder="0.00"
                value={form.amount || ""}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="label">Period</label>
              <select className="input" value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value as BudgetFormData["period"] })}>
                {PERIOD_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button key={color} type="button" onClick={() => setForm({ ...form, color })}
                  className="w-8 h-8 rounded-xl transition-all touch-manipulation flex-shrink-0"
                  style={{ backgroundColor: color,
                    outline: form.color === color ? `2px solid ${color}` : "none",
                    outlineOffset: "2px", opacity: form.color === color ? 1 : 0.55 }} />
              ))}
            </div>
          </div>
          <div>
            <label className="label">End Date (optional)</label>
            <input className="input" type="date" value={form.endDate ?? ""}
              onChange={(e) => setForm({ ...form, endDate: e.target.value || undefined })} />
          </div>
          <div className="flex gap-2 pt-1 pb-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving…" : initial ? "Save Changes" : "Create Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
