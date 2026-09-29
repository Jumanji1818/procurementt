import { CurrencyCode } from '../types';

export const currencySymbols: Record<CurrencyCode, string> = {
  USD: '$',
  NGN: '₦',
  EUR: '€',
  GBP: '£',
  KES: 'KSh ',
  JPY: '¥',
  AED: 'AED ',
};

// Base exchange rates relative to USD = 1.0
export const exchangeRatesToUSD: Record<CurrencyCode, number> = {
  USD: 1.0,
  NGN: 1550.0,
  EUR: 0.92,
  GBP: 0.78,
  KES: 130.0,
  JPY: 155.0,
  AED: 3.67,
};

export function formatCurrencyAmount(
  amountInBaseUSD: number,
  targetCurrency: CurrencyCode = 'USD'
): string {
  const rate = exchangeRatesToUSD[targetCurrency] || 1.0;
  const converted = amountInBaseUSD * rate;
  const symbol = currencySymbols[targetCurrency] || '$';

  return `${symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: targetCurrency === 'JPY' ? 0 : 2,
    maximumFractionDigits: targetCurrency === 'JPY' ? 0 : 2,
  })}`;
}

export function formatRawAmountWithSymbol(amount: number, currency: CurrencyCode): string {
  const symbol = currencySymbols[currency] || '$';
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  })}`;
}
