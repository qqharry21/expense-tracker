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
  const level = getAmountAndFrequencyLevel(amount, frequency);

  if (level === Level.HIGH) return 'text-red-500';
  if (level === Level.MEDIUM) return 'text-yellow-500';
  return 'text-green-500';
};

export const isExpenseOnDate = (date: Date, expense: Types.Expense) => {
  const { dueDate, frequency } = expense;
  const startDate = startOfDay(dueDate);
  const checkDate = startOfDay(date);

  switch (frequency) {
    case 'ONE_TIME':
      return isSameDay(startDate, checkDate);

    case 'DAILY':
      return !isBefore(checkDate, startDate);

    case 'WEEKLY':
      return (
        !isBefore(checkDate, startDate) &&
        checkDate.getDay() === startDate.getDay() // 同一天的星期
      );

    case 'MONTHLY':
      return (
        !isBefore(checkDate, startDate) &&
        checkDate.getDate() === startDate.getDate() // 同一天的日期
      );

    case 'ANNUALLY':
      return (
        !isBefore(checkDate, startDate) &&
        checkDate.getDate() === startDate.getDate() &&
        checkDate.getMonth() === startDate.getMonth() // 同一天的月和日
      );

    default:
      return false;
  }
};
