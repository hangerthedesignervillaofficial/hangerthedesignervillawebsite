import fs from 'fs';

function fixFile(file, edits) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  for (const edit of edits) {
    // If it's a regex edit, we use it directly. If it's string, we use it as is.
    content = content.replace(edit.find, edit.replace);
  }
  fs.writeFileSync(file, content);
}

const files = [
  'src/app/admin/users/page.tsx',
  'src/app/admin/orders/page.tsx',
  'src/app/admin/page.tsx', // just in case
  'src/components/admin/OrderDetailsModal.tsx',
  'src/components/admin/UserDetailsModal.tsx'
];

for (const file of files) {
  fixFile(file, [
    { find: /DollarSign/g, replace: 'IndianRupee' },
    { find: /currency: 'USD'/g, replace: "currency: 'INR'" }
  ]);
}
console.log("Replaced DollarSign with IndianRupee");
