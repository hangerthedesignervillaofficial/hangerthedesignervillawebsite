/**
 * Format a number as currency (USD by default)
 * @param amount - The amount to format
 * @param currency - The currency code, defaults to 'USD'
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "₹0.00";
  const num = typeof amount === "number" ? amount : Number(amount);
  if (isNaN(num)) return "₹0.00";
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
