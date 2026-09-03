import fs from 'fs';
let content = fs.readFileSync('src/components/admin/OrderDetailsModal.tsx', 'utf8');

content = content.replace('Order #{order.id}', '{order.display_id || `Order #${order.id}`}');

fs.writeFileSync('src/components/admin/OrderDetailsModal.tsx', content);
