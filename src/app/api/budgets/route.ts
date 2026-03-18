import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (period) where.period = period;
    if (category) where.category = category;

    const budgets = await prisma.budget.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("[BUDGETS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, amount, category, period, color, icon, notes, endDate } = body;

    if (!name || !amount || !category) {
      return NextResponse.json({ error: "Name, amount, and category are required" }, { status: 400 });
    }

    const budget = await prisma.budget.create({
      data: {
        name,
        amount: parseFloat(amount),
        category,
        period: period ?? "MONTHLY",
        color: color ?? "#6366f1",
        icon: icon ?? "wallet",
        notes: notes ?? null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("[BUDGETS_POST]", error);
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
  }
}
