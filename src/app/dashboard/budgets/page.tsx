"use client";

import { useEffect, useState } from "react";
import { Plus, Wallet, ArrowDownCircle } from "lucide-react";
import { BudgetCard } from "@/components/BudgetCard";
import { BudgetModal } from "@/components/BudgetModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Budget, BudgetFormData, PERIOD_OPTIONS, formatCurrency } from "@/lib/types";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState("");

  const fetchBudgets = async () => {
    try {
      const params = new URLSearchParams();
      if (periodFilter) params.set("period", periodFilter);
      const res = await fetch(`/api/budgets?${params}`);
      const data = await res.json();
      setBudgets(Array.isArray(data) ? data : []);
    } catch {
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchBudgets(); }, [periodFilter]);

  const handleSave = async (data: BudgetFormData) => {
    const url = editBudget ? `/api/budgets/${editBudget.id}` : "/api/budgets";
    const method = editBudget ? "PATCH" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    await fetchBudgets();
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/budgets/${deleteId}`, { method: "DELETE" });
    setDeleteId(null); await fetchBudgets();
  };

  const total = budgets.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
            Budget Allocations
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            {budgets.length} allocation{budgets.length !== 1 ? "s" : ""} · {formatCurrency(total)} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="input !w-auto text-sm !py-2" value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
            <option value="">All</option>
            {PERIOD_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <button onClick={() => { setEditBudget(null); setModalOpen(true); }}
            className="btn-primary flex items-center gap-1.5 text-sm whitespace-nowrap">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Allocation</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Total callout */}
      {budgets.length > 0 && (
        <div className="card p-4 flex items-center gap-4 border-success/20">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <ArrowDownCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xs text-text-secondary">Total funds allocated to central balance</p>
            <p className="text-xl font-bold text-success tabular" style={{ fontFamily: "var(--font-display)" }}>
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card h-44 skeleton" />)}
        </div>
      ) : budgets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget}
              onEdit={(b) => { setEditBudget(b); setModalOpen(true); }}
              onDelete={(id) => setDeleteId(id)} />
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center py-16 sm:py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold text-text-primary mb-1" style={{ fontFamily: "var(--font-display)" }}>
            No allocations yet
          </h3>
          <p className="text-sm text-text-secondary mb-4 max-w-xs">
            Add your first budget allocation to fund your central balance.
          </p>
          <button onClick={() => { setEditBudget(null); setModalOpen(true); }} className="btn-primary">
            Add Allocation
          </button>
        </div>
      )}

      <BudgetModal open={modalOpen} onClose={() => { setModalOpen(false); setEditBudget(null); }} onSave={handleSave} initial={editBudget} />
      <ConfirmDialog open={!!deleteId} title="Delete Allocation"
        description="This allocation will be removed from your central balance pool."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
