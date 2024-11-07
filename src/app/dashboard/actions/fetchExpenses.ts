'use server';

import dbConnect from '@/lib/mongodb';
import Expense, { IExpense } from '@/models/Expense';
import { cache } from 'react';

export const fetchExpenses = cache(async () => {
  await dbConnect();
  const data = await Expense.find({}).lean();
  const sanitizedData = JSON.parse(JSON.stringify(data));
  return sanitizedData as IExpense[];
});
