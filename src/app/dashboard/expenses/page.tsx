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
      <p>
        堆疊柱狀圖（BarChart）：展示不同支出類別（如食品、租金、娛樂）的支出分佈。
      </p>
      <p>折線圖（LineChart）：展示總支出的趨勢。</p>
      <p>圓餅圖（PieChart）：顯示支出在不同類別中的比例。</p>
      <ExpenseHeader />
      <ExpenseCardList expenses={expenses} />
    </div>
  );
}
