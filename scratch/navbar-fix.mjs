import fs from 'fs';
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// The static blocks start around line 93 and end right before menuData.map
// Let's use a regex to cut them out.
const startMarker = '<div className="relative flex items-center h-full group">\n            <Link\n              href="/bestsellers"';
const endMarker = '{menuData.map((item) => (';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = content.substring(0, startIndex) + content.substring(endIndex);
    fs.writeFileSync('src/components/Navbar.tsx', newContent);
    console.log("Successfully removed static links from Navbar.tsx");
} else {
    console.log("Could not find markers in Navbar.tsx");
}
