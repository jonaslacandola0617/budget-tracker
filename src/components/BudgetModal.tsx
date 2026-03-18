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
  name: "", amount: 0, category: "other", period: "MONTHLY", color: "#22c55e", icon: "wallet",
};

interface Props { open: boolean; onClose: () => void; onSave: (d: BudgetFormData) => Promise<void>; initial?: Budget | null; }

export function BudgetModal({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<BudgetFormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial
      ? { name: initial.name, amount: initial.amount, category: initial.category,
          period: initial.period, color: initial.color, icon: initial.icon,
          notes: initial.notes ?? undefined, endDate: initial.endDate ?? undefined }
      : DEFAULT_FORM);
    setError("");
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!form.name || !form.amount) { setError("Name and amount are required."); return; }
    setLoading(true); setError("");
    try { await onSave(form); onClose(); }
    catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed z-[61] inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4">
        <div className="bg-bg-card border border-border w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl flex flex-col"
             style={{ height: "85dvh", maxHeight: "85dvh" }}>

          {/* Drag handle */}
          <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-border-light" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
            <div>
              <h2 className="font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                {initial ? "Edit Budget Allocation" : "Add Budget Allocation"}
              </h2>
              <p className="text-xs text-text-dim mt-0.5">Funds added to your central balance</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-text-dim hover:bg-bg-hover touch-manipulation">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4">
            {error && (
              <div className="px-3 py-2.5 bg-danger/10 border border-danger/30 rounded-xl text-sm text-danger">{error}</div>
            )}
            <div>
              <label className="label">Allocation Name</label>
              <input className="input" placeholder="e.g. Monthly Salary, Grocery Fund" value={form.name}
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
                    style={{ backgroundColor: color, outline: form.color === color ? `2px solid ${color}` : "none", outlineOffset: "2px", opacity: form.color === color ? 1 : 0.55 }} />
                ))}
              </div>
            </div>
            <div>
              <label className="label">Notes (optional)</label>
              <textarea className="input resize-none" rows={2} placeholder="e.g. Main income, side project…"
                value={form.notes ?? ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div>
              <label className="label">End Date (optional)</label>
              <input className="input" type="date" value={form.endDate ?? ""}
                onChange={(e) => setForm({ ...form, endDate: e.target.value || undefined })} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 flex gap-3 px-5 py-4 border-t border-border bg-bg-card">
            <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving…" : initial ? "Save Changes" : "Add Allocation"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
