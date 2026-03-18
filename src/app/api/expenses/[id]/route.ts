import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
      include: { budget: true },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("[EXPENSE_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, amount, category, date, notes, budgetId } = body;

    const existing = await prisma.expense.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const newAmount =
      amount !== undefined ? parseFloat(amount) : existing.amount;
    const diff = newAmount - existing.amount;

    // Adjust old budget spent
    if (existing.budgetId && existing.budgetId !== budgetId) {
      await prisma.budget.update({
        where: { id: existing.budgetId },
        data: { spent: { decrement: existing.amount } },
      });
    }

    const updated = await prisma.expense.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(amount !== undefined && { amount: newAmount }),
        ...(category && { category }),
        ...(date && { date: new Date(date) }),
        ...(notes !== undefined && { notes }),
        ...(budgetId !== undefined && { budgetId: budgetId ?? null }),
      },
      include: { budget: true },
    });

    // Update new budget spent
    if (budgetId && budgetId !== existing.budgetId) {
      await prisma.budget.update({
        where: { id: budgetId },
        data: { spent: { increment: newAmount } },
      });
    } else if (budgetId && budgetId === existing.budgetId && diff !== 0) {
      await prisma.budget.update({
        where: { id: budgetId },
        data: { spent: { increment: diff } },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[EXPENSE_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    await prisma.expense.delete({ where: { id: params.id } });

    // Decrement budget spent
    if (expense.budgetId) {
      await prisma.budget.update({
        where: { id: expense.budgetId },
        data: { spent: { decrement: expense.amount } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EXPENSE_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
