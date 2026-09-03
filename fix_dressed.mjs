import fs from 'fs';

const file = 'src/components/home/DressedToMakeImpression.tsx';
let content = fs.readFileSync(file, 'utf8');

const importSupabase = `import { supabase } from "@/lib/supabase/client";\nimport { useEffect, useState } from "react";`;
content = content.replace(
  /import Image from "next\/image";/,
  `import Image from "next/image";\n${importSupabase}`
);

const fetchState = `
  const [settings, setSettings] = useState({
    subtitle: "THE HANGER SPIRIT",
    title: "DRESSED TO MAKE\\nAN IMPRESSION.",
    desc: "At Hanger, we believe fashion is an extension of who you are. Our collections bring together contemporary Indian elegance and timeless craftsmanship, handpicked for the modern woman who values the luxury of detail."
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
            subtitle: data.value.dressed_subtitle || "THE HANGER SPIRIT",
            title: data.value.dressed_title || "DRESSED TO MAKE\\nAN IMPRESSION.",
            desc: data.value.dressed_desc || "At Hanger, we believe fashion is an extension of who you are. Our collections bring together contemporary Indian elegance and timeless craftsmanship, handpicked for the modern woman who values the luxury of detail."
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
  /export function DressedToMakeImpression\(\) \{/,
  `export function DressedToMakeImpression() {\n${fetchState}`
);

content = content.replace(
  /THE HANGER SPIRIT/g,
  `{settings.subtitle}`
);

content = content.replace(
  /DRESSED TO MAKE<br \/>AN IMPRESSION\./g,
  `{settings.title.split('\\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}`
);

content = content.replace(
  /At Hanger, we believe fashion is an extension of who you are\. Our collections bring together contemporary Indian elegance and timeless craftsmanship, handpicked for the modern woman who values the luxury of detail\./g,
  `{settings.desc}`
);
content = content.replace(
  /At Hanger, we believe fashion is an extension of who you are\. Our collections bring together contemporary Indian elegance and timeless craftsmanship for the way you live today\./g,
  `{settings.desc}`
);

fs.writeFileSync(file, content);
console.log("Updated DressedToMakeImpression.tsx");
