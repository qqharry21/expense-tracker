import { clsx, type ClassValue } from 'clsx';
import {
  DateArg,
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  endOfMonth,
  endOfWeek,
  format,
  formatDate,
  FormatOptions,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';
import { Level, thresholds } from '.';
import { Types } from './types';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getLocalizeDate = (
  date: DateArg<Date>,
  formatStr: string,
  options?: FormatOptions,
) => {
  return format(date, formatStr, {
    locale: zhTW,
    ...options,
  });
};

export const getCurrentDate = (format: string = 'yyyy-MM-dd') => {
  return formatDate(new Date(), format);
};

export const getInitialsFromName = (name: string) => {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('');
  return initials.substring(0, 2).toUpperCase();
};

/**
 * 強制轉換數字格式，其數值字串不可小於 0
 */
export const formatNumber = (value: string) => {
  const num = Number(value);
  if (num < 0) {
    return 0;
  }
  return num;
};

export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 取得金額與頻率的嚴重程度
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

export const getAmountColor = (amount: number, frequency: Types.Frequency) => {
  const levelColor = {
    [Level.HIGH]: 'text-red-500',
    [Level.MEDIUM]: 'text-yellow-500',
    [Level.LOW]: 'text-green-500',
  };
  const level = getAmountAndFrequencyLevel(amount, frequency);

  return levelColor[level];
};

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
 * 計算指定日期當月剩餘的週數（包含當前週）。
 * @param date - 指定日期（Date 型別）
 * @returns 當月剩餘的週數（包含當前週）
 */
export const getRemainingWeeksInMonth = (date: Date): number => {
  // 當前週的開始與結束
  const startOfCurrentWeek = startOfWeek(date, { weekStartsOn: 0 }); // 週日開始
  const endOfCurrentWeek = endOfWeek(date, { weekStartsOn: 0 }); // 週六結束

  // 本月的最後一天
  const endOfCurrentMonth = endOfMonth(date);

  // 檢查當前週是否整週都在本月
  const currentWeekInMonth = isSameMonth(startOfCurrentWeek, date)
    ? isSameMonth(endOfCurrentWeek, date)
      ? 1 // 當前週整週都在本月
      : 0 // 當前週部分超出本月
    : 0;

  // 計算剩餘完整週數（不含當前週）
  let remainingWeeks = 0;
  if (currentWeekInMonth) {
    let nextWeekStart = startOfWeek(endOfCurrentWeek, { weekStartsOn: 0 });
    while (nextWeekStart < endOfCurrentMonth) {
      remainingWeeks++;
      nextWeekStart = startOfWeek(
        new Date(nextWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000),
        { weekStartsOn: 0 },
      );
    }
  }

  // 總剩餘週數
  return currentWeekInMonth + remainingWeeks;
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
      const { amount, frequency, startTime, endTime, category } = expense;

      // 確定支出有效的起始和結束時間
      const effectiveStart = isAfter(startTime, currentMonthStart)
        ? startTime
        : currentMonthStart;
      let effectiveEnd;
      if (endTime) {
        if (isBefore(endTime, currentMonthStart)) {
          effectiveEnd = null;
        } else if (isAfter(endTime, currentMonthEnd)) {
          effectiveEnd = currentMonthEnd;
        } else {
          effectiveEnd = endTime;
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
        startTime,
      );

      const totalAmount = amount * occurrences;

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
  return Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, amount]) => ({ name, amount }));
};
