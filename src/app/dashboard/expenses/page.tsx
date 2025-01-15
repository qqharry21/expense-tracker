import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { ChartSkeleton } from '@/components/ChartSkeleton';
import { ExpenseCardList } from '@/components/expense/ExpenseCardList';
import { ExpenseHeader } from '@/components/expense/ExpenseHeader';

import { auth } from '@/auth';
import { ChartsContainer } from '@/components/ChartsContainer';
import { ExpenseCategoryStackedBarChart } from '@/components/charts/ExpenseCategoryStackedBarChart';
import { TotalExpensesTrendLineChart } from '@/components/charts/TotalExpensesTrendLineChart';
import { prisma } from '@/lib/prisma';
import { startOfMonth, startOfYear, subMonths } from 'date-fns';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '支出列表 - 後台',
  description: '這是支出列表頁面。',
};

const getExpenseData = async (
  dateRange: 'month' | '6months' | 'year' | 'all' = 'month',
  userId?: string,
) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const now = new Date();
  let startTime: Date;

  switch (dateRange) {
    case '6months':
      startTime = startOfMonth(subMonths(now, 5));
      break;
    case 'month':
      startTime = startOfMonth(now);
      break;
    case 'year':
      startTime = startOfYear(now);
      break;
    case 'all':
    default:
      return prisma.expense.findMany({
        where: { userId },
        orderBy: [{ amount: 'desc' }, { frequency: 'asc' }],
      });
  }

  return prisma.expense.findMany({
    where: {
      userId,
      startTime: {
        gte: startTime,
      },
    },
    orderBy: [{ amount: 'desc' }, { frequency: 'asc' }],
  });
};

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  const userId = session.user.id;

  const expenses6Months = getExpenseData('6months', userId);
  const expensesThisMonths = getExpenseData('month', userId);
  // const expensesThisYear = getExpenseData('year', userId);

  return (
    <div className="container mx-auto space-y-8 p-4">
      <ExpenseHeader />
      <ChartsContainer>
        <Suspense fallback={<ChartSkeleton />}>
          <ExpenseCategoryStackedBarChart expenses={await expensesThisMonths} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <TotalExpensesTrendLineChart
            expenses={await expenses6Months}
            totalMonths={6}
          />
        </Suspense>
        <TotalExpensesTrendLineChart
          expenses={await expenses6Months}
          totalMonths={6}
        />
      </ChartsContainer>
      <ExpenseCardList userId={userId} />
    </div>
  );
}
