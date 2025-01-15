import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  endOfMonth,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { Level, thresholds } from '.';
import { Types } from './types';
import { getLocalizeDate } from './utils';

/**
 * 取得金額與頻率的嚴重程度
 * @param amount
 * @param frequency
 * @returns
 */
export const getAmountAndFrequencyLevel = (
  amount: number,
  frequency: Types.Frequency,
) => {
  const [high, medium] = thresholds[frequency];

  if (amount > high) return Level.HIGH;
  if (amount > medium) return Level.MEDIUM;
  return Level.LOW;
};

export const getFrequencyColor = (frequency: Types.Frequency) => {
  const frequencyColor = {
    [Types.Frequency.ONE_TIME]: 'bg-blue-100 text-blue-800',
    [Types.Frequency.DAILY]: 'bg-yellow-100 text-yellow-800',
    [Types.Frequency.WEEKLY]: 'bg-green-100 text-green-800',
    [Types.Frequency.MONTHLY]: 'bg-purple-100 text-purple-800',
    [Types.Frequency.ANNUALLY]: 'bg-gray-100 text-gray-800',
  };
  return frequencyColor[frequency];
};

/**
 * 判斷支出是否在指定日期
 * @param date
 * @param expense
 * @returns
 */
export const isExpenseOnDate = (date: Date, expense: Types.Expense) => {
  const { startTime, endTime, frequency, includeEndTime } = expense;
  const startDate = startOfDay(startTime);
  const endDate = endTime ? startOfDay(endTime) : null;
  if (includeEndTime && endDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  const checkDate = startOfDay(date);

  switch (frequency) {
    case Types.Frequency.ONE_TIME:
      return isSameDay(startDate, checkDate);

    case Types.Frequency.DAILY:
      return (
        !isBefore(checkDate, startDate) &&
        // 如果包含結束時間，則需檢查是否在結束時間當天
        (!endDate || isBefore(checkDate, endDate))
      );

    case Types.Frequency.WEEKLY:
      return (
        !isBefore(checkDate, startDate) &&
        checkDate.getDay() === startDate.getDay() && // 同一天的星期
        (!endDate || isBefore(checkDate, endDate))
      );

    case Types.Frequency.MONTHLY:
      return (
        !isBefore(checkDate, startDate) &&
        checkDate.getDate() === startDate.getDate() && // 同一天的日期
        (!endDate || isBefore(checkDate, endDate))
      );

    case Types.Frequency.ANNUALLY:
      return (
        !isBefore(checkDate, startDate) &&
        checkDate.getDate() === startDate.getDate() &&
        checkDate.getMonth() === startDate.getMonth() && // 同一天的月和日
        (!endDate || isBefore(checkDate, endDate))
      );

    default:
      return false;
  }
};

export const getSixMonthStartEndDate = () => {
  const currentDate = new Date();
  const sixMonthsAgo = currentDate.setMonth(currentDate.getMonth() - 5);
  const startMonth = getLocalizeDate(sixMonthsAgo, 'MMM');
  const startYear = getLocalizeDate(sixMonthsAgo, 'yyyy');
  const endMonth = getLocalizeDate(new Date(), 'MMM');
  const endYear = getLocalizeDate(new Date(), 'yyyy');

  return {
    startMonth,
    startYear,
    endMonth,
    endYear,
  };
};

export const getSixMonthString = () => {
  const { startMonth, startYear, endMonth, endYear } =
    getSixMonthStartEndDate();
  if (startYear === endYear) {
    return `${startYear}年 ${startMonth} - ${endMonth}`;
  }
  return `${startYear}年 ${startMonth} - ${endYear}年${endMonth}`;
};

/**
 * 加總這個月每個支出類別的金額，並依照支出頻率計算總金額。
 * 若支出頻率為每日，則乘上當月的天數；
 * 若支出頻率為每週，則乘上當月剩餘的週數；
 * 若支出頻率為每月，則直接加總金額。
 * 若有起始時間，則以起始時間含當天再開始計算；
 * 若有結束時間，則以結束時間含當天再結束計算。
 */
export const getMonthlyExpenseSummary = (
  expenses: Types.Expense[],
  referenceDate: Date = new Date(),
): Record<Types.$Enums.ExpenseCategory, number> => {
  const currentMonthStart = startOfMonth(referenceDate);
  const currentMonthEnd = endOfMonth(referenceDate);

  return expenses.reduce(
    (summary, expense) => {
      const { amount, currency, frequency, startTime, endTime, category } =
        expense;

      // 確定支出有效的起始和結束時間
      const effectiveStart = isAfter(new Date(startTime), currentMonthStart)
        ? new Date(startTime)
        : currentMonthStart;
      let effectiveEnd;
      if (endTime) {
        if (isBefore(endTime, currentMonthStart)) {
          effectiveEnd = null;
        } else if (isAfter(endTime, currentMonthEnd)) {
          effectiveEnd = currentMonthEnd;
        } else {
          effectiveEnd = new Date(endTime);
        }
      } else {
        effectiveEnd = currentMonthEnd;
      }

      // 如果有效結束時間早於有效起始時間，支出不計算
      if (!effectiveEnd || isBefore(effectiveEnd, effectiveStart)) {
        return summary;
      }

      const occurrences = calculateOccurrences(
        frequency,
        effectiveStart,
        effectiveEnd,
        new Date(startTime),
      );

      const totalAmount = Math.floor(amount * occurrences);

      if (totalAmount > 0) {
        summary[category] = (summary[category] || 0) + totalAmount;
      }

      return summary;
    },
    {} as Record<Types.$Enums.ExpenseCategory, number>,
  );
};

/**
 * 計算支出的當月金額
 */
const calculateOccurrences = (
  frequency: Types.Frequency,
  effectiveStart: Date,
  effectiveEnd: Date,
  startTime: Date,
): number => {
  switch (frequency) {
    case Types.Frequency.DAILY:
      return differenceInCalendarDays(effectiveEnd, effectiveStart) + 1;

    case Types.Frequency.WEEKLY:
      return (
        differenceInCalendarWeeks(effectiveEnd, effectiveStart, {
          weekStartsOn: 1,
        }) + 1
      );

    case Types.Frequency.ANNUALLY:
      return 1 / 12;

    case Types.Frequency.MONTHLY:
    case Types.Frequency.ONE_TIME:
      return isWithinInterval(startTime, {
        start: effectiveStart,
        end: effectiveEnd,
      })
        ? 1
        : 0;

    default:
      return 0;
  }
};

/**
 * 取得支出類別的前五大金額
 */
export const getTopFiveCategories = (
  summary: Record<Types.$Enums.ExpenseCategory, number>,
): { name: string; amount: number }[] => {
  console.log('🚨 - summary', summary);
  return Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, amount]) => ({ name, amount }));
};

