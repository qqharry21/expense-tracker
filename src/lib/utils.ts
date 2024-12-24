import { clsx, type ClassValue } from 'clsx';
import {
  DateArg,
  format,
  formatDate,
  FormatOptions,
  isBefore,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';
import { Level, thresholds } from '.';
import { Types } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalizeDate(
  date: DateArg<Date>,
  formatStr: string,
  options?: FormatOptions,
) {
  return format(date, formatStr, {
    locale: zhTW,
    ...options,
  });
}

export function getCurrentDate(format: string = 'yyyy-MM-dd') {
  return formatDate(new Date(), format);
}

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
