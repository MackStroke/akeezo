import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names, resolving Tailwind conflicts so the last utility wins.
 * Every shadcn component imports this.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