export const getMonthlyTotalExpenses = (
  expenses: Types.Expense[],
  referenceDate: Date = new Date(),
): number => {
  return Object.values(
    getMonthlyExpenseSummary(expenses, referenceDate),
  ).reduce((total, amount) => total + amount, 0);
};

/**
 * 取得最近幾個月的總支出
 * @param expenses 支出數據陣列
 * @param totalMonths 目標月數
 * @param referenceDate 參考日期，默認為當前日期
 * @returns 月份與金額的陣列
 */
export const getLastMonthsTotalExpenses = (
  expenses: Types.Expense[],
  totalMonths: number,
  referenceDate: Date = new Date(),
): { month: string; amount: number }[] => {
  const months = Array.from({ length: totalMonths }).map((_, index) => {
    const date = new Date(referenceDate);
    date.setMonth(date.getMonth() - index);
    return date;
  });

  return months.map((date) => {
    return {
      month: getLocalizeDate(date, 'MMM'),
      amount: getMonthlyTotalExpenses(expenses, date),
    };
  });
};

/**
 * 計算本月比上個月成長的幅度百分比
 * @param expenses 支出數據陣列
 * @param referenceDate 參考日期，默認為當前日期
 * @returns 成長百分比，如果上個月總支出為0則返回null
 */
export const getMonthlyGrowth = (
  expenses: Types.Expense[],
  referenceDate: Date = new Date(),
): number | null => {
  const currentMonth = getMonthlyTotalExpenses(expenses, referenceDate);
  const lastMonth = getMonthlyTotalExpenses(
    expenses,
    new Date(referenceDate.setMonth(referenceDate.getMonth() - 1)),
  );

  if (lastMonth === 0) {
    return null;
  }

  return ((currentMonth - lastMonth) / lastMonth) * 100;
};
