import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCategoryColor } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get("months") ?? "6");

    const [budgets, expenses] = await Promise.all([
      prisma.budget.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.expense.findMany({
        orderBy: { date: "desc" },
        include: { budget: true },
      }),
    ]);

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const overBudgetCount = budgets.filter((b) => b.spent > b.amount).length;
    const savingsRate =
      totalBudget > 0
        ? Math.max(0, ((totalBudget - totalSpent) / totalBudget) * 100)
        : 0;

    // Category breakdown
    const categoryMap: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] ?? 0) + e.amount;
    });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
        color: getCategoryColor(category),
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = categoryBreakdown[0]?.category ?? "N/A";

    // Monthly trend (last N months)
    const now = new Date();
    const monthlyTrend = Array.from({ length: months }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
      const month = d.toLocaleString("default", { month: "short", year: "2-digit" });
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const spent = expenses
        .filter((e) => {
          const date = new Date(e.date);
          return date >= monthStart && date <= monthEnd;
        })
        .reduce((sum, e) => sum + e.amount, 0);

      // Estimate budget per month from monthly budgets
      const budget = budgets
        .filter((b) => b.period === "MONTHLY")
        .reduce((sum, b) => sum + b.amount, 0);

      return { month, spent, budget };
    });

    // Budget utilization
    const budgetUtilization = budgets.map((b) => ({
      name: b.name,
      budget: b.amount,
      spent: b.spent,
      percentage: b.amount > 0 ? (b.spent / b.amount) * 100 : 0,
      color: b.color,
    }));

    const recentExpenses = expenses.slice(0, 10);

    return NextResponse.json({
      totalBudget,
      totalSpent,
      totalExpenses: expenses.length,
      budgetCount: budgets.length,
      overBudgetCount,
      savingsRate,
      topCategory,
      monthlyTrend,
      categoryBreakdown,
      budgetUtilization,
      recentExpenses,
    });
  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
