import { Metadata } from 'next';

import { auth } from '@/auth';
import { ExpenseCardList } from '@/components/expense/ExpenseCardList';
import { ExpenseHeader } from '@/components/expense/ExpenseHeader';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '支出列表 - 後台',
  description: '這是支出列表頁面。',
};

export default async function Page() {
  const session = await auth();
  const expenses = (
    await prisma.expense.findMany({
      where: {
        userId: session?.user?.id,
      },
      orderBy: [{ amount: 'desc' }, { frequency: 'asc' }],
    })
  ).reverse();

  if (!session?.user) {
    redirect('/');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">支出</h1>
      <ExpenseHeader />
      <ExpenseCardList expenses={expenses} />
    </div>
  );
}
