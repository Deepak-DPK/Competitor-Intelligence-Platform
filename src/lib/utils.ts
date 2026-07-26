import { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  try {
    const validCurrency = currency && typeof currency === 'string' ? currency.toUpperCase() : 'INR';
    const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    const localeMap: Record<string, string> = {
      INR: 'en-IN',
      USD: 'en-US',
      EUR: 'en-IE',
      GBP: 'en-GB',
      AED: 'en-AE',
      AUD: 'en-AU',
      SGD: 'en-SG',
      JPY: 'ja-JP',
    };
    const locale = localeMap[validCurrency] || 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: validCurrency,
      maximumFractionDigits: 0,
    }).format(validAmount);
  } catch (e) {
    return `${currency || '₹'} ${amount || 0}`;
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTimeAgo(dateString: string): string {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Just now';
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
