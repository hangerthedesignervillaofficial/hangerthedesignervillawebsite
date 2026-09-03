import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Remove staticLinks rendering
content = content.replace(
`            {/* Static Links */}
            {staticLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => toggleSidebar()}
                className="py-3.5 px-2 text-[#2C1810] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all text-left font-sans text-[12px] font-bold tracking-[0.15em] uppercase rounded-sm"
              >
                {link.name}
              </Link>
            ))}`,
''
);

fs.writeFileSync('src/components/Sidebar.tsx', content);
