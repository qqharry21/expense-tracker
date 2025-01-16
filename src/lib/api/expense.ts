'use server';
import { startOfMonth, startOfYear, subMonths } from 'date-fns';
import { prisma } from '../prisma';

/**
 * 獲取指定用戶在指定日期範圍內的支出數據。
 *
 * @param dateRange - 用於篩選支出的日期範圍。可以是 'month'、'6months'、'year' 或 'all'。默認為 'month'。
 * @param userId - 要獲取支出的用戶ID。可選。
 * @returns 一個Promise，解析為按金額降序和頻率升序排序的支出對象數組。
 */
export const getExpenseData = async (
  dateRange: 'month' | '6months' | 'year' | 'all' = 'month',
  userId?: string,
) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const now = new Date();
  let startTime: Date;

  switch (dateRange) {
    case '6months':
      startTime = startOfMonth(subMonths(now, 5));
      break;
    case 'month':
      startTime = startOfMonth(now);
      break;
    case 'year':
      startTime = startOfYear(now);
      break;
    case 'all':
    default:
      return prisma.expense.findMany({
        where: { userId },
        orderBy: [{ amount: 'desc' }, { frequency: 'asc' }],
      });
  }

  return prisma.expense.findMany({
    where: {
      userId,
      startTime: {
        gte: startTime,
      },
    },
    orderBy: [{ amount: 'desc' }, { frequency: 'asc' }],
  });
};
