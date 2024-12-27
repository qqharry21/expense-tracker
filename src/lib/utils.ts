import { clsx, type ClassValue } from 'clsx';
import { DateArg, format, FormatOptions } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';
import { Level, thresholds } from '.';
import { Types } from './types';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * 取得本地化日期字串
 * @param date
 * @param formatStr
 * @param options
 * @returns
 */
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

/**
 * 取得當前日期
 * @param format
 * @returns
 */
export const getCurrentDate = (format: string = 'yyyy-MM-dd') => {
  return getLocalizeDate(new Date(), format);
};

/**
 * 取得名字的縮寫
 * @param name
 * @returns
 */
export const getInitialsFromName = (name: string) => {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('');
  return initials.substring(0, 2).toUpperCase();
};

/**
 * 強制轉換數字格式，其數值字串不可小於 0
 * @param value
 * @returns
 */
export const formatNumber = (value: string) => {
  const num = Number(value);
  if (num < 0) {
    return 0;
  }
  return num;
};

/**
 * 格式化數字，每三位數加一個逗號
 * @param num
 * @returns
 */
export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 取得小數點後幾位數
 * @param num
 * @param digits
 * @returns
 */
export const getDecimal = (num: number, digits: number = 2) => {
  return Math.round(num * 10 ** digits) / 10 ** digits;
};
