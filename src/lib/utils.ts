import { clsx, type ClassValue } from 'clsx';
import { formatDate } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
 * @param value
 */
export const formatNumber = (value: string) => {
  const num = Number(value);
  if (num < 0) {
    return 0;
  }
  return num;
};
