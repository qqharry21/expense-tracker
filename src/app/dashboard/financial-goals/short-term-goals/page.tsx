import { Metadata } from 'next';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '短期目標 - 後台',
  description: '這是短期目標列表頁面。',
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
      <h1 className="mb-6 text-3xl font-bold">短期目標</h1>
    </div>
  );
}
