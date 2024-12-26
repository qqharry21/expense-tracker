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
  if (!session?.user) {
    redirect('/');
  }

  const userId = session.user.id;
  const expenses = (
    await prisma.expense.findMany({
      where: { userId },
      orderBy: [{ amount: 'desc' }, { frequency: 'asc' }],
    })
  ).reverse();

  return (
    <div className="container mx-auto space-y-8 p-4">
      <ExpenseHeader expenses={expenses} />
      <ExpenseCardList expenses={expenses} />
    </div>
  );
}
