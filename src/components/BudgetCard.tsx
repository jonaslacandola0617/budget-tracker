"use client";

import { useState } from "react";
import {
  Wallet, Home, Car, Utensils, HeartPulse, Tv,
  ShoppingBag, GraduationCap, Zap, Plane, User,
  MoreHorizontal, Pencil, Trash2, MoreVertical,
} from "lucide-react";
import { Budget, formatCurrency, getCategoryLabel } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  wallet: Wallet, home: Home, car: Car, utensils: Utensils,
  "heart-pulse": HeartPulse, tv: Tv, "shopping-bag": ShoppingBag,
  "graduation-cap": GraduationCap, zap: Zap, plane: Plane,
  user: User, "more-horizontal": MoreHorizontal,
};

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pct = budget.amount > 0 ? Math.min((budget.spent / budget.amount) * 100, 100) : 0;
  const over = budget.spent > budget.amount;
  const remaining = budget.amount - budget.spent;
  const Icon = ICON_MAP[budget.icon] ?? Wallet;

  const barColor = over
    ? "#ef4444"
    : pct > 80
    ? "#f59e0b"
    : budget.color;

  return (
    <div className="card card-hover p-5 flex flex-col gap-4 relative">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${budget.color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color: budget.color }} />
          </div>
          <div>
            <p className="font-semibold text-text-primary leading-tight">{budget.name}</p>
            <p className="text-xs text-text-dim mt-0.5">
              {getCategoryLabel(budget.category)} · {budget.period.charAt(0) + budget.period.slice(1).toLowerCase()}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-dim hover:bg-bg-hover hover:text-text-secondary transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-bg-card border border-border rounded-xl shadow-card overflow-hidden min-w-[130px]">
                <button
                  onClick={() => { onEdit(budget); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => { onDelete(budget.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Amounts */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-text-dim mb-0.5">Spent</p>
          <p className="text-xl font-bold tabular" style={{ color: over ? "#ef4444" : "#e2e8f0", fontFamily: "var(--font-display)" }}>
            {formatCurrency(budget.spent)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-dim mb-0.5">Budget</p>
          <p className="text-sm font-medium text-text-secondary tabular">
            {formatCurrency(budget.amount)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs font-medium tabular ${over ? "text-danger" : pct > 80 ? "text-warning" : "text-text-dim"}`}>
            {pct.toFixed(0)}% used
          </span>
          <span className={`text-xs tabular ${over ? "text-danger" : "text-text-dim"}`}>
            {over ? `${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} left`}
          </span>
        </div>
        <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      {/* Over badge */}
      {over && (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-danger/10 border border-danger/20 rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
          <span className="text-xs font-medium text-danger">Over budget</span>
        </div>
      )}
    </div>
  );
}
