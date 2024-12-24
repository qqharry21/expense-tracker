'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { expenseSchema } from '@/lib/schema';
import { actionData } from 'http-react';
import { revalidatePath } from 'next/cache';

export async function createExpense(data: any) {
  try {
    const session = await auth();
    if (!session) return actionData('Unauthorized', { status: 401 });

    const parsed = expenseSchema.safeParse(data);
    if (!parsed.success)
      return actionData(parsed.error.format(), { status: 400 });

    const newExpense = await prisma.expense.create({
      data: {
        ...data,
        userId: session.user?.id,
      },
    });
    revalidatePath('/dashboard/expenses');
    return actionData(newExpense, { status: 201 });
  } catch (error) {
    console.log('🚨 - error', error);
    return actionData(error, { status: 500 });
  }
}

export async function updateExpense(data: any) {
  try {
    const session = await auth();
    if (!session) return actionData('Unauthorized', { status: 401 });

    const parsed = expenseSchema.safeParse(data);
    if (!parsed.success)
      return actionData(parsed.error.format(), { status: 400 });

    const { id, ...updateData } = parsed.data;

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: updateData,
    });
    revalidatePath('/dashboard/expenses');
    return actionData(updatedExpense, { status: 200 });
  } catch (error) {
    return actionData(error, { status: 500 });
  }
}

export async function deleteExpense(id: string) {
  try {
    const session = await auth();
    if (!session) return actionData('Unauthorized', { status: 401 });

    const deletedExpense = await prisma.expense.delete({
      where: { id },
    });
    revalidatePath('/dashboard/expenses');
    return actionData(deletedExpense, { status: 204 });
  } catch (error) {
    return actionData(error, { status: 500 });
  }
}
