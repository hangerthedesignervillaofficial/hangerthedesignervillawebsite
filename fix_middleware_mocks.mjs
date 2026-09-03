import fs from 'fs';

const file = 'src/utils/supabase/middleware.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /  const isMockSessionActive = request\.cookies\.get\('hanger_mock_session_active'\)\?\.value === 'true';/,
  ``
);

content = content.replace(
  /  if \(isProtectedPath && !user && !isMockSessionActive\) \{/,
  `  if (isProtectedPath && !user) {`
);

content = content.replace(
  /  if \(isProtectedPath && !user && !isMockSessionActive\)/g,
  `  if (isProtectedPath && !user)`
);


fs.writeFileSync(file, content);
console.log("Updated middleware.ts");
