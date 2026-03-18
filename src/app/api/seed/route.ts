import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Create sample budgets
    const budgets = await Promise.all([
      prisma.budget.create({
        data: {
          name: "Monthly Groceries",
          amount: 600,
          spent: 420,
          category: "food",
          period: "MONTHLY",
          color: "#f59e0b",
          icon: "utensils",
        },
      }),
      prisma.budget.create({
        data: {
          name: "Rent & Housing",
          amount: 1500,
          spent: 1500,
          category: "housing",
          period: "MONTHLY",
          color: "#6366f1",
          icon: "home",
        },
      }),
      prisma.budget.create({
        data: {
          name: "Transportation",
          amount: 300,
          spent: 380,
          category: "transportation",
          period: "MONTHLY",
          color: "#3b82f6",
          icon: "car",
        },
      }),
      prisma.budget.create({
        data: {
          name: "Entertainment",
          amount: 200,
          spent: 95,
          category: "entertainment",
          period: "MONTHLY",
          color: "#ec4899",
          icon: "tv",
        },
      }),
      prisma.budget.create({
        data: {
          name: "Utilities",
          amount: 250,
          spent: 210,
          category: "utilities",
          period: "MONTHLY",
          color: "#14b8a6",
          icon: "zap",
        },
      }),
    ]);

    const now = new Date();
    const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);

    // Create sample expenses
    await Promise.all([
      prisma.expense.create({ data: { title: "Whole Foods", amount: 87.5, category: "food", date: daysAgo(1), budgetId: budgets[0].id } }),
      prisma.expense.create({ data: { title: "Monthly Rent", amount: 1500, category: "housing", date: daysAgo(5), budgetId: budgets[1].id } }),
      prisma.expense.create({ data: { title: "Gas station", amount: 65, category: "transportation", date: daysAgo(3), budgetId: budgets[2].id } }),
      prisma.expense.create({ data: { title: "Netflix", amount: 15.99, category: "entertainment", date: daysAgo(10), budgetId: budgets[3].id } }),
      prisma.expense.create({ data: { title: "Electric bill", amount: 120, category: "utilities", date: daysAgo(7), budgetId: budgets[4].id } }),
      prisma.expense.create({ data: { title: "Trader Joe's", amount: 95, category: "food", date: daysAgo(8), budgetId: budgets[0].id } }),
      prisma.expense.create({ data: { title: "Uber", amount: 42, category: "transportation", date: daysAgo(2), budgetId: budgets[2].id } }),
      prisma.expense.create({ data: { title: "Spotify", amount: 9.99, category: "entertainment", date: daysAgo(15), budgetId: budgets[3].id } }),
      prisma.expense.create({ data: { title: "Pharmacy", amount: 35, category: "healthcare", date: daysAgo(4) } }),
      prisma.expense.create({ data: { title: "Amazon", amount: 67.99, category: "shopping", date: daysAgo(6) } }),
      prisma.expense.create({ data: { title: "Coffee shop", amount: 22, category: "food", date: daysAgo(1), budgetId: budgets[0].id } }),
      prisma.expense.create({ data: { title: "Internet bill", amount: 90, category: "utilities", date: daysAgo(12), budgetId: budgets[4].id } }),
      prisma.expense.create({ data: { title: "Gym membership", amount: 45, category: "personal", date: daysAgo(20) } }),
      prisma.expense.create({ data: { title: "Train ticket", amount: 28, category: "transportation", date: daysAgo(9), budgetId: budgets[2].id } }),
      prisma.expense.create({ data: { title: "Restaurant dinner", amount: 84, category: "food", date: daysAgo(14), budgetId: budgets[0].id } }),
    ]);

    return NextResponse.json({ success: true, message: "Sample data seeded successfully" });
  } catch (error) {
    console.error("[SEED]", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
