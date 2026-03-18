import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCategoryColor } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get("months") ?? "6");

    const [budgets, expenses] = await Promise.all([
      prisma.budget.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.expense.findMany({ orderBy: { date: "desc" } }),
    ]);

    const totalAllocated = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const currentBalance = totalAllocated - totalSpent;
    const savingsRate = totalAllocated > 0
      ? Math.max(0, (currentBalance / totalAllocated) * 100)
      : 0;

    // Category breakdown of expenses
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
      const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const spent = expenses
        .filter((e) => { const dt = new Date(e.date); return dt >= start && dt <= end; })
        .reduce((s, e) => s + e.amount, 0);

      const allocated = budgets
        .filter((b) => { const dt = new Date(b.startDate); return dt >= start && dt <= end; })
        .reduce((s, b) => s + b.amount, 0);

      return { month: label, spent, allocated };
    });

    // Budget breakdown (just amounts per budget entry, for pie/bar)
    const budgetBreakdown = budgets.map((b) => ({
      name: b.name,
      amount: b.amount,
      color: b.color,
      category: b.category,
    }));

    return NextResponse.json({
      totalAllocated,
      totalSpent,
      currentBalance,
      totalExpenses: expenses.length,
      budgetCount: budgets.length,
      savingsRate,
      topCategory,
      monthlyTrend,
      categoryBreakdown,
      budgetBreakdown,
      recentExpenses: expenses.slice(0, 10),
      recentBudgets: budgets.slice(0, 5),
    });
  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
