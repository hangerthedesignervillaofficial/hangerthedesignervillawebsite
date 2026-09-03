import fs from 'fs';

const file = 'src/app/admin/cms/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add general texts state
content = content.replace(
  /const \[slides, setSlides\] = useState<HeroSlide\[\]>\(\[\]\);/,
  `const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [activeTab, setActiveTab] = useState<'hero' | 'general'>('hero');
  const [generalSettings, setGeneralSettings] = useState({
    dressed_subtitle: "THE HANGER SPIRIT",
    dressed_title: "DRESSED TO MAKE AN IMPRESSION.",
    dressed_desc: "At Hanger, we believe fashion is an extension of who you are. Our collections bring together contemporary Indian elegance and timeless craftsmanship, handpicked for the modern woman who values the luxury of detail.",
    moments_subtitle: "STYLE FOR EVERY OCCASION",
    moments_title: "MOMENTS",
    moments_desc: "Discover our curated edits for your special moments."
  });`
);

// 2. Fetch general settings
content = content.replace(
  /if \(data && data\.value && Array\.isArray\(data\.value\)\) \{/,
  `
      const { data: generalData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "general_settings")
        .single();
        
      if (generalData && generalData.value) {
        setGeneralSettings({...generalSettings, ...generalData.value});
      }

      if (data && data.value && Array.isArray(data.value)) {`
);

// 3. Save general settings
const saveGeneralSettings = `
  const saveGeneralSettings = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("site_settings")
        .upsert({
          key: "general_settings",
          value: generalSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success("General settings saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };
`;
content = content.replace(
  /const addSlide = \(\) => \{/,
  `${saveGeneralSettings}\n  const addSlide = () => {`
);

// 4. Handle tab change in UI
const tabUI = `
        <div className="flex gap-4 border-b border-[#D4AF37]/20 mb-8">
          <button 
            onClick={() => setActiveTab('hero')}
            className={\`pb-3 px-2 font-sans text-[10px] font-bold tracking-[0.2em] uppercase \${activeTab === 'hero' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-[#7A6B5D] hover:text-[#2C1810]'}\`}
          >
            Hero Banner Slider
          </button>
          <button 
            onClick={() => setActiveTab('general')}
            className={\`pb-3 px-2 font-sans text-[10px] font-bold tracking-[0.2em] uppercase \${activeTab === 'general' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-[#7A6B5D] hover:text-[#2C1810]'}\`}
          >
            General Texts
          </button>
        </div>

        {activeTab === 'hero' ? (
`;

content = content.replace(
  /<div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-6 md:mb-8">/,
  `${tabUI}\n        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-6 md:mb-8">`
);

// 5. Close hero tab and add general tab
const generalUI = `
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="font-serif text-2xl text-[#2C1810]">General Texts</h2>
                <p className="font-sans text-[10px] text-[#7A6B5D] uppercase tracking-widest mt-1">Manage static text blocks across the homepage</p>
              </div>
              <button
                onClick={saveGeneralSettings}
                disabled={saving}
                className="bg-[#2C1810] text-[#D4AF37] hover:bg-[#4A0E17] hover:text-white px-6 py-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Texts</>}
              </button>
            </div>

            <div className="bg-white border border-[#D4AF37]/20 p-6 space-y-6 shadow-sm">
              <h3 className="font-serif text-lg text-[#2C1810] border-b border-[#D4AF37]/10 pb-2">"Dressed To Make An Impression" Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Subtitle</label>
                  <input
                    value={generalSettings.dressed_subtitle}
                    onChange={(e) => setGeneralSettings({...generalSettings, dressed_subtitle: e.target.value})}
                    className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-10 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Title</label>
                  <input
                    value={generalSettings.dressed_title}
                    onChange={(e) => setGeneralSettings({...generalSettings, dressed_title: e.target.value})}
                    className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-10 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Description</label>
                  <textarea
                    value={generalSettings.dressed_desc}
                    onChange={(e) => setGeneralSettings({...generalSettings, dressed_desc: e.target.value})}
                    rows={3}
                    className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810] resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#D4AF37]/20 p-6 space-y-6 shadow-sm">
              <h3 className="font-serif text-lg text-[#2C1810] border-b border-[#D4AF37]/10 pb-2">"Moments" Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Subtitle</label>
                  <input
                    value={generalSettings.moments_subtitle}
                    onChange={(e) => setGeneralSettings({...generalSettings, moments_subtitle: e.target.value})}
                    className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-10 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="font-sans text-[9px] font-bold tracking-[0.18em] text-[#7A6B5D] uppercase block mb-2">Title</label>
                  <input
                    value={generalSettings.moments_title}
                    onChange={(e) => setGeneralSettings({...generalSettings, moments_title: e.target.value})}
                    className="w-full border-b border-[#D4AF37]/25 border-t-0 border-l-0 border-r-0 bg-transparent h-10 px-0 text-sm focus:ring-0 focus:border-[#D4AF37] text-[#2C1810]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
`;

content = content.replace(
  /<\/div>\n    <\/div>\n  \);\n\}/,
  `      ${generalSettings}\n      </div>\n    </div>\n  );\n}`
).replace(
  `      ${generalSettings}\n`,
  `${generalUI}`
);

fs.writeFileSync(file, content);
console.log("Updated CMS Page with General Settings Tab");
