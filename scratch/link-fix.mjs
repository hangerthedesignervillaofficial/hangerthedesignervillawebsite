import fs from 'fs';
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Update href inside menuData.map in Navbar.tsx
content = content.replace(
`              <Link
                href={\`/category/\${item.category.id}\`}`,
`              <Link
                href={
                  item.category.id === -1 ? "/new-arrivals" :
                  item.category.id === -2 ? "/bestsellers" :
                  \`/category/\${item.category.id}\`
                }`
);

fs.writeFileSync('src/components/Navbar.tsx', content);

let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sidebarContent = sidebarContent.replace(
`                        <Link 
                          href={\`/category/\${item.category.id}\`} 
                          onClick={() => toggleSidebar()}`,
`                        <Link 
                          href={
                            item.category.id === -1 ? "/new-arrivals" :
                            item.category.id === -2 ? "/bestsellers" :
                            \`/category/\${item.category.id}\`
                          } 
                          onClick={() => toggleSidebar()}`
);

fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);
