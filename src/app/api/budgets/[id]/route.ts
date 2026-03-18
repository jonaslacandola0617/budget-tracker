import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const budget = await prisma.budget.findUnique({ where: { id: params.id } });
    if (!budget) return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    return NextResponse.json(budget);
  } catch (error) {
    console.error("[BUDGET_GET]", error);
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, amount, category, period, color, icon, notes, endDate } = body;

    const existing = await prisma.budget.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Budget not found" }, { status: 404 });

    const updated = await prisma.budget.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(category !== undefined && { category }),
        ...(period !== undefined && { period }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(notes !== undefined && { notes }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[BUDGET_PATCH]", error);
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.budget.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BUDGET_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}
