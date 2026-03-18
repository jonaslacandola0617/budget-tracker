import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const budgetId = searchParams.get("budgetId");
    const category = searchParams.get("category");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limit = searchParams.get("limit");

    const where: Record<string, unknown> = {};
    if (budgetId) where.budgetId = budgetId;
    if (category) where.category = category;
    if (from || to) {
      where.date = {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      };
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: { budget: true },
      orderBy: { date: "desc" },
      ...(limit && { take: parseInt(limit) }),
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("[EXPENSES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, amount, category, date, notes, budgetId } = body;

    if (!title || !amount || !category) {
      return NextResponse.json(
        { error: "Title, amount, and category are required" },
        { status: 400 }
      );
    }

    const expenseAmount = parseFloat(amount);

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: expenseAmount,
        category,
        date: date ? new Date(date) : new Date(),
        notes: notes ?? null,
        budgetId: budgetId ?? null,
      },
      include: { budget: true },
    });

    // Update budget spent amount if linked
    if (budgetId) {
      await prisma.budget.update({
        where: { id: budgetId },
        data: { spent: { increment: expenseAmount } },
      });
    }

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("[EXPENSES_POST]", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
