import { Metadata } from 'next';

import { auth } from '@/auth';
import { ComingSoon } from '@/components/ComingSoon';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '收入 - 後台',
  description: '這是收入列表頁面。',
};

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }
  const userId = session.user.id;

  const incomes = (
    await prisma.income.findMany({
      where: { userId },
      orderBy: [{ amount: 'desc' }, { frequency: 'asc' }],
    })
  ).reverse();

  return (
    <>
      {/* <p>收入來源分佈 - 收入來源堆疊柱狀圖 BarChart</p>
      <p>總收入趨勢 - 總收入折線圖 LineChart</p> */}
      {/* <IncomeHeader />
      <IncomeCardList incomes={incomes} /> */}
      <ComingSoon />
    </>
  );
}
