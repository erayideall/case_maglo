/**
 * Date formatting utilities
 */

export type DateFormat = 'long' | 'short';

/**
 * Format date to readable string
 * @param dateString - ISO date string
 * @param format - 'long' for "January 1, 2025 at 12:00" or 'short' for "01 Jan 2025"
 */
export function formatDate(dateString: string, format: DateFormat = 'long'): string {
  const date = new Date(dateString);

  if (format === 'short') {
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  // long format
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month} ${day}, ${year} at ${hours}:${minutes}`;
}

/**
 * Currency formatting utilities
 */

export type CurrencyFormat = 'simple' | 'signed' | 'intl';

export interface CurrencyOptions {
  format?: CurrencyFormat;
  locale?: string;
  showSign?: boolean;
}

/**
 * Format currency amount
 * @param amount - The amount to format
 * @param currency - Currency code (e.g., 'USD', 'TRY', 'EUR')
 * @param options - Formatting options
 */
export function formatCurrency(
  amount: number,
  currency: string,
  options: CurrencyOptions = {}
): string {
  const { format = 'simple', locale = 'tr-TR' } = options;
  const absAmount = Math.abs(amount);

  if (format === 'intl') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  if (format === 'signed') {
    const symbol = currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : currency;
    const sign = amount < 0 ? '-' : '+';
    const formattedAmount = absAmount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${sign}${symbol}${formattedAmount}`;
  }

  // simple format
  return `${currency}${absAmount.toFixed(2)}`;
}

/**
 * Format number to abbreviated string (e.g., 1000 -> 1K, 1000000 -> 1M)
 */
export function formatNumberAbbreviated(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
}

/**
 * Get card network logo path
 */
export function getNetworkLogo(network: string): string {
  const networkLower = network.toLowerCase();
  if (networkLower === 'visa') {
    return '/images/visa.png';
  } else if (networkLower === 'mastercard') {
    return '/images/mastercard.png';
  }
  return '/images/mastercard.png'; // default
}
