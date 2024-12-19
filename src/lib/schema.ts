import { Types } from '@/lib/types';
import { z } from 'zod';

export const expenseSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(1, {
      message: 'Title is required',
    })
    .max(255),
  dueDate: z.date(),
  currency: z.nativeEnum(Types.Currency),
  category: z.nativeEnum(Types.Category),
  amount: z.number().min(1).max(500000),
  frequency: z.nativeEnum(Types.Frequency),
  description: z.string().max(255),
});

export type ExpenseFormValue = z.infer<typeof expenseSchema>;
