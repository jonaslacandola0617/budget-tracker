import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const budgetTag = searchParams.get("budgetTag");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limit = searchParams.get("limit");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (budgetTag) where.budgetTag = budgetTag;
    if (from || to) {
      where.date = {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      };
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: "desc" },
      ...(limit && { take: parseInt(limit) }),
    });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("[EXPENSES_GET]", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, amount, category, date, notes, budgetTag } = body;

    if (!title || !amount || !category) {
      return NextResponse.json({ error: "Title, amount, and category are required" }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : new Date(),
        notes: notes ?? null,
        budgetTag: budgetTag ?? null,
      },
    });
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("[EXPENSES_POST]", error);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
