/**
 * Format a number as currency (USD by default)
 * @param amount - The amount to format
 * @param currency - The currency code, defaults to 'USD'
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number') return '₹0.00';
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
