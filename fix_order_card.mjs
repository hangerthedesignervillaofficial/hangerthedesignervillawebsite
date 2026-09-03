import fs from 'fs';

const file = 'src/components/OrderCard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { useAuth } from "@/context/AuthContext";\n',
  ''
);

content = content.replace(
  'import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, Trash2 } from "lucide-react";',
  'import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight } from "lucide-react";'
);

content = content.replace(
  'onDelete,',
  ''
);

content = content.replace(
  'const { deleteOrder } = useOrders();',
  ''
);

fs.writeFileSync(file, content);
console.log("Fixed OrderCard.tsx");
