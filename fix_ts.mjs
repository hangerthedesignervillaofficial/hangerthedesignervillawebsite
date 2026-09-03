import fs from 'fs';

function fixFile(file, edits) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  for (const edit of edits) {
    content = content.replace(edit.find, edit.replace);
  }
  fs.writeFileSync(file, content);
}

fixFile('src/app/admin/contact/page.tsx', [
  { find: ".from('contact_messages')\n        .order", replace: ".from('contact_messages')\n        .select('*')\n        .order" },
  { find: "const { data, error: _err } =", replace: "const { data, error } =" }
]);

fixFile('src/app/admin/newsletters/page.tsx', [
  { find: ".from('newsletter_subscribers')\n        .order", replace: ".from('newsletter_subscribers')\n        .select('*')\n        .order" },
  { find: "const { data, error: _err } =", replace: "const { data, error } =" }
]);

fixFile('src/app/admin/reviews/page.tsx', [
  { find: ".from('testimonials')\n        .order", replace: ".from('testimonials')\n        .select('*')\n        .order" },
  { find: "const { data, error: _err } =", replace: "const { data, error } =" }
]);

fixFile('src/app/admin/notifications/page.tsx', [
  { find: "const { data, error: _err } =", replace: "const { data, error } =" }
]);

fixFile('src/app/admin/support/page.tsx', [
  { find: "const { data, error: _err } =", replace: "const { data, error } =" }
]);

fixFile('src/app/admin/abandoned-carts/page.tsx', [
  { find: "const { data, error: _err } =", replace: "const { data, error } =" }
]);

fixFile('src/app/admin/cms/page.tsx', [
  { find: "const { data, error: _err } =", replace: "const { data, error } =" }
]);

fixFile('src/app/admin/cancellations/page.tsx', [
  { find: "const { data, error: _err } =", replace: "const { data, error } =" }
]);

console.log("Fixed TS errors");
