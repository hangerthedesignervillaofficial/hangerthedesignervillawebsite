import fs from 'fs';

const filesToUpdate = [
  'src/components/home/HorizontalProductCarousel.tsx',
  'src/components/home/ShopByMood.tsx',
  'src/components/home/MomentsBanner.tsx',
  'src/components/home/DressedToMakeImpression.tsx'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Update main section headers
    content = content.replace(/font-serif text-2xl md:text-3xl font-light tracking-\[0\.15em\]/g, "font-serif text-2xl md:text-[32px] font-normal tracking-[0.2em]");
    content = content.replace(/font-serif text-xl font-light tracking-\[0\.15em\]/g, "font-serif text-xl md:text-2xl font-normal tracking-[0.2em]");
    
    // Update subtitles
    content = content.replace(/font-sans text-\[10px\] md:text-xs font-medium tracking-wider text-\[#7A6B5D\] uppercase/g, "font-sans text-[9px] md:text-[10px] font-bold tracking-[0.25em] text-[#7A6B5D] uppercase");
    content = content.replace(/font-sans text-\[9px\] font-medium tracking-wider text-\[#7A6B5D\] uppercase/g, "font-sans text-[8px] font-bold tracking-[0.25em] text-[#7A6B5D] uppercase");
    
    fs.writeFileSync(file, content);
  }
});

console.log("UI Polish Applied");
