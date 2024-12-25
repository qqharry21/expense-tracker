'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { incomeSchema } from '@/lib/schema';
import { actionData } from 'http-react';
import { revalidatePath } from 'next/cache';

export async function createIncome(data: any) {
  try {
    const session = await auth();
    if (!session)
      return actionData('此帳號未授權或登入逾時，請嘗試重新登入', {
        status: 401,
      });

    const userId = session.user?.id;

    const parsed = incomeSchema.safeParse(data);
    if (!parsed.success)
      return actionData(parsed.error.format(), { status: 400 });

    const newIncome = await prisma.income.create({
      data: {
        ...data,
        userId,
      },
    });
    revalidatePath('/dashboard/incomes');
    return actionData(newIncome, { status: 201 });
  } catch (error) {
    console.log('🚨 - error', error);
    return actionData(error, { status: 500 });
  }
}
