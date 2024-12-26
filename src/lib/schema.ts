import { Types } from '@/lib/types';
import { date, z } from 'zod';

const idSchema = z.string().optional();
const titleSchema = z
  .string()
  .min(1, {
    message: '項目名稱為必填',
  })
  .max(255);

const frequencySchema = z.nativeEnum(Types.Frequency);
const currencySchema = z.nativeEnum(Types.Currency);
const amountSchema = z.number().min(1, {
  message: '金額必須大於 1',
});
const descriptionSchema = z.string().max(255, { message: '描述最多 255 字元' });

export const expenseSchema = z
  .object({
    id: idSchema,
    title: titleSchema,
    startTime: z.date({ message: '開始日期為必填' }),
    endTime: z.date().optional().nullable(),
    currency: currencySchema,
    amount: amountSchema.max(500000, {
      message: '金額必須介於 1 至 500,000 之間',
    }),
    category: z.nativeEnum(Types.ExpenseCategory),
    frequency: frequencySchema,
    description: descriptionSchema,
  })
  .refine(
    (data) => {
      if (data.endTime !== undefined && data.endTime !== null) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: '結束日期必須晚於開始日期',
      path: ['endTime'],
    },
  );

export type ExpenseFormValue = z.infer<typeof expenseSchema>;

export const incomeSchema = z.object({
  id: idSchema,
  title: titleSchema,
  date: date({ message: '日期為必填' }),
  currency: currencySchema,
  amount: amountSchema.max(10000000, {
    message: '金額必須介於 1 至 10,000,000 之間',
  }),
  category: z.nativeEnum(Types.IncomeCategory),
  frequency: frequencySchema,
  description: descriptionSchema,
});
