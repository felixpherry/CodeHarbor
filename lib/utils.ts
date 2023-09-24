import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBase64DataURL = (value: string) => {
  const base64Regex = /^data:image\/[a-z]+;base64,/;
  return base64Regex.test(value);
};
