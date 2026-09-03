import fs from 'fs';

const file = 'src/app/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace DollarSign with IndianRupee in lucide-react import
content = content.replace(
  'import { Users, Activity, ShoppingCart, Package, DollarSign, AlertTriangle, Bell, TrendingUp } from "lucide-react";',
  'import { Users, Activity, ShoppingCart, Package, IndianRupee, AlertTriangle, Bell, TrendingUp } from "lucide-react";'
);

// Replace formatCurrency to use INR
content = content.replace(
  "currency: 'USD',",
  "currency: 'INR',"
);

// Replace <DollarSign /> with <IndianRupee />
content = content.replace(
  /<DollarSign className="h-6 w-6" \/>/g,
  '<IndianRupee className="h-6 w-6" />'
);

fs.writeFileSync(file, content);
console.log("Updated admin page INR and icon");
