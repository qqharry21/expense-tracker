'use server';

import dbConnect from '@/lib/mongodb';
import { expenseSchema } from '@/lib/schema';
import Expense from '@/models/Expense';

export default async function createExpenseAction(data: FormData) {
  try {
    const formData = Object.fromEntries(data);
    console.log('🚨 - formData', formData);
    const parsed = expenseSchema.safeParse({
      ...formData,
      dueDate: new Date(data.get('dueDate') as string),
    });

    console.log('🚨 - parsed error', parsed.error?.errors);

    if (!parsed.success) {
      return {
        message: 'Invalid form data',
      };
    }
    await dbConnect();
    // Save to database

    const newExpense = new Expense(parsed.data);
    await newExpense.save();
    // Create expense
    return { message: 'Expense created' };
  } catch (error) {
    console.error('🚨 - createExpense', error);
    return { message: 'Something went wrong' };
  }
}
