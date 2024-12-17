'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Types } from '@/lib/types';
import { formatDate } from 'date-fns';
import React from 'react';

interface ExpenseTableProps {
  expenses: Types.Expense[];
}

export const ExpenseTable = ({ expenses }: ExpenseTableProps) => {
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  return (
    <main className='flex-1 overflow-x-auto overflow-y-auto'>
      <div className='grid overflow-hidden'>
        <Table className='whitespace-nowrap'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>日期</TableHead>
              <TableHead className='w-[100px]'>類別</TableHead>
              <TableHead className='w-[100px]'>金額</TableHead>
              <TableHead className='w-[150px]'>類型</TableHead>
              <TableHead className='w-[200px]'>描述</TableHead>
              <TableHead className='w-[200px]'>標籤</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <React.Fragment key={expense.id}>
                <TableRow
                  className='cursor-pointer'
                  onClick={() => toggleRowExpansion(expense.id)}>
                  <TableCell className='font-medium'>
                    {formatDate(expense.dueDate, 'PPP')}
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.frequency}</TableCell>
                  <TableCell className='max-w-[200px] truncate'>{expense.description}</TableCell>
                  <TableCell className=''>
                    {/* <div className='flex flex-wrap gap-1'>
                      {expense.tags.map((tag, index) => (
                        <span
                          key={index}
                          className='inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap'>
                          {tag}
                        </span>
                      ))}
                    </div> */}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
};
