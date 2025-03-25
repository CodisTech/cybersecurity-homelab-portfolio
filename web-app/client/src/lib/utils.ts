import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null): string {
  if (!date) {
    return 'N/A';
  }
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return format(date, 'MMMM dd, yyyy');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'online':
      return 'bg-green-100 text-green-800';
    case 'offline':
      return 'bg-red-100 text-red-800';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800';
    case 'degraded':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusDot(status: string): string {
  switch (status.toLowerCase()) {
    case 'online':
      return 'bg-green-400';
    case 'offline':
      return 'bg-red-400';
    case 'maintenance':
      return 'bg-yellow-400';
    case 'degraded':
      return 'bg-orange-400';
    default:
      return 'bg-gray-400';
  }
}
