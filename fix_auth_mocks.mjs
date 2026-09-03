import fs from 'fs';

const file = 'src/hooks/useSupabaseAuth.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove mock setup in useEffect
content = content.replace(
  /    \/\/ Check if we have a mocked session[\s\S]*?\} catch \(e\) \{[\s\S]*?\}[\s\S]*?\}/,
  ``
);

// 2. Remove mock checks from onAuthStateChange and getSession
content = content.replace(
  /if \(typeof window !== 'undefined' && localStorage.getItem\('hanger_mock_session'\)\) return;/g,
  ``
);

// 3. Remove mock account check in signIn
content = content.replace(
  /      \/\/ Check for mock accounts[\s\S]*?toast\.success\('Signed in successfully \(Demo Mode\)'\);\n        return;\n      \}/,
  ``
);

// 4. Remove mock clearing in signOut
content = content.replace(
  /      if \(typeof window !== 'undefined'\) \{\n        localStorage\.removeItem\('hanger_mock_session'\);\n        document\.cookie = "hanger_mock_session_active=; path=\/; max-age=-1";\n      \}/,
  ``
);
content = content.replace(
  /      try \{\n        await supabase\.auth\.signOut\(\);\n      \} catch \(e\) \{\n        console\.error\("Supabase signOut error \(expected if mock\):", e\);\n      \}/,
  `      await supabase.auth.signOut();`
);

fs.writeFileSync(file, content);
console.log("Updated useSupabaseAuth.tsx");
