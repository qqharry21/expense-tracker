import { Types } from '@/lib/types';
import { z } from 'zod';

export const expenseSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: 'Title is required',
    })
    .max(255),
  dueDate: z.date(),
  category: z.enum(['food', 'traffic', 'entertainment', 'accommodation', 'others']),
  amount: z.number().min(1).max(500000),
  frequency: z.enum([
    Types.Frequency.ONE_TIME,
    Types.Frequency.DAILY,
    Types.Frequency.WEEKLY,
    Types.Frequency.MONTHLY,
    Types.Frequency.ANNUALLY,
  ]),
  description: z.string().max(255),
});

export type ExpenseFormValue = z.infer<typeof expenseSchema>;
