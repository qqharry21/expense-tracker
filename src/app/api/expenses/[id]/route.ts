import dbConnect from '@/lib/mongodb';
import Expense from '@/models/Expense';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const expenseSchema = z.object({
  date: z.string().min(1),
  category: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().optional(),
  type: z.enum(['一次性', '每月固定開銷', '每年固定開銷']),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const expense = await Expense.findById(params.id);
    if (!expense) {
      return NextResponse.json({ error: '消費紀錄不存在' }, { status: 404 });
    }
    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '無法取得消費紀錄' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    const parsed = expenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const expense = await Expense.findByIdAndUpdate(params.id, parsed.data, { new: true });
    if (!expense) {
      return NextResponse.json({ error: '消費紀錄不存在' }, { status: 404 });
    }

    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '無法更新消費紀錄' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const expense = await Expense.findByIdAndDelete(params.id);
    if (!expense) {
      return NextResponse.json({ error: '消費紀錄不存在' }, { status: 404 });
    }
    return NextResponse.json({ message: '消費紀錄已刪除' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '無法刪除消費紀錄' }, { status: 500 });
  }
}
