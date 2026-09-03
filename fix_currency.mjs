import fs from 'fs';

const file = 'src/utils/formatCurrency.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "export function formatCurrency(amount: number, currency = 'USD'): string {",
  "export function formatCurrency(amount: number, currency = 'INR'): string {"
);

content = content.replace(
  "return new Intl.NumberFormat('en-US', {",
  "return new Intl.NumberFormat('en-IN', {"
);

fs.writeFileSync(file, content);
console.log("Updated formatCurrency.ts");
