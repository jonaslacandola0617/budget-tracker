"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Expense, ExpenseFormData, Budget, CATEGORIES } from "@/lib/types";

const today = () => new Date().toISOString().split("T")[0];
const DEFAULT_FORM: ExpenseFormData = { title: "", amount: 0, category: "other", date: today(), notes: "", budgetTag: "" };

interface Props { open: boolean; onClose: () => void; onSave: (d: ExpenseFormData) => Promise<void>; initial?: Expense | null; budgets: Budget[]; }

export function ExpenseModal({ open, onClose, onSave, initial, budgets }: Props) {
  const [form, setForm] = useState<ExpenseFormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial
      ? { title: initial.title, amount: initial.amount, category: initial.category,
          date: initial.date.split("T")[0], notes: initial.notes ?? "", budgetTag: initial.budgetTag ?? "" }
      : { ...DEFAULT_FORM, date: today() });
    setError("");
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!form.title || !form.amount) { setError("Title and amount are required."); return; }
    setLoading(true); setError("");
    try {
      await onSave({ ...form, budgetTag: form.budgetTag || undefined, notes: form.notes || undefined });
      onClose();
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — bottom sheet on mobile, centered on sm+ */}
      <div className="fixed z-[61] inset-x-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4"
           style={{ bottom: 0 }}>
        <div className="modal-sheet bg-bg-card border border-border w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl flex flex-col"
             style={{ maxHeight: "88dvh" }}>

          {/* Drag handle — mobile only */}
          <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-border-light" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
            <div>
              <h2 className="font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                {initial ? "Edit Expense" : "Log Expense"}
              </h2>
              <p className="text-xs text-text-dim mt-0.5">Deducted from your central balance</p>
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
              <label className="label">Title</label>
              <input className="input" placeholder="e.g. Weekly groceries" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Amount ($)</label>
                <input className="input" type="number" min="0" step="0.01" placeholder="0.00"
                  value={form.amount || ""}
                  onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="label">Date</label>
                <input className="input" type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })} />
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
              <label className="label">Tag to Budget (optional)</label>
              <select className="input" value={form.budgetTag}
                onChange={(e) => setForm({ ...form, budgetTag: e.target.value })}>
                <option value="">No tag</option>
                {budgets.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
              <p className="text-xs text-text-dim mt-1">Links this expense to a budget for record-keeping only</p>
            </div>
            <div>
              <label className="label">Notes (optional)</label>
              <textarea className="input resize-none" rows={2} placeholder="Any additional details…"
                value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          {/* Footer — always pinned at bottom */}
          <div className="flex-shrink-0 flex gap-3 px-5 py-4 border-t border-border bg-bg-card">
            <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving…" : initial ? "Save Changes" : "Log Expense"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
