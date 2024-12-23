import { Metadata } from 'next';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '收入 - 後台',
  description: '這是收入列表頁面。',
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
      <h1 className="mb-6 text-3xl font-bold">收入</h1>
      <p>收入來源分佈 - 收入來源堆疊柱狀圖 BarChart</p>
      <p>總收入趨勢 - 總收入折線圖 LineChart</p>
    </div>
  );
}
