import fs from 'fs';

const file = 'src/app/profile/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /import MockProfilePage from "\.\/MockProfilePage";/,
  `import { redirect } from "next/navigation";`
);

content = content.replace(
  /\/\/ If no real Supabase user, render the client-side mock-aware profile page[\s\S]*?if \(!user\) \{[\s\S]*?return \([\s\S]*?<Suspense fallback=\{<LoadingSpinner \/>\}>[\s\S]*?<MockProfilePage \/>[\s\S]*?<\/Suspense>[\s\S]*?\);[\s\S]*?\}/,
  `// If no real Supabase user, redirect to login
  if (!user) {
    redirect('/auth');
  }`
);

fs.writeFileSync(file, content);
console.log("Updated profile/page.tsx");
