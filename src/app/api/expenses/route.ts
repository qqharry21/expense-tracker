import dbConnect from '@/lib/mongodb';
import Expense, { IExpense } from '@/models/Expense';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const expenseSchema = z.object({
  date: z.string().min(1),
  category: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().optional(),
  type: z.enum(['一次性', '每月固定開銷', '每年固定開銷']),
});

export async function GET() {
  await dbConnect();
  try {
    const expenses: IExpense[] = await Expense.find().sort({ date: -1 });
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '無法取得消費紀錄' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const parsed = expenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const expense = new Expense(parsed.data);
    await expense.save();
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '無法新增消費紀錄' }, { status: 500 });
  }
}
