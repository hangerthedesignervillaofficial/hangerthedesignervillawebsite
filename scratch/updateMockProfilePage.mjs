import fs from 'fs';

let content = fs.readFileSync('src/app/profile/MockProfilePage.tsx', 'utf8');

// Remove the redirect effect
content = content.replace(/useEffect\(\(\) => \{\n    if \(\!loading && \!user\) \{\n      router\.push\("\/signin\?returnTo=\/profile"\);\n    \}\n  \}, \[user, loading, router\]\);/g, '');

// We need to add state for guest orders
// I will use multi_replace_file_content for this instead because it's safer.
