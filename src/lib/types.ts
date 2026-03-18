export type Period = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  category: string;
  period: Period;
  startDate: string;
  endDate?: string | null;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  expenses?: Expense[];
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string | null;
  budgetId?: string | null;
  budget?: Budget | null;
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
  endDate?: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  budgetId?: string;
}

export interface AnalyticsSummary {
  totalBudget: number;
  totalSpent: number;
  totalExpenses: number;
  budgetCount: number;
  overBudgetCount: number;
  savingsRate: number;
  topCategory: string;
  monthlyTrend: MonthlyTrend[];
  categoryBreakdown: CategoryBreakdown[];
  budgetUtilization: BudgetUtilization[];
  recentExpenses: Expense[];
}

export interface MonthlyTrend {
  month: string;
  spent: number;
  budget: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface BudgetUtilization {
  name: string;
  budget: number;
  spent: number;
  percentage: number;
  color: string;
}

export const CATEGORIES = [
  { label: "Housing", value: "housing", color: "#6366f1" },
  { label: "Food & Dining", value: "food", color: "#f59e0b" },
  { label: "Transportation", value: "transportation", color: "#3b82f6" },
  { label: "Healthcare", value: "healthcare", color: "#10b981" },
  { label: "Entertainment", value: "entertainment", color: "#ec4899" },
  { label: "Shopping", value: "shopping", color: "#f97316" },
  { label: "Education", value: "education", color: "#8b5cf6" },
  { label: "Utilities", value: "utilities", color: "#14b8a6" },
  { label: "Travel", value: "travel", color: "#06b6d4" },
  { label: "Personal Care", value: "personal", color: "#a855f7" },
  { label: "Savings", value: "savings", color: "#22c55e" },
  { label: "Other", value: "other", color: "#64748b" },
];

export const BUDGET_ICONS = [
  "wallet",
  "home",
  "car",
  "utensils",
  "heart-pulse",
  "tv",
  "shopping-bag",
  "graduation-cap",
  "zap",
  "plane",
  "user",
  "more-horizontal",
];

export const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Quarterly", value: "QUARTERLY" },
  { label: "Yearly", value: "YEARLY" },
];

export function getCategoryColor(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.color ?? "#64748b";
}

export function getCategoryLabel(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
