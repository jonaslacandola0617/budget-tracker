"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Wallet, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AnalyticsSummary, formatCurrency, formatPercent, getCategoryLabel } from "@/lib/types";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const MONTHS_OPTIONS = [
  { label: "3 mo", value: 3 },
  { label: "6 mo", value: 6 },
  { label: "12 mo", value: 12 },
];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(6);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?months=${months}`).then((r) => r.json()).then((d) => { setAnalytics(d); setLoading(false); });
  }, [months]);

  if (loading || !analytics) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-28 skeleton" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card h-64 skeleton" />)}
        </div>
      </div>
    );
  }

  const a = analytics;
  const netBalance = a.totalBudget - a.totalSpent;

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Analytics</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">Financial insights and trends</p>
        </div>
        <div className="flex gap-1 bg-bg-card border border-border rounded-xl p-1">
          {MONTHS_OPTIONS.map((o) => (
            <button key={o.value} onClick={() => setMonths(o.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all touch-manipulation
                ${months === o.value ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Budget" value={formatCurrency(a.totalBudget)} icon={Wallet} sub={`${a.budgetCount} budgets`} />
        <StatCard label="Total Spent" value={formatCurrency(a.totalSpent)} icon={TrendingDown} sub={`${a.totalExpenses} expenses`} variant={a.totalSpent > a.totalBudget ? "danger" : "default"} />
        <StatCard label={netBalance >= 0 ? "Saved" : "Over"} value={formatCurrency(Math.abs(netBalance))} icon={TrendingUp} variant={netBalance >= 0 ? "success" : "danger"} sub={`${formatPercent(a.savingsRate)} savings`} />
        <StatCard label="Over Budget" value={String(a.overBudgetCount)} icon={AlertCircle} variant={a.overBudgetCount > 0 ? "warning" : "success"} sub={`of ${a.budgetCount}`} />
      </div>

      {/* Trend — full width */}
      <div className="card p-4 sm:p-5">
        <h2 className="font-semibold text-text-primary mb-4 text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
          Monthly Spending Trend
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={a.monthlyTrend}>
            <defs>
              <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c6af7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c6af7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222940" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={45} />
            <Tooltip contentStyle={{ background: "#181d27", border: "1px solid #222940", borderRadius: "12px", fontSize: "12px" }}
              labelStyle={{ color: "#94a3b8" }} formatter={(val: number, name: string) => [formatCurrency(val), name]} />
            <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>} />
            <Area type="monotone" dataKey="budget" stroke="#22c55e" strokeWidth={1.5} fill="url(#bg3)" strokeDasharray="4 4" name="Budget" />
            <Area type="monotone" dataKey="spent" stroke="#7c6af7" strokeWidth={2} fill="url(#sg2)" name="Spent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category + Utilization — stack on mobile, side-by-side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-4 sm:p-5">
          <h2 className="font-semibold text-text-primary mb-4 text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
            Spending by Category
          </h2>
          {a.categoryBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={a.categoryBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="amount" paddingAngle={2}>
                    {a.categoryBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#181d27", border: "1px solid #222940", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(val: number) => [formatCurrency(val)]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {a.categoryBreakdown.map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-xs sm:text-sm text-text-secondary">{getCategoryLabel(c.category)}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xs text-text-dim tabular">{formatPercent(c.percentage)}</span>
                      <span className="text-xs sm:text-sm font-medium text-text-primary tabular">{formatCurrency(c.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="py-12 text-center text-sm text-text-dim">No expense data yet.</div>}
        </div>

        <div className="card p-4 sm:p-5">
          <h2 className="font-semibold text-text-primary mb-4 text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
            Budget Utilization
          </h2>
          {a.budgetUtilization.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={a.budgetUtilization} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222940" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: "#181d27", border: "1px solid #222940", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(val: number) => [`${val.toFixed(0)}%`]} />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                    {a.budgetUtilization.map((entry, i) => (
                      <Cell key={i} fill={entry.percentage >= 100 ? "#ef4444" : entry.percentage >= 80 ? "#f59e0b" : entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {a.budgetUtilization.map((b) => (
                  <div key={b.name} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-text-secondary truncate max-w-[120px]">{b.name}</span>
                    <span className={`tabular font-medium ${b.percentage >= 100 ? "text-danger" : b.percentage >= 80 ? "text-warning" : "text-text-primary"}`}>
                      {formatCurrency(b.spent)} / {formatCurrency(b.budget)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="py-12 text-center text-sm text-text-dim">No budget data yet.</div>}
        </div>
      </div>

      {a.topCategory && a.topCategory !== "N/A" && (
        <div className="card p-4 sm:p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-text-secondary">Top spending category</p>
            <p className="font-semibold text-text-primary truncate" style={{ fontFamily: "var(--font-display)" }}>
              {getCategoryLabel(a.topCategory)}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs sm:text-sm text-text-secondary">Savings rate</p>
            <p className={`font-bold tabular ${a.savingsRate > 0 ? "text-success" : "text-danger"}`}
               style={{ fontFamily: "var(--font-display)" }}>
              {formatPercent(a.savingsRate)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
