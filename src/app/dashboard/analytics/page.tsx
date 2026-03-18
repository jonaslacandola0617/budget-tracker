"use client";

import { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Wallet, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AnalyticsSummary, formatCurrency, formatPercent, getCategoryLabel } from "@/lib/types";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const MONTHS_OPTIONS = [{ label: "3 mo", value: 3 }, { label: "6 mo", value: 6 }, { label: "12 mo", value: 12 }];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(6);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?months=${months}`)
      .then((r) => r.json())
      .then((d) => { setAnalytics(d?.totalAllocated !== undefined ? d : null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [months]);

  if (loading || !analytics) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="card h-32 skeleton" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card h-28 skeleton" />)}
        </div>
        <div className="card h-64 skeleton" />
      </div>
    );
  }

  const a = analytics;

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Analytics</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">Financial insights</p>
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

      {/* Balance summary */}
      <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
        style={{ background: "linear-gradient(135deg, #181d27 0%, #1a1f2e 100%)" }}>
        <div className="flex-1">
          <p className="text-xs text-text-secondary uppercase tracking-widest mb-1">Current Balance</p>
          <p className={`text-3xl font-bold tabular ${a.currentBalance >= 0 ? "text-text-primary" : "text-danger"}`}
            style={{ fontFamily: "var(--font-display)" }}>
            {formatCurrency(Math.abs(a.currentBalance))}
          </p>
        </div>
        <div className="flex gap-6 sm:gap-8">
          <div>
            <p className="text-xs text-text-dim mb-1">Allocated</p>
            <p className="text-lg font-semibold text-success tabular">{formatCurrency(a.totalAllocated)}</p>
          </div>
          <div>
            <p className="text-xs text-text-dim mb-1">Spent</p>
            <p className="text-lg font-semibold text-danger tabular">{formatCurrency(a.totalSpent)}</p>
          </div>
          <div>
            <p className="text-xs text-text-dim mb-1">Saved</p>
            <p className={`text-lg font-semibold tabular ${a.savingsRate > 0 ? "text-accent" : "text-danger"}`}>
              {formatPercent(a.savingsRate)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Total Allocated" value={formatCurrency(a.totalAllocated)} icon={ArrowDownCircle} sub={`${a.budgetCount} entries`} variant="success" />
        <StatCard label="Total Spent" value={formatCurrency(a.totalSpent)} icon={ArrowUpCircle} sub={`${a.totalExpenses} expenses`} variant={a.totalSpent > a.totalAllocated ? "danger" : "default"} />
        <div className="col-span-2 sm:col-span-1">
          <StatCard label="Savings Rate" value={formatPercent(a.savingsRate)} icon={TrendingUp} variant={a.savingsRate > 20 ? "success" : a.savingsRate > 0 ? "warning" : "danger"} />
        </div>
      </div>

      {/* Monthly flow */}
      <div className="card p-4 sm:p-5">
        <h2 className="font-semibold text-text-primary mb-4 text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
          Monthly Cash Flow
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={a.monthlyTrend}>
            <defs>
              <linearGradient id="spG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="alG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222940" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={45} />
            <Tooltip contentStyle={{ background: "#181d27", border: "1px solid #222940", borderRadius: "12px", fontSize: "12px" }}
              labelStyle={{ color: "#94a3b8" }} formatter={(val: number, name: string) => [formatCurrency(val), name]} />
            <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>} />
            <Area type="monotone" dataKey="allocated" stroke="#22c55e" strokeWidth={1.5} fill="url(#alG)" strokeDasharray="4 4" name="Allocated" />
            <Area type="monotone" dataKey="spent" stroke="#ef4444" strokeWidth={2} fill="url(#spG)" name="Spent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category breakdown */}
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

        {/* Budget allocation breakdown */}
        <div className="card p-4 sm:p-5">
          <h2 className="font-semibold text-text-primary mb-4 text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
            Allocations Breakdown
          </h2>
          {a.budgetBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={a.budgetBreakdown} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222940" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: "#181d27", border: "1px solid #222940", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(val: number) => [formatCurrency(val)]} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {a.budgetBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {a.budgetBreakdown.map((b) => (
                  <div key={b.name} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                      <span className="text-text-secondary truncate max-w-[120px]">{b.name}</span>
                    </div>
                    <span className="text-text-primary tabular font-medium">{formatCurrency(b.amount)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="py-12 text-center text-sm text-text-dim">No allocations yet.</div>}
        </div>
      </div>

      {/* Top category insight */}
      {a.topCategory && a.topCategory !== "N/A" && (
        <div className="card p-4 sm:p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-text-secondary">Biggest spending category</p>
            <p className="font-semibold text-text-primary truncate" style={{ fontFamily: "var(--font-display)" }}>
              {getCategoryLabel(a.topCategory)}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs sm:text-sm text-text-secondary">Balance remaining</p>
            <p className={`font-bold tabular ${a.currentBalance >= 0 ? "text-success" : "text-danger"}`}
               style={{ fontFamily: "var(--font-display)" }}>
              {formatCurrency(Math.abs(a.currentBalance))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
