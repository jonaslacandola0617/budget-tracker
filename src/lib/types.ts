export type Period = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

// A Budget = an allocation/deposit into the central pool
export interface Budget {
  id: string;
  name: string;
  amount: number;
  category: string;
  period: Period;
  startDate: string;
  endDate?: string | null;
  color: string;
  icon: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// An Expense = a deduction from the central pool
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string | null;
  budgetTag?: string | null; // optional label only
  createdAt: string;
  updatedAt: string;
}

export interface BudgetFormData {
  name: string;
  amount: number;
  category: string;
  period: Period;
  color: string;
  icon: string;
  notes?: string;
  endDate?: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  budgetTag?: string;
}

export interface AnalyticsSummary {
  totalAllocated: number;   // sum of all budget entries
  totalSpent: number;       // sum of all expenses
  currentBalance: number;   // totalAllocated - totalSpent
  totalExpenses: number;    // count
  budgetCount: number;      // count
  savingsRate: number;      // % of allocated that is unspent
  topCategory: string;
  monthlyTrend: MonthlyTrend[];
  categoryBreakdown: CategoryBreakdown[];
  budgetBreakdown: BudgetBreakdown[];
  recentExpenses: Expense[];
  recentBudgets: Budget[];
}

export interface MonthlyTrend {
  month: string;
  spent: number;
  allocated: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface BudgetBreakdown {
  name: string;
  amount: number;
  color: string;
  category: string;
}

export const CATEGORIES = [
  { label: "Housing",        value: "housing",        color: "#6366f1" },
  { label: "Food & Dining",  value: "food",            color: "#f59e0b" },
  { label: "Transportation", value: "transportation",  color: "#3b82f6" },
  { label: "Healthcare",     value: "healthcare",      color: "#10b981" },
  { label: "Entertainment",  value: "entertainment",   color: "#ec4899" },
  { label: "Shopping",       value: "shopping",        color: "#f97316" },
  { label: "Education",      value: "education",       color: "#8b5cf6" },
  { label: "Utilities",      value: "utilities",       color: "#14b8a6" },
  { label: "Travel",         value: "travel",          color: "#06b6d4" },
  { label: "Personal Care",  value: "personal",        color: "#a855f7" },
  { label: "Savings",        value: "savings",         color: "#22c55e" },
  { label: "Other",          value: "other",           color: "#64748b" },
];

export const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "Weekly",     value: "WEEKLY"    },
  { label: "Monthly",    value: "MONTHLY"   },
  { label: "Quarterly",  value: "QUARTERLY" },
  { label: "Yearly",     value: "YEARLY"    },
];

export function getCategoryColor(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.color ?? "#64748b";
}
export function getCategoryLabel(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.label ?? category;
}
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2,
  }).format(amount);
}
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).format(new Date(date));
}
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
