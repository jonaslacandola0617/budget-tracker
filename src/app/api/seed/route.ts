import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const now = new Date();
    const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);

    // Budget entries = allocations into the central pool
    await Promise.all([
      prisma.budget.create({ data: { name: "Monthly Salary",      amount: 4500, category: "other",          period: "MONTHLY",   color: "#22c55e", icon: "wallet",        notes: "Main income allocation" } }),
      prisma.budget.create({ data: { name: "Freelance Income",    amount: 800,  category: "other",          period: "MONTHLY",   color: "#6366f1", icon: "wallet",        notes: "Side projects" } }),
      prisma.budget.create({ data: { name: "Grocery Fund",        amount: 600,  category: "food",           period: "MONTHLY",   color: "#f59e0b", icon: "utensils" } }),
      prisma.budget.create({ data: { name: "Transport Budget",    amount: 300,  category: "transportation", period: "MONTHLY",   color: "#3b82f6", icon: "car" } }),
      prisma.budget.create({ data: { name: "Q2 Entertainment",    amount: 600,  category: "entertainment",  period: "QUARTERLY", color: "#ec4899", icon: "tv" } }),
    ]);

    // Expenses = deductions from the pool
    await Promise.all([
      prisma.expense.create({ data: { title: "Whole Foods",       amount: 87.50, category: "food",           date: daysAgo(1),  budgetTag: "Grocery Fund" } }),
      prisma.expense.create({ data: { title: "Monthly Rent",      amount: 1500,  category: "housing",        date: daysAgo(5) } }),
      prisma.expense.create({ data: { title: "Gas station",       amount: 65,    category: "transportation", date: daysAgo(3),  budgetTag: "Transport Budget" } }),
      prisma.expense.create({ data: { title: "Netflix",           amount: 15.99, category: "entertainment",  date: daysAgo(10), budgetTag: "Q2 Entertainment" } }),
      prisma.expense.create({ data: { title: "Electric bill",     amount: 120,   category: "utilities",      date: daysAgo(7) } }),
      prisma.expense.create({ data: { title: "Trader Joe's",      amount: 95,    category: "food",           date: daysAgo(8),  budgetTag: "Grocery Fund" } }),
      prisma.expense.create({ data: { title: "Uber",              amount: 42,    category: "transportation", date: daysAgo(2),  budgetTag: "Transport Budget" } }),
      prisma.expense.create({ data: { title: "Spotify",           amount: 9.99,  category: "entertainment",  date: daysAgo(15), budgetTag: "Q2 Entertainment" } }),
      prisma.expense.create({ data: { title: "Pharmacy",          amount: 35,    category: "healthcare",     date: daysAgo(4) } }),
      prisma.expense.create({ data: { title: "Amazon",            amount: 67.99, category: "shopping",       date: daysAgo(6) } }),
      prisma.expense.create({ data: { title: "Coffee shop",       amount: 22,    category: "food",           date: daysAgo(1),  budgetTag: "Grocery Fund" } }),
      prisma.expense.create({ data: { title: "Internet bill",     amount: 90,    category: "utilities",      date: daysAgo(12) } }),
      prisma.expense.create({ data: { title: "Gym membership",    amount: 45,    category: "personal",       date: daysAgo(20) } }),
      prisma.expense.create({ data: { title: "Train ticket",      amount: 28,    category: "transportation", date: daysAgo(9),  budgetTag: "Transport Budget" } }),
      prisma.expense.create({ data: { title: "Restaurant dinner", amount: 84,    category: "food",           date: daysAgo(14), budgetTag: "Grocery Fund" } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SEED]", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
