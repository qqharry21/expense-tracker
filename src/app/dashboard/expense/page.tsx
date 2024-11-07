import { Metadata } from 'next';

import { ExpenseHeader } from '@/components/expense-header';
import { ExpenseTable } from '@/components/expense-table';
import { fetchExpenses } from '../actions/fetchExpenses';

export const metadata: Metadata = {
  title: '支出列表 - 後台',
  description: '這是支出列表頁面。',
};

export default async function Page() {
  const expenses = await fetchExpenses();
  console.log('🚨 - expenses', expenses);
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>支出列表</h1>

      <ExpenseHeader expenses={expenses} />

      <ExpenseTable expenses={expenses} />
    </div>
  );
}
