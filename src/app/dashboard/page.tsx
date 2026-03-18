"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, Receipt, TrendingDown, TrendingUp, ArrowRight, Plus, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ExpenseRow } from "@/components/ExpenseRow";
import { ExpenseModal } from "@/components/ExpenseModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  AnalyticsSummary, Budget, Expense, ExpenseFormData,
  formatCurrency, formatPercent, formatDate, getCategoryColor, getCategoryLabel,
} from "@/lib/types";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [expenseModal, setExpenseModal] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    const [aRes, bRes] = await Promise.all([fetch("/api/analytics"), fetch("/api/budgets")]);
    const [aData, bData] = await Promise.all([aRes.json(), bRes.json()]);
    setAnalytics(aData); setBudgets(bData); setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const handleSaveExpense = async (data: ExpenseFormData) => {
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

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-28 skeleton" />)}
        </div>
        <div className="card h-64 skeleton" />
      </div>
    );
  }

  const a = analytics!;
  const netBalance = a.totalBudget - a.totalSpent;

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">Overview of your finances</p>
        </div>
        <button onClick={() => { setEditExpense(null); setExpenseModal(true); }}
          className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Log Expense</span>
          <span className="sm:hidden">Log</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Budget" value={formatCurrency(a.totalBudget)} icon={Wallet}
          sub={`${a.budgetCount} budget${a.budgetCount !== 1 ? "s" : ""}`} />
        <StatCard label="Total Spent" value={formatCurrency(a.totalSpent)} icon={TrendingDown}
          sub={`${a.totalExpenses} expense${a.totalExpenses !== 1 ? "s" : ""}`}
          variant={a.totalSpent > a.totalBudget ? "danger" : "default"} />
        <StatCard label={netBalance >= 0 ? "Remaining" : "Over"} value={formatCurrency(Math.abs(netBalance))}
          icon={TrendingUp} variant={netBalance >= 0 ? "success" : "danger"}
          sub={`${formatPercent(a.savingsRate)} savings rate`} />
        <StatCard label="Over Budget" value={`${a.overBudgetCount}`} icon={AlertCircle}
          sub={`of ${a.budgetCount} budgets`} variant={a.overBudgetCount > 0 ? "warning" : "success"} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
              Spending Trend
            </h2>
            <Link href="/dashboard/analytics" className="text-xs text-accent hover:text-accent-light flex items-center gap-1">
              Analytics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={a.monthlyTrend}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c6af7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c6af7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222940" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${v}`} width={45} />
              <Tooltip contentStyle={{ background: "#181d27", border: "1px solid #222940", borderRadius: "12px", fontSize: "12px" }}
                labelStyle={{ color: "#94a3b8" }} formatter={(val: number) => [formatCurrency(val)]} />
              <Area type="monotone" dataKey="budget" stroke="#22c55e" strokeWidth={1.5} fill="url(#bg2)" strokeDasharray="4 4" name="Budget" />
              <Area type="monotone" dataKey="spent" stroke="#7c6af7" strokeWidth={2} fill="url(#sg)" name="Spent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4 sm:p-5">
          <h2 className="font-semibold text-text-primary mb-4 text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
            By Category
          </h2>
          {a.categoryBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={a.categoryBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="amount" paddingAngle={2}>
                    {a.categoryBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#181d27", border: "1px solid #222940", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(val: number) => [formatCurrency(val)]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {a.categoryBreakdown.slice(0, 4).map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-xs text-text-secondary capitalize">{c.category}</span>
                    </div>
                    <span className="text-xs tabular text-text-dim">{formatPercent(c.percentage)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-text-dim text-center py-8">No expenses yet</p>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-text-primary text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
            Recent Expenses
          </h2>
          <Link href="/dashboard/expenses" className="text-xs text-accent hover:text-accent-light flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {a.recentExpenses.length > 0 ? (
          <>
            {/* Mobile */}
            <div className="sm:hidden divide-y divide-border/50">
              {a.recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center gap-3 px-4 py-3"
                  onClick={() => { setEditExpense(expense as Expense); setExpenseModal(true); }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(expense.category) }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{expense.title}</p>
                    <p className="text-xs text-text-dim">
                      {getCategoryLabel(expense.category)} · {formatDate(expense.date)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-text-primary tabular flex-shrink-0">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))}
            </div>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    {["Title","Category","Date","Budget","Amount",""].map((h) => (
                      <th key={h} className={`px-4 py-3 text-xs font-medium text-text-dim uppercase tracking-wider ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {a.recentExpenses.map((expense) => (
                    <ExpenseRow key={expense.id} expense={expense as Expense}
                      onEdit={(e) => { setEditExpense(e); setExpenseModal(true); }}
                      onDelete={(id) => setDeleteId(id)} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <Receipt className="w-8 h-8 text-text-dim mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No expenses logged yet.</p>
            <button onClick={() => { setEditExpense(null); setExpenseModal(true); }}
              className="mt-3 text-xs text-accent hover:text-accent-light transition-colors">
              Log your first expense →
            </button>
          </div>
        )}
      </div>

      <ExpenseModal open={expenseModal} onClose={() => { setExpenseModal(false); setEditExpense(null); }}
        onSave={handleSaveExpense} initial={editExpense} budgets={budgets} />
      <ConfirmDialog open={!!deleteId} title="Delete Expense"
        description="This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
