import fs from 'fs';

const file = 'src/components/home/MomentsBanner.tsx';
let content = fs.readFileSync(file, 'utf8');

const importSupabase = `import { supabase } from "@/lib/supabase/client";\nimport { useEffect, useState } from "react";`;
content = content.replace(
  /import Image from "next\/image";/,
  `import Image from "next/image";\n${importSupabase}`
);

const fetchState = `
  const [settings, setSettings] = useState({
    subtitle: "STYLE FOR EVERY OCCASION",
    title: "MOMENTS"
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "general_settings")
          .single();
          
        if (data && data.value) {
          setSettings({
            subtitle: data.value.moments_subtitle || "STYLE FOR EVERY OCCASION",
            title: data.value.moments_title || "MOMENTS"
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);
`;

content = content.replace(
  /export function MomentsBanner\(\) \{/,
  `export function MomentsBanner() {\n${fetchState}`
);

content = content.replace(
  /STYLE FOR EVERY OCCASION/g,
  `{settings.subtitle}`
);

content = content.replace(
  /MOMENTS/g,
  `{settings.title}`
);

fs.writeFileSync(file, content);
console.log("Updated MomentsBanner.tsx");
