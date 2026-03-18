import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const expense = await prisma.expense.findUnique({ where: { id: params.id } });
    if (!expense) return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    return NextResponse.json(expense);
  } catch (error) {
    console.error("[EXPENSE_GET]", error);
    return NextResponse.json({ error: "Failed to fetch expense" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, amount, category, date, notes, budgetTag } = body;

    const existing = await prisma.expense.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Expense not found" }, { status: 404 });

    const updated = await prisma.expense.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(category !== undefined && { category }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(notes !== undefined && { notes }),
        ...(budgetTag !== undefined && { budgetTag: budgetTag || null }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[EXPENSE_PATCH]", error);
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.expense.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EXPENSE_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
