"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Expense, formatCurrency, formatDate, getCategoryColor, getCategoryLabel } from "@/lib/types";

interface ExpenseRowProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseRow({ expense, onEdit, onDelete }: ExpenseRowProps) {
  const color = getCategoryColor(expense.category);
  const label = getCategoryLabel(expense.category);

  return (
    <tr className="border-b border-border/50 hover:bg-bg-hover/30 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <div>
            <p className="text-sm font-medium text-text-primary">{expense.title}</p>
            {expense.notes && (
              <p className="text-xs text-text-dim truncate max-w-[200px]">{expense.notes}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="badge text-xs"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {label}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-text-secondary">
        {formatDate(expense.date)}
      </td>
      <td className="px-4 py-3">
        {expense.budget ? (
          <span className="text-xs text-text-dim truncate max-w-[120px] block">
            {expense.budget.name}
          </span>
        ) : (
          <span className="text-xs text-text-dim/40">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-semibold text-text-primary tabular">
          {formatCurrency(expense.amount)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          <button
            onClick={() => onEdit(expense)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-dim hover:bg-bg-hover hover:text-text-secondary transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-dim hover:bg-danger/10 hover:text-danger transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
