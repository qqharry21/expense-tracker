import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  endOfMonth,
  endOfYear,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfYear,
} from 'date-fns';
import { Level, thresholds } from '.';
import { Types } from './types';
import { getLocalizeDate } from './utils';

/**
 * 取得金額與頻率的嚴重程度
 * @param amount 金額
 * @param frequency 頻率
 * @returns 嚴重程度
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

/**
 * 取得頻率對應的顏色
 * @param frequency 頻率
 * @returns 顏色
 */
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
 * @param date 日期
 * @param expense 支出
 * @returns 是否在指定日期
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

/**
 * 取得最近六個月的開始和結束日期
 * @returns 開始和結束日期
 */
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

/**
 * 取得最近六個月的字串表示
 * @returns 六個月的字串表示
 */
export const getSixMonthString = () => {
  const { startMonth, startYear, endMonth, endYear } =
    getSixMonthStartEndDate();
  if (startYear === endYear) {
    return `${startYear}年 ${startMonth} - ${endMonth}`;
  }
  return `${startYear}年 ${startMonth} - ${endYear}年${endMonth}`;
};

/**
 * 通用的支出總結函數
 * @param expenses 支出數據陣列
 * @param referenceStartDate 參考開始日期
 * @param referenceEndDate 參考結束日期
 * @param interval 間隔類型（'monthly' 或 'yearly'）
 * @returns 每個支出類別的金額
 */
const getExpenseSummary = (
  expenses: Types.Expense[],
  referenceStartDate: Date,
  referenceEndDate: Date,
  interval: 'monthly' | 'yearly',
): Record<Types.$Enums.ExpenseCategory, number> => {
  return expenses.reduce(
    (summary, expense) => {
      const { amount, frequency, startTime, currencyRate, endTime, category } =
        expense;

      // 確定支出有效的起始和結束時間
      const effectiveStart = isAfter(new Date(startTime), referenceStartDate)
        ? new Date(startTime)
        : referenceStartDate;
      let effectiveEnd;
      if (endTime) {
        if (isBefore(endTime, referenceStartDate)) {
          effectiveEnd = null;
        } else if (isAfter(endTime, referenceEndDate)) {
          effectiveEnd = referenceEndDate;
        } else {
          effectiveEnd = new Date(endTime);
        }
      } else {
        effectiveEnd = referenceEndDate;
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
        interval,
      );

      const totalAmount = Math.floor(amount * occurrences * currencyRate);

      if (totalAmount > 0) {
        summary[category] = (summary[category] || 0) + totalAmount;
      }

      return summary;
    },
    {} as Record<Types.$Enums.ExpenseCategory, number>,
  );
};

/**
 * 加總這個月每個支出類別的金額，並依照支出頻率計算總金額
 * @param expenses 支出數據陣列
 * @param referenceDate 參考日期，默認為當前日期
 * @returns 每個支出類別的金額
 */
export const getMonthlyExpenseSummary = (
  expenses: Types.Expense[],
  referenceDate: Date = new Date(),
): Record<Types.$Enums.ExpenseCategory, number> => {
  const currentMonthStart = startOfMonth(referenceDate);
  const currentMonthEnd = endOfMonth(referenceDate);
  return getExpenseSummary(
    expenses,
    currentMonthStart,
    currentMonthEnd,
    'monthly',
  );
};

/**
 * 加總這個年份每個支出類別的金額，並依照支出頻率計算總金額
 * @param expenses 支出數據陣列
 * @param referenceDate 參考日期，默認為當前日期
 * @returns 每個支出類別的金額
 */
export const getYearlyExpenseSummary = (
  expenses: Types.Expense[],
  referenceDate: Date = new Date(),
): Record<Types.$Enums.ExpenseCategory, number> => {
  const currentYearStart = startOfYear(referenceDate);
  const currentYearEnd = endOfYear(referenceDate);
  return getExpenseSummary(
    expenses,
    currentYearStart,
    currentYearEnd,
    'yearly',
  );
};

/**
 * 計算支出的當月金額
 * @param frequency 頻率
 * @param effectiveStart 有效開始日期
 * @param effectiveEnd 有效結束日期
 * @param startTime 開始時間
 * @param interval 間隔類型
 * @returns 當月金額
 */
const calculateOccurrences = (
  frequency: Types.Frequency,
  effectiveStart: Date,
  effectiveEnd: Date,
  startTime: Date,
  interval: 'monthly' | 'yearly',
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
    case Types.Frequency.MONTHLY:
      return interval === 'yearly' ? 12 : 1;
    case Types.Frequency.ANNUALLY:
      return interval === 'yearly' ? 1 : 1 / 12;
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
 * @param summary 支出類別金額總結
 * @returns 前五大金額的支出類別
 */
export const getTopFiveCategories = (
  summary: Record<Types.$Enums.ExpenseCategory, number>,
): { name: string; amount: number }[] => {
  return Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, amount]) => ({ name, amount }));
};

/**
 * 取得當月的總支出
 * @param expenses 支出數據陣列
 * @param referenceDate 參考日期，默認為當前日期
 * @returns 總支出金額
 */
export const getMonthlyTotalExpenses = (
  expenses: Types.Expense[],
  referenceDate: Date = new Date(),
): number => {
  const summary = getMonthlyExpenseSummary(expenses, referenceDate);
  return calculateTotalExpenses(summary);
};

/**
 * 計算指定年份的總支出金額
 * @param expenses 支出項目列表
 * @param referenceDate 參考日期，用於確定年份，預設為當前日期
 * @returns 指定年份的總支出金額
 */
export const getYearlyTotalExpenses = (
  expenses: Types.Expense[],
  referenceDate: Date = new Date(),
): number => {
  const summary = getYearlyExpenseSummary(expenses, referenceDate);
  return calculateTotalExpenses(summary);
};

/**
 * 計算總支出金額
 * @param summary 支出類別金額總結
 * @returns 總支出金額
 */
const calculateTotalExpenses = (
  summary: Record<Types.$Enums.ExpenseCategory, number>,
): number => {
  return Object.values(summary).reduce((total, amount) => total + amount, 0);
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
