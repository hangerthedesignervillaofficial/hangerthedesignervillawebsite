import fs from 'fs';

let file = 'src/components/home/MomentsBanner.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  /import \{ supabase \} from "@/lib\/supabase\/client";\nimport \{ useEffect, useState \} from "react";/,
  `import { supabase } from "@/lib/supabase/client";\nimport { useEffect, useState } from "react";`
);
if (!content.includes('import { useEffect, useState } from "react";')) {
    content = content.replace(
      /import \{ supabase \} from "@\/lib\/supabase\/client";/,
      `import { supabase } from "@/lib/supabase/client";\nimport { useEffect, useState } from "react";`
    );
}
fs.writeFileSync(file, content);


file = 'src/components/home/DressedToMakeImpression.tsx';
content = fs.readFileSync(file, 'utf8');
if (!content.includes('import { useEffect, useState } from "react";')) {
    content = content.replace(
      /import \{ supabase \} from "@\/lib\/supabase\/client";/,
      `import { supabase } from "@/lib/supabase/client";\nimport { useEffect, useState } from "react";`
    );
}
if (!content.includes('"use client";')) {
    content = `"use client";\n` + content;
}
fs.writeFileSync(file, content);

console.log("Updated imports");
