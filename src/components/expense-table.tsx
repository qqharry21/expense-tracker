'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IExpense } from '@/models/Expense';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import React from 'react';

interface ExpenseTableProps {
  expenses: IExpense[];
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
              <TableHead className='hidden md:table-cell w-[200px]'>描述</TableHead>
              <TableHead className='hidden md:table-cell w-[200px]'>標籤</TableHead>
              <TableHead className='md:hidden w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <React.Fragment key={expense._id}>
                <TableRow
                  className='cursor-pointer'
                  onClick={() => toggleRowExpansion(expense._id)}>
                  <TableCell className='font-medium'>{expense.date}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.type}</TableCell>
                  <TableCell className='hidden md:table-cell max-w-[200px] truncate'>
                    {expense.description}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
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
                  <TableCell className='md:hidden'>
                    {expandedRows.includes(expense._id) ? (
                      <ChevronUpIcon className='h-5 w-5' />
                    ) : (
                      <ChevronDownIcon className='h-5 w-5' />
                    )}
                  </TableCell>
                </TableRow>
                {expandedRows.includes(expense._id) && (
                  <TableRow className='md:hidden'>
                    <TableCell colSpan={4}>
                      <div className='py-2'>
                        <p>
                          <strong>類型:</strong> {expense.type}
                        </p>
                        <p>
                          <strong>描述:</strong> {expense.description}
                        </p>
                        <div className='mt-2'>
                          <strong>標籤:</strong>
                          <div className='flex flex-wrap gap-1 mt-1'>
                            {/* {expense.tags.map((tag, index) => (
                              <span
                                key={index}
                                className='inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap'>
                                {tag}
                              </span>
                            ))} */}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
};
