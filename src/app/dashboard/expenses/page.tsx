import { Metadata } from 'next';

import { auth } from '@/auth';
import { ExpenseCardList } from '@/components/expense/ExpenseCardList';
import { ExpenseHeader } from '@/components/expense/ExpenseHeader';
import { prisma } from '@/lib/prisma';
import { Types } from '@/lib/types';
import { getRemainingWeeksInMonth } from '@/lib/utils';
import { getDaysInMonth } from 'date-fns';
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

  const currentDate = new Date();

  const userId = session.user.id;
  const expenses = (
    await prisma.expense.findMany({
      where: { userId },
      orderBy: [{ amount: 'desc' }, { frequency: 'asc' }],
    })
  ).reverse();

  const topFiveCategoriesAmount = expenses.reduce(
    (acc, expense) => {
      if (acc[expense.category]) {
        if (expense.frequency === Types.Frequency.DAILY) {
          const totalDaysInMonth = getDaysInMonth(currentDate);
          acc[expense.category] += expense.amount * totalDaysInMonth;
        }
        if (expense.frequency === Types.Frequency.MONTHLY) {
          acc[expense.category] += expense.amount;
        }
        if (expense.frequency === Types.Frequency.WEEKLY) {
          const remainingWeeksInMonth = getRemainingWeeksInMonth(
            expense.startTime,
          );
          acc[expense.category] += expense.amount * remainingWeeksInMonth;
        } else acc[expense.category] += expense.amount;
      } else {
        acc[expense.category] = expense.amount;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  console.log('🚨 - topFiveCategories', topFiveCategoriesAmount);

  return (
    <div className="container mx-auto space-y-8 p-4">
      <ExpenseHeader />
      <ExpenseCardList expenses={expenses} />
    </div>
  );
}
