import { Frequency } from '@/lib/types';
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
  amount: z.string().regex(/^(?!0\.00)\d{1,6}(\.\d{1,2})?$/, {
    message:
      'Amount must be a valid number greater than 0 and not more than 500000 with up to two decimal places',
  }),
  frequency: z.enum([Frequency.ONE_TIME, Frequency.MONTHLY, Frequency.ANNUAL]),
  description: z.string().max(255),
});

export type ExpenseFormValue = z.infer<typeof expenseSchema>;
