import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { ExpenseCardList } from '@/components/expense/ExpenseCardList';
import { ExpenseHeader } from '@/components/expense/ExpenseHeader';

import { auth } from '@/auth';
import { ChartsContainer } from '@/components/ChartsContainer';
import { ExpenseCharts } from '@/components/expense/ExpenseCharts';
import {
  ExpenseCardListSkeleton,
  ExpenseChartSkeleton,
  ExpenseStatsSkeleton,
} from '@/components/expense/ExpenseSkeleton';
import { ExpenseStats } from '@/components/expense/ExpenseStats';
import { Suspense } from 'react';

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

  return (
    <div className="container mx-auto space-y-8 p-4">
      <ExpenseHeader />
      <ChartsContainer>
        <Suspense fallback={<ExpenseStatsSkeleton length={2} />}>
          <ExpenseStats userId={userId} />
        </Suspense>

        <Suspense fallback={<ExpenseChartSkeleton length={2} />}>
          <ExpenseCharts userId={userId} />
        </Suspense>
      </ChartsContainer>

      <Suspense fallback={<ExpenseCardListSkeleton />}>
        <ExpenseCardList userId={userId} />
      </Suspense>
    </div>
  );
}
