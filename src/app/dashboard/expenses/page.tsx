"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Receipt, Search, Pencil, Trash2 } from "lucide-react";
import { ExpenseRow } from "@/components/ExpenseRow";
import { ExpenseModal } from "@/components/ExpenseModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  Budget, Expense, ExpenseFormData, CATEGORIES,
  formatCurrency, formatDate, getCategoryColor, getCategoryLabel,
} from "@/lib/types";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchData = useCallback(async () => {
    const params = new URLSearchParams();
    if (categoryFilter) params.set("category", categoryFilter);
    const [eRes, bRes] = await Promise.all([fetch(`/api/expenses?${params}`), fetch("/api/budgets")]);
    const [eData, bData] = await Promise.all([eRes.json(), bRes.json()]);
    setExpenses(Array.isArray(eData) ? eData : []);
    setBudgets(Array.isArray(bData) ? bData : []);
    setLoading(false);
  }, [categoryFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (data: ExpenseFormData) => {
    const url = editExpense ? `/api/expenses/${editExpense.id}` : "/api/expenses";
    const method = editExpense ? "PATCH" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    await fetchData();
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/expenses/${deleteId}`, { method: "DELETE" });
    setDeleteId(null); await fetchData();
  };

  const filtered = expenses.filter((e) =>
    search ? e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()) : true
  );
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Expenses</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            {filtered.length} expense{filtered.length !== 1 ? "s" : ""} · {formatCurrency(total)} total
          </p>
        </div>
        <button onClick={() => { setEditExpense(null); setModalOpen(true); }}
          className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Log Expense</span>
          <span className="sm:hidden">Log</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
          <input className="input pl-9" placeholder="Search expenses…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-auto" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-10 skeleton rounded-lg" />)}</div>
        ) : filtered.length > 0 ? (
          <>
            {/* Mobile */}
            <div className="sm:hidden divide-y divide-border/50">
              {filtered.map((expense) => (
                <div key={expense.id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getCategoryColor(expense.category) }} />
                  <div className="flex-1 min-w-0" onClick={() => { setEditExpense(expense); setModalOpen(true); }}>
                    <p className="text-sm font-medium text-text-primary truncate">{expense.title}</p>
                    <p className="text-xs text-text-dim mt-0.5">
                      {getCategoryLabel(expense.category)} · {formatDate(expense.date)}
                      {expense.budgetTag && <span className="ml-1 text-accent/70">· {expense.budgetTag}</span>}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-danger tabular">−{formatCurrency(expense.amount)}</span>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditExpense(expense); setModalOpen(true); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-text-dim hover:bg-bg-hover touch-manipulation">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(expense.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-text-dim hover:bg-danger/10 hover:text-danger touch-manipulation">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Title","Category","Date","Budget Tag","Amount",""].map((h) => (
                      <th key={h} className={`px-4 py-3 text-xs font-medium text-text-dim uppercase tracking-wider ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((expense) => (
                    <ExpenseRow key={expense.id} expense={expense}
                      onEdit={(e) => { setEditExpense(e); setModalOpen(true); }}
                      onDelete={(id) => setDeleteId(id)} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Receipt className="w-8 h-8 text-text-dim mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No expenses found.</p>
            {!search && !categoryFilter && (
              <button onClick={() => { setEditExpense(null); setModalOpen(true); }}
                className="mt-3 text-xs text-accent hover:text-accent-light">Log your first expense →</button>
            )}
          </div>
        )}
      </div>

      <ExpenseModal open={modalOpen} onClose={() => { setModalOpen(false); setEditExpense(null); }}
        onSave={handleSave} initial={editExpense} budgets={budgets} />
      <ConfirmDialog open={!!deleteId} title="Delete Expense" description="This action cannot be undone."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
