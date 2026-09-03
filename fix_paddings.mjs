import fs from 'fs';

function fixFile(file, edits) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  for (const edit of edits) {
    content = content.replace(edit.find, edit.replace);
  }
  fs.writeFileSync(file, content);
}

const files = [
  'src/app/admin/cancellations/page.tsx',
  'src/app/admin/contact/page.tsx',
  'src/app/admin/newsletters/page.tsx',
  'src/app/admin/reviews/page.tsx',
  'src/app/admin/traffic/page.tsx',
  'src/app/admin/abandoned-carts/page.tsx'
];

for (const file of files) {
  fixFile(file, [
    { find: 'className="p-8 ', replace: 'className="p-4 md:p-8 ' },
    { find: 'className="flex justify-between items-end mb-8"', replace: 'className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-6 md:mb-8"' }
  ]);
}

fixFile('src/app/admin/page.tsx', [
  { find: 'className="p-8 space-y-8 max-w-7xl mx-auto"', replace: 'className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto"' },
  { find: 'className="flex justify-between items-end"', replace: 'className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4"' },
  { find: 'className="grid grid-cols-4 gap-4"', replace: 'className="grid grid-cols-2 md:grid-cols-4 gap-4"' },
  { find: 'className="grid grid-cols-3 gap-6"', replace: 'className="grid grid-cols-1 lg:grid-cols-3 gap-6"' }
]);

fixFile('src/app/admin/cms/page.tsx', [
  { find: 'className="p-8 max-w-5xl mx-auto"', replace: 'className="p-4 md:p-8 max-w-5xl mx-auto"' },
  { find: 'className="flex justify-between items-end mb-8"', replace: 'className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-6 md:mb-8"' }
]);

console.log("Fixed paddings");
