"use client";

import { useState } from "react";
import {
  Wallet, Home, Car, Utensils, HeartPulse, Tv,
  ShoppingBag, GraduationCap, Zap, Plane, User, MoreHorizontal,
  MoreVertical, Pencil, Trash2, CalendarDays,
} from "lucide-react";
import { Budget, formatCurrency, getCategoryLabel, PERIOD_OPTIONS } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  wallet: Wallet, home: Home, car: Car, utensils: Utensils,
  "heart-pulse": HeartPulse, tv: Tv, "shopping-bag": ShoppingBag,
  "graduation-cap": GraduationCap, zap: Zap, plane: Plane, user: User,
  "more-horizontal": MoreHorizontal,
};

interface Props { budget: Budget; onEdit: (b: Budget) => void; onDelete: (id: string) => void; }

export function BudgetCard({ budget, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const Icon = ICON_MAP[budget.icon] ?? Wallet;
  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === budget.period)?.label ?? budget.period;

  return (
    <div className="card card-hover p-5 flex flex-col gap-3 relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${budget.color}20` }}>
            <Icon className="w-5 h-5" style={{ color: budget.color }} />
          </div>
          <div>
            <p className="font-semibold text-text-primary leading-tight">{budget.name}</p>
            <p className="text-xs text-text-dim mt-0.5">{getCategoryLabel(budget.category)}</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-dim hover:bg-bg-hover hover:text-text-secondary transition-all touch-manipulation">
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-bg-card border border-border rounded-xl shadow-card overflow-hidden min-w-[130px]">
                <button onClick={() => { onEdit(budget); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-hover touch-manipulation">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => { onDelete(budget.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-danger hover:bg-danger/10 touch-manipulation">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Amount — prominent, like a bank deposit */}
      <div>
        <p className="text-xs text-text-dim mb-0.5">Allocated</p>
        <p className="text-2xl font-bold tabular" style={{ color: budget.color, fontFamily: "var(--font-display)" }}>
          {formatCurrency(budget.amount)}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="badge text-xs" style={{ backgroundColor: `${budget.color}15`, color: budget.color }}>
          {periodLabel}
        </span>
        {budget.endDate && (
          <span className="flex items-center gap-1 text-xs text-text-dim">
            <CalendarDays className="w-3 h-3" />
            {new Date(budget.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>

      {budget.notes && (
        <p className="text-xs text-text-dim leading-relaxed border-t border-border/50 pt-2">{budget.notes}</p>
      )}
    </div>
  );
}
