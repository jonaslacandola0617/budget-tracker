"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Expense, ExpenseFormData, Budget, CATEGORIES } from "@/lib/types";

const today = () => new Date().toISOString().split("T")[0];
const DEFAULT_FORM: ExpenseFormData = {
  title: "", amount: 0, category: "other", date: today(), notes: "", budgetId: "",
};

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ExpenseFormData) => Promise<void>;
  initial?: Expense | null;
  budgets: Budget[];
}

export function ExpenseModal({ open, onClose, onSave, initial, budgets }: ExpenseModalProps) {
  const [form, setForm] = useState<ExpenseFormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial
      ? { title: initial.title, amount: initial.amount, category: initial.category,
          date: initial.date.split("T")[0], notes: initial.notes ?? "", budgetId: initial.budgetId ?? "" }
      : { ...DEFAULT_FORM, date: today() });
    setError("");
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount) { setError("Title and amount are required."); return; }
    setLoading(true); setError("");
    try {
      await onSave({ ...form, budgetId: form.budgetId || undefined, notes: form.notes || undefined });
      onClose();
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-card border border-border
                      w-full rounded-t-3xl sm:rounded-2xl
                      sm:max-w-md
                      max-h-[92dvh] overflow-y-auto
                      shadow-card animate-slide-up sm:animate-scale-in">
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border-light" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
            {initial ? "Edit Expense" : "Log Expense"}
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
            <label className="label">Link to Budget (optional)</label>
            <select className="input" value={form.budgetId}
              onChange={(e) => setForm({ ...form, budgetId: e.target.value })}>
              <option value="">No budget</option>
              {budgets.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Notes (optional)</label>
            <textarea className="input resize-none" rows={2} placeholder="Any additional details…"
              value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-1 pb-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving…" : initial ? "Save Changes" : "Log Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
