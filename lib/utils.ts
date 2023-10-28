import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import mime from 'mime-types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBase64DataURL = (value: string) => {
  const base64Regex = /^data:image\/[a-z]+;base64,/;
  return base64Regex.test(value);
};

export const convertToTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
